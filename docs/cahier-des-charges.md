# Cahier des charges — Générateur de patrons de base sur mesure

Version 1.0 — juillet 2026

## 1. Objet du projet

Application web statique générant des **patrons de base de couture sur mesure** (buste, manche, jupe, pantalon) à partir des mensurations de l'utilisateur, selon la méthode de construction géométrique de Teresa Gilewska (*Les Patrons de base sur mesure*, Eyrolles). L'application produit un tracé consultable à l'écran et exportable en SVG/PDF à l'échelle 1:1 pour impression et assemblage.

Le projet est hébergé sur GitHub, déployé automatiquement sur GitHub Pages, et développé avec Claude Code dans VS Code.

**Ce que le projet n'est pas (v1)** : pas de compte utilisateur, pas de backend, pas de transformation de patrons (élargissements, pivotements de pinces), pas de gradation multi-tailles. Le patron de base est produit **sans valeurs de couture ni aisance**, conformément à la méthode (l'aisance s'ajoute au moment de la transformation selon le modèle).

---

## 2. Principes directeurs

1. **Le moteur est indépendant de l'interface.** Toute la construction géométrique vit dans un module TypeScript pur (`src/engine/`), sans aucune dépendance à React ou au DOM. Il prend des mensurations, il rend de la géométrie. Testable en isolation, réutilisable (CLI, PDF, futur portage).
2. **Le code suit le livre, pas l'inverse.** Chaque étape de construction du code correspond à une étape numérotée de la méthode, avec un commentaire référençant la page du livre. Quand le tracé est faux, on doit pouvoir pointer l'étape fautive en la comparant au livre.
3. **Les constantes de la méthode sont centralisées et nommées.** Angles d'épaule (18°/26°), valeurs de bissectrices d'emmanchure (1,5/2,5 cm), plafonds de pinces (3 cm devant, 4 cm côté, 2 cm demi-dos), formules d'encolure (cou/6+1, cou/16)… tout vit dans un fichier `method.ts` unique, jamais en dur dans le code de construction.
4. **Tout point de construction est nommé et traçable.** Le moteur ne produit pas seulement un contour : il expose chaque point intermédiaire (saillant, extrémité d'épaule, point de carrure…) avec son identifiant. C'est ce qui permet le debug visuel, le mode pédagogique, et les dépendances entre pièces.
5. **Les pièces dépendent les unes des autres.** La manche se construit à partir de la longueur d'emmanchure *mesurée sur le buste tracé* (pas d'une formule sur les mensurations). Le moteur doit donc savoir mesurer ses propres courbes. Cette contrainte structure toute l'architecture : elle interdit de traiter chaque pièce comme une fonction isolée.

---

## 3. Périmètre fonctionnel

### 3.1 Saisie des mensurations

- Formulaire groupé par familles (contours, longueurs, largeurs, poitrine), unités en cm, pas de 0,5.
- **Validation à deux niveaux** : bornes physiques par mesure (erreur bloquante), et contrôles de cohérence issus de la méthode (avertissement non bloquant). Exemples de contrôles de cohérence : carrure devant < carrure dos (le livre indique qu'une carrure devant ≥ dos signale une erreur de prise de mesure) ; longueur devant > longueur dos ; tour de taille < tour de poitrine.
- Jeux de mesures : sauvegarde locale (localStorage) de plusieurs profils nommés, import/export JSON. Un profil de démonstration (les valeurs d'exemple du livre : poitrine 88, taille 68, bassin 92, cou 38) sert de référence de test.

### 3.2 Génération et affichage

- Pièces v1 : **demi-dos et demi-devant du buste**, disposés en miroir (milieu dos à gauche, milieu devant à droite, comme les planches du livre).
- Rendu SVG à l'écran avec zoom/pan, grille centimétrique, code couleur du livre (lignes de référence en rouge : milieux et taille ; tracé en noir ; lignes d'aide en gris).
- **Mode construction** activable : affiche les lignes d'aide (carrure, emmanchure, ligne de poitrine), les points nommés, et les valeurs calculées (largeur d'encolure, valeur de pince bretelle, répartition des pinces de taille).
- **Mode pas-à-pas** (bonus, cf. §5) : rejouer la construction étape par étape, chaque étape affichant son libellé — possible précisément parce que le moteur enregistre la séquence d'étapes.
- Panneau de valeurs calculées avec avertissements quand la méthode le prévoit (ex. valeur à absorber à la taille exigeant une pince supplémentaire).

### 3.3 Export

- **SVG échelle 1:1** : unités physiques en cm, carré de contrôle 10 cm, cartouche (mesures utilisées, date, pièce, mention « sans coutures »).
- **PDF multi-pages A4** (jalon M3) : tuilage du patron sur pages A4 avec marges d'impression, repères de collage (croix d'alignement et numérotation ligne/colonne), page de garde avec plan d'assemblage. C'est la fonctionnalité qui rend le projet réellement utilisable — la plupart des gens n'ont pas de traceur.

### 3.4 Pièces suivantes (après le buste)

Ordre recommandé : **jupe** (M4, la plus simple, valide le moteur sur une deuxième pièce), **manche** (M5, introduit la dépendance inter-pièces via la mesure d'emmanchure), **pantalon** (M6, la plus complexe : fourche, pli central).

---

## 4. Architecture technique

### 4.1 Stack

| Rôle | Choix | Justification |
|---|---|---|
| Build | Vite | Stack déjà maîtrisée (projet temple romain), support GitHub Pages trivial |
| UI | React 18 + TypeScript strict | idem |
| État | Zustand | Léger, déjà connu ; l'état est simple (mesures, options d'affichage) |
| Styles | Tailwind CSS v4 | Déjà maîtrisé |
| Tests | Vitest | Natif Vite ; le moteur étant pur, les tests sont rapides et sans DOM |
| PDF | jsPDF ou pdf-lib (à trancher en M3) | Génération client de PDF tuilé |
| CI/CD | GitHub Actions → GitHub Pages | Déploiement auto sur push main |

Aucune dépendance de géométrie externe : le noyau géométrique nécessaire est petit (§4.3) et l'écrire soi-même garantit de comprendre chaque tracé. Éviter paper.js/flatten-js qui apporteraient 100× plus que le besoin.

### 4.2 Arborescence

```
patrons/
├── CLAUDE.md                    # instructions projet pour Claude Code
├── docs/
│   ├── cahier-des-charges.md    # ce document
│   └── methode/                 # notes de méthode par pièce (cf. §6)
│       ├── buste.md
│       ├── jupe.md
│       └── ...
├── src/
│   ├── engine/                  # LE MOTEUR — TypeScript pur, zéro import React/DOM
│   │   ├── geometry/            # noyau géométrique générique
│   │   │   ├── point.ts         # Point, opérations vectorielles
│   │   │   ├── curve.ts         # splines/béziers, longueur d'arc, point à distance
│   │   │   ├── intersect.ts     # intersections ligne/ligne, ligne/courbe
│   │   │   └── path.ts          # assemblage de contours, aire, bounding box
│   │   ├── method.ts            # TOUTES les constantes de la méthode, commentées
│   │   ├── measurements.ts      # type Measurements + validation + cohérence
│   │   ├── drafting.ts          # le "plan de travail" : primitives de construction traçables
│   │   ├── pieces/
│   │   │   ├── buste.ts         # construction du buste (dos + devant)
│   │   │   ├── jupe.ts
│   │   │   ├── manche.ts
│   │   │   └── pantalon.ts
│   │   └── types.ts             # PatternPiece, Segment, Dart, Mark, DraftStep…
│   ├── render/
│   │   ├── svg.tsx              # rendu écran (React)
│   │   ├── export-svg.ts        # SVG autonome 1:1
│   │   └── export-pdf.ts        # tuilage A4 (M3)
│   ├── ui/                      # composants React (formulaire, panneaux, viewer)
│   ├── store.ts                 # Zustand : mesures, profils, options d'affichage
│   └── main.tsx
├── tests/
│   ├── geometry.test.ts
│   ├── buste.test.ts            # valeurs du livre en golden tests
│   └── invariants.test.ts       # propriétés vraies pour TOUTE mensuration valide
└── .github/workflows/deploy.yml
```

### 4.3 Le moteur : comment implémenter les règles

C'est le cœur du sujet. La méthode du livre est une **séquence d'opérations géométriques élémentaires** : « trace une perpendiculaire », « reporte telle mesure sur telle ligne », « divise telle distance par 3 », « trace une droite à 18° », « joins ces points par une courbe passant par… ». La bonne implémentation reproduit cette structure au lieu de la compiler en formules opaques.

**Étage 1 — Noyau géométrique** (`engine/geometry/`). Une dizaine de primitives pures, unité = centimètre, y vers le bas :

```ts
type Pt = { x: number; y: number };
add, sub, scale, dist, lerp            // vecteurs
polar(origin, angleDeg, length)        // point à angle/distance — sert pour les 18°/26°
perpFoot, project                      // projections
intersectLines(a1, a2, b1, b2)
splineThrough(points, tension): Curve  // Catmull-Rom → cubiques, pour emmanchures/encolures
curveLength(curve): number             // longueur d'arc — INDISPENSABLE pour la manche
pointAtLength(curve, s): Pt            // repères de montage, crans
```

Chaque primitive est testée unitairement avec des cas triviaux. C'est ennuyeux et ça prend une heure, mais ensuite plus aucun bug géométrique n'est ambigu : si le patron est faux, c'est la construction, pas la géométrie.

**Étage 2 — Plan de travail traçable** (`engine/drafting.ts`). Un petit objet `Draft` qui enregistre points nommés et étapes :

```ts
const d = new Draft("buste-dos");
d.point("A", { x: 0, y: 0 });                        // étape enregistrée avec libellé
d.point("taille", ..., "Ligne de taille : longueur du dos sous la ligne d'épaule");  // p.33 §3
d.lineRef("milieu-dos", ...);                         // ligne de référence (rouge)
d.curve("emmanchure", splineThrough([...]), "...");   // p.42-44
```

Chaque appel stocke `{ id, type, geometry, label, bookRef }` dans une liste ordonnée. Bénéfices concrets : le **mode pas-à-pas** de l'UI est gratuit (rejouer la liste) ; le **debug visuel** consiste à afficher tous les points nommés ; les **tests** peuvent cibler un point précis (`expect(d.get("saillant")).toBeCloseTo(...)`) ; et quand tu compares au livre, tu retrouves l'étape par sa référence de page.

**Étage 3 — Constructions par pièce** (`engine/pieces/buste.ts`). Une fonction pure par pièce :

```ts
function draftBuste(m: Measurements): { dos: PatternPiece; devant: PatternPiece; report: DraftReport }
```

Le corps de la fonction est une transcription linéaire des étapes du livre, dans l'ordre du livre, chaque bloc commenté avec le numéro d'étape et la page. Les valeurs dérivées (largeur d'encolure, valeur de pince bretelle, répartition des pinces) sont retournées dans `report` pour affichage et pour les tests.

`PatternPiece` est le format pivot entre moteur et rendu :

```ts
type Segment = { kind: "line"; a: Pt; b: Pt } | { kind: "curve"; c: Curve };
type PatternPiece = {
  id: string;
  outline: Segment[];              // contour fermé, ordonné
  refLines: Segment[];             // rouges : milieux, taille
  helpers: Segment[];              // gris : carrure, emmanchure, poitrine
  darts: Dart[];                   // { legs, apex, axis }
  marks: Mark[];                   // saillant, crans, DL (droit-fil)
  labels: Label[];
  steps: DraftStep[];              // la trace de construction
};
```

Le rendu écran, l'export SVG et l'export PDF consomment tous ce même format : trois consommateurs, un producteur, aucun calcul géométrique côté rendu.

**Étage 4 — Dépendances inter-pièces.** La manche exige la longueur de l'emmanchure dos + devant mesurée sur le buste tracé. Le générateur global orchestre :

```ts
function generate(m: Measurements): Pattern {
  const buste = draftBuste(m);
  const emmanchure = curveLength(buste.dos.get("emmanchure")) + curveLength(buste.devant.get("emmanchure"));
  const manche = draftManche(m, { emmanchure, carrureTotale: ... });
  ...
}
```

C'est pour cette raison que `curveLength` fait partie du noyau dès le départ, même si la v1 ne fait que le buste.

### 4.4 Points de vigilance géométriques (leçons du prototype)

- **Courbes** : la spline Catmull-Rom passe par les points imposés (extrémité d'épaule, carrure, bissectrice, platitude) mais sa forme entre les points dépend de la tension. Prévoir la tension comme paramètre par courbe dans `method.ts`, ajustable après comparaison visuelle avec les planches du livre.
- **Pince bretelle** : le livre égalise les longueurs des deux bras sur la longueur du premier bras, puis retrace la seconde moitié de la ligne d'épaule à 26° après fermeture. Le prototype simplifie (deux bras vers le saillant sans égalisation). À corriger dans le moteur : c'est le genre de « broutille » qui décale l'emmanchure.
- **Raccords au montage** : les longueurs de côté dos et devant doivent coïncider entre emmanchure et taille une fois les pinces déduites ; l'encolure dos et devant doivent se raccorder sans bec à l'épaule ; les épaules dos et devant ont la même longueur (hors valeur de pince). Ces propriétés sont des **invariants testables** (§4.5), pas des vérifications visuelles.
- **Répartition des pinces de taille** : la méthode donne des plafonds (3 cm pince devant, 4 cm côtés, 2 cm demi-dos, 1-2 cm milieu dos) et prévoit des pinces supplémentaires au-delà. La stratégie de répartition doit être une fonction pure isolée et testée sur des cas extrêmes (forte différence poitrine/taille), avec émission d'avertissements structurés plutôt que d'échouer.
- **Deux calculs de pince possibles** : le livre distingue le calcul poitrine−taille (appliqué en partie haute) et bassin−taille (partie basse). La v1 applique poitrine−taille en haut et laisse la couture de côté rejoindre la largeur bassin en bas ; documenter ce choix dans `docs/methode/buste.md`.

### 4.5 Stratégie de test

Trois familles, dans cet ordre de valeur :

1. **Golden tests sur les exemples du livre.** Le livre donne des exemples chiffrés : tour de cou 38 → largeur d'encolure 7,33 (arrondie 7,5), profondeur dos 2,38 (arrondie 2,5), profondeur devant 9,5 ; poitrine 88 / taille 68 / bassin 92 → 5 cm à absorber par quart en haut, 6 cm en bas. Chaque exemple devient un test. C'est la preuve que le code suit la méthode.
2. **Invariants sur mensurations aléatoires** (property-based léger : boucle sur 200 jeux de mesures valides tirés au hasard) : contour fermé, aucune auto-intersection, longueurs d'épaule dos = devant, raccord des côtés, largeur totale à la taille = tour de taille/4 après déduction des pinces, symétrie des pinces autour de leur axe.
3. **Snapshots SVG** pour détecter les régressions visuelles involontaires lors des refactors (comparer le SVG généré du profil de démo à une référence commitée).

Règle de travail avec Claude Code : **aucune modification du moteur sans test qui la couvre**. C'est ce qui permet d'itérer vite sur le rendu sans jamais casser silencieusement la construction.

---

## 5. Jalons

| Jalon | Contenu | Critère de sortie |
|---|---|---|
| **M0** | Scaffolding : Vite + TS strict + Tailwind + Vitest, workflow GitHub Actions → Pages, page « hello » déployée | Le site est en ligne sur `<user>.github.io/patrons` |
| **M1** | Noyau géométrique + `Draft` + buste complet dans le moteur, golden tests du livre au vert | `draftBuste(demo)` passe tous les tests, sans UI |
| **M2** | UI : formulaire validé, profils localStorage, viewer SVG zoom/pan, mode construction, panneau des valeurs | Le buste du profil démo s'affiche conforme aux planches du livre |
| **M3** | Exports : SVG 1:1 + PDF A4 tuilé avec repères d'assemblage | Un patron imprimé et scotché a le bon carré test de 10 cm |
| **M4** | Jupe (moteur + tests + UI) | |
| **M5** | Manche, avec mesure d'emmanchure inter-pièces + vérification tête de manche | |
| **M6** | Pantalon | |
| **M7+** | Mode pas-à-pas, pinces supplémentaires automatiques, transformations de base | |

Chaque jalon = une branche, une PR, le déploiement Pages se fait au merge sur `main`.

---

## 6. Méthode de travail avec Claude Code

- **`CLAUDE.md`** à la racine : résumé de l'architecture (§4), conventions (moteur pur, constantes dans `method.ts`, tout point nommé, tests obligatoires sur le moteur), commandes (`npm run dev/test/build`), et renvoi vers `docs/methode/`.
- **`docs/methode/<piece>.md`** : pour chaque pièce, AVANT de coder, rédiger la transcription des étapes de construction en langage clair (tes propres notes de lecture du livre : étapes numérotées, formules, valeurs, références de pages). C'est le document que Claude Code lit pour implémenter — il fait autorité sur le code, et c'est toi qui le valides livre en main. Ce découplage (notes de méthode ↔ code) évite que des approximations s'installent dans le code sans trace.
- Boucle de développement par pièce : 1) rédiger/valider `docs/methode/<piece>.md`, 2) écrire les golden tests attendus, 3) implémenter la construction jusqu'au vert, 4) contrôle visuel contre les planches du livre, 5) ajuster tensions de courbes et détails, 6) invariants.
- Le prototype React/SVG existant sert de référence de départ pour M1/M2 (structure de `draft()`, rendu miroir, export SVG cm) mais le code du moteur est réécrit proprement sur l'architecture ci-dessus, pas copié.

---

## 7. Contraintes et licence

- Application 100 % statique, aucune donnée ne quitte le navigateur (mensurations = données personnelles ; à mentionner dans le README).
- Le dépôt ne contient **aucune reproduction du livre** (ni scans, ni texte, ni schémas). Les notes de `docs/methode/` sont des reformulations personnelles de la méthode ; le livre est cité comme référence bibliographique. Si le dépôt est public, licence code libre (MIT) sur le code uniquement.
- Compatibilité : navigateurs evergreen desktop en priorité ; le mobile affiche mais l'usage réel (impression) est desktop.
