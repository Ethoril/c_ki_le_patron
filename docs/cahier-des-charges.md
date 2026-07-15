# Cahier des charges — Générateur de patrons de base sur mesure

Version 1.1 — juillet 2026

> **Évolution du plan initial — 15 juillet 2026.** La version 1.1 ajoute un
> chantier d'architecture pour représenter les dépendances, les états de
> fermeture/assemblage et les variantes du patron. Cet apport provient d'une
> analyse comparative entre les notes de méthode validées, une lecture
> indépendante et le moteur actuel. Il est détaillé dans
> [`docs/architecture/evolution-graphe-construction.md`](architecture/evolution-graphe-construction.md).
> Il ne modifie pas l'autorité de `docs/methode/<piece>.md` sur les tracés.

## 1. Objet du projet

Application web statique générant des **patrons de base de couture sur mesure** (buste, manche, jupe, pantalon) à partir des mensurations de l'utilisateur, selon la méthode de construction géométrique de Teresa Gilewska (*Les Patrons de base sur mesure*, Eyrolles). L'application produit un tracé consultable à l'écran et exportable en SVG/PDF à l'échelle 1:1 pour impression et assemblage.

Le projet est hébergé sur GitHub, déployé automatiquement sur GitHub Pages, et développé avec Claude Code dans VS Code.

**Ce que le projet n'est pas (v1)** : pas de compte utilisateur, pas de backend, pas de transformation de patrons (élargissements, pivotements de pinces), pas de gradation multi-tailles. Le patron de base est produit **sans valeurs de couture**, conformément à la méthode ; une **aisance optionnelle** (défaut 2 cm au tour, réglable de 0 à 5) élargit le gabarit — à 0, le tracé est exactement celui du livre.

---

## 2. Principes directeurs

1. **Le moteur est indépendant de l'interface.** Toute la construction géométrique vit dans un module TypeScript pur (`src/engine/`), sans aucune dépendance à React ou au DOM. Il prend des mensurations, il rend de la géométrie. Testable en isolation, réutilisable (CLI, PDF, futur portage).
2. **Le code suit le livre, pas l'inverse.** Chaque étape de construction du code correspond à une étape numérotée de la méthode, avec un commentaire référençant la page du livre. Quand le tracé est faux, on doit pouvoir pointer l'étape fautive en la comparant au livre.
3. **Les constantes de la méthode sont centralisées et nommées.** Angles d'épaule (18°/26°), valeurs de bissectrices d'emmanchure (1,5/2,5 cm), plafonds de pinces (3 cm devant, 4 cm côté, 2 cm demi-dos), formules d'encolure (cou/6+1, cou/16)… tout vit dans un fichier `method.ts` unique, jamais en dur dans le code de construction.
4. **Tout point de construction est nommé et traçable.** Le moteur ne produit pas seulement un contour : il expose chaque point intermédiaire (saillant, extrémité d'épaule, point de carrure…) avec son identifiant. C'est ce qui permet le debug visuel, le mode pédagogique, et les dépendances entre pièces.
5. **Les pièces dépendent les unes des autres.** La manche se construit à partir de la longueur d'emmanchure *mesurée sur le buste tracé* (pas d'une formule sur les mensurations). Le moteur doit donc savoir mesurer ses propres courbes. Cette contrainte structure toute l'architecture : elle interdit de traiter chaque pièce comme une fonction isolée.
6. **La méthode et l'architecture ont des autorités séparées.** `docs/methode/` décrit ce qu'il faut tracer et fait autorité sur la géométrie ; `docs/architecture/` décrit comment le moteur représente, vérifie et dérive ce tracé. Une proposition d'architecture ne peut jamais modifier silencieusement une règle de méthode. Toute étape et toute correction conservent leur origine (`method`, `project-choice` ou `fitting`) et leur statut de validation.

---

## 3. Périmètre fonctionnel

### 3.1 Saisie des mensurations

- Formulaire groupé par familles (contours, longueurs, largeurs, poitrine, réglages), unités en cm, pas de 0,5.
- **Champs optionnels** (vides = comportement du livre, `docs/methode/buste.md` §Extensions hors livre) : **pente d'épaule** (dénivelé mesuré, remplace les angles 18°/26°), **aisance globale** (0–5 cm au tour, défaut 2 ; 0 = patron de base du livre strict) et **hauteur de bassin** (taille → bassin ; vide = standard 20 cm de la méthode, `generalites.md` §6).
- **Validation à deux niveaux** : bornes physiques par mesure (erreur bloquante), et contrôles de cohérence issus de la méthode (avertissement non bloquant). Exemples de contrôles de cohérence : carrure devant < carrure dos (le livre indique qu'une carrure devant ≥ dos signale une erreur de prise de mesure) ; longueur devant > longueur dos ; tour de taille < tour de poitrine.
- Jeux de mesures : sauvegarde locale (localStorage) de plusieurs profils nommés, import/export JSON. Un profil de démonstration (les valeurs d'exemple du livre : poitrine 88, taille 68, bassin 92, cou 38) sert de référence de test.

### 3.2 Génération et affichage

- Pièces v1 : **demi-dos et demi-devant du buste**, disposés en miroir (milieu dos à gauche, milieu devant à droite, comme les planches du livre).
- Rendu SVG à l'écran avec zoom/pan, grille centimétrique, code couleur du livre (lignes de référence en rouge : milieux et taille ; tracé en noir ; lignes d'aide en gris).
- **Mode construction** activable : affiche les lignes d'aide (carrure, emmanchure, ligne de poitrine), les points nommés, et les valeurs calculées (largeur d'encolure, valeur de pince bretelle, répartition des pinces de taille). Les libellés des points sont placés par un calque anti-chevauchement calculé sur toutes les pièces à la fois (`ConstructionLabels` dans `render/svg.tsx`) : ancrage vers l'extérieur du dessin (noms du dos à gauche, du devant à droite, pour dégager l'entre-pièces), désempilage vertical itératif des noms qui se recouvrent, et trait de rappel vers le point quand le libellé s'est éloigné.
- **Mode pas-à-pas** (bonus, cf. §5) : rejouer la construction étape par étape, chaque étape affichant son libellé — possible précisément parce que le moteur enregistre la séquence d'étapes.
- Panneau de valeurs calculées avec avertissements quand la méthode le prévoit (ex. valeur à absorber à la taille exigeant une pince supplémentaire).

### 3.3 Export

- **SVG échelle 1:1** : unités physiques en cm, carré de contrôle 5 cm (demande de l'utilisatrice finale — tient sur une page A4 tuilée), cartouche (mesures utilisées, date, pièce, mention « sans coutures »).
- **PDF multi-pages A4** (jalon M3) : tuilage du patron sur pages A4 avec marges d'impression, repères de collage (croix d'alignement et numérotation ligne/colonne), page de garde avec plan d'assemblage. C'est la fonctionnalité qui rend le projet réellement utilisable — la plupart des gens n'ont pas de traceur.
- **Gabarit « sans pinces »** (option d'export future, hors v1) : le même tracé porte deux patrons (Gilewska p. 86-89) — le gabarit seul (tee-shirts, tuniques larges, tissus extensibles) et le patron complet avec pinces. Le gabarit est un sous-produit naturel du moteur (contour avant application des pinces, `buste.md` §20).

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
│   ├── architecture/            # évolutions du modèle moteur, hors autorité de méthode
│   │   └── evolution-graphe-construction.md
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
splineThrough(points, tension, tangentes?): Curve  // Catmull-Rom → cubiques ; directions de tangente imposables par point
hermite(p0, t0, p1, t1): Curve         // cubique par points + tangentes — encolures, virages à courbure continue
concatCurves(...curves): Curve         // assemble des courbes contiguës (ex. spline + virage d'emmanchure)
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
- **Pince bretelle** : le livre égalise les longueurs des deux bras sur la longueur du premier bras, puis retrace la seconde moitié de la ligne d'épaule à 26° après fermeture. Le moteur effectue cette égalisation par rotation autour du saillant, mesure les largeurs `δ(y)` interceptées par le triangle, puis reporte carrure, bissectrice, platitude et dessous-bras vers l'extérieur sur le patron ouvert. L'invariant porte sur les **largeurs utiles après absorption** (`largeur ouverte − δ`), pas sur des coordonnées ouvertes inchangées.
- **Raccords au montage** : les longueurs de côté dos et devant doivent coïncider entre emmanchure et bassin une fois les pinces déduites ; l'encolure dos et devant doivent se raccorder sans bec à l'épaule. Avec la vraie pince dos de M3.1, on contrôle les longueurs dans l'état fermé ; la variante absorbée documentée conserverait 1 cm d'embu dos sur devant. Ces propriétés sont des **invariants testables** (§4.5), pas des vérifications visuelles.
- **Répartition des pinces de taille** : la méthode donne des plafonds (3 cm pince devant, 4 cm côtés, 2 cm demi-dos, 1-2 cm milieu dos) et prévoit des pinces supplémentaires au-delà. La stratégie de répartition doit être une fonction pure isolée et testée sur des cas extrêmes (forte différence poitrine/taille), avec émission d'avertissements structurés plutôt que d'échouer.
- **Deux calculs de pince possibles** : le livre distingue le calcul poitrine−taille (appliqué en partie haute) et bassin−taille (partie basse). Le moteur fixe une bouche unique pour les pinces intérieures à partir du calcul haut ; en partie basse, la pince de côté absorbe le reste afin que les deux calculs rejoignent le même point de taille. Cette lecture est documentée dans `docs/methode/buste.md` et testée sur l'exemple 88/68/92.

### 4.5 Stratégie de test

Trois familles, dans cet ordre de valeur :

1. **Golden tests sur les exemples du livre.** Le livre donne des exemples chiffrés : tour de cou 38 → largeur d'encolure exacte 7,33 (affichée 7,5), profondeur dos exacte 2,375 (affichée 2,5), profondeur devant exacte 9,33 (affichée 9,5) ; poitrine 88 / taille 68 / bassin 92 → 5 cm à absorber par quart en haut, 6 cm en bas. Chaque exemple devient un test. C'est la preuve que le code suit la méthode.
2. **Invariants sur mensurations aléatoires** (property-based léger : boucle sur 200 jeux de mesures valides tirés au hasard) : contour fermé, aucune auto-intersection, relation d'épaule conforme à la variante choisie (vraie pince contrôlée fermée ou option absorbée avec 1 cm d'embu), raccord des côtés, largeur totale à la taille = tour de taille/4 après déduction des pinces, symétrie des pinces autour de leur axe.
3. **Snapshots SVG** pour détecter les régressions visuelles involontaires lors des refactors (comparer le SVG généré du profil de démo à une référence commitée).

Règle de travail avec Claude Code : **aucune modification du moteur sans test qui la couvre**. C'est ce qui permet d'itérer vite sur le rendu sans jamais casser silencieusement la construction.

### 4.6 Apport postérieur au plan initial : graphe de construction et états assemblés

Cette section inscrit au cahier des charges une évolution proposée le
**15 juillet 2026**, après comparaison de quatre sources locales :

1. les transcriptions validées `docs/methode/generalites.md` et
   `docs/methode/buste.md` ;
2. les lectures indépendantes `docs/methode/generalites-codex.md` et
   `docs/methode/buste-codex.md` ;
3. le moteur réellement implémenté ;
4. les golden tests, invariants aléatoires et snapshots existants.

Le document de décision complet est
[`docs/architecture/evolution-graphe-construction.md`](architecture/evolution-graphe-construction.md).
Il consigne également les propositions rejetées, pour éviter qu'elles ne soient
réintroduites sans validation.

#### Objectif ajouté

Faire évoluer progressivement `Draft` et `PatternPiece` vers un **graphe de
construction traçable** capable de :

- relier chaque résultat à ses mesures, constantes et étapes sources ;
- fermer et rouvrir les pinces par transformations réversibles ;
- vérifier et rectifier les coutures dans une vue assemblée temporaire ;
- distinguer ligne de couture, contour de coupe, aisance et marge ;
- représenter les relations entre coutures partenaires et leurs crans ;
- dériver des variantes immuables sans modifier la base ;
- enregistrer les corrections d'essayage avec leur état et leur provenance ;
- invalider les pièces dépendantes, notamment la manche après modification de
  l'emmanchure.

#### Décisions méthodologiques protégées

L'évolution d'architecture ne doit pas changer les décisions suivantes :

- les formules d'encolure sont calculées avec leurs valeurs exactes ; l'arrondi
  au demi-centimètre supérieur est réservé à l'affichage ;
- sur le patron de buste actuel, les pinces de poitrine rejoignent le saillant ;
  l'arrêt environ 2 cm avant la pointe appartient aux instructions de montage ;
- les mesures supplémentaires de profondeur d'encolure et de galbe d'épaule
  sont des vérifications ou corrections explicites, pas des remplacements
  silencieux des formules nominales ;
- une cohérence morphologique atypique reste un avertissement non bloquant tant
  qu'une règle validée n'impose pas son rejet ;
- les références de pages proviennent des notes validées, pas des plages
  approximatives de la lecture indépendante.

#### Consolidations fonctionnelles ajoutées au plan

Trois corrections du buste sont désormais planifiées séparément des refactors :

1. tracer la vraie pince d'épaule dos, l'épaule étant rectifiée à 18° pince
   fermée ; conserver l'option absorbée comme variante documentée ;
2. construire ou, au minimum, vérifier l'encolure dos/devant dans une vue
   épaules assemblées ;
3. vérifier l'emmanchure complète après fermeture des pinces d'épaule et
   invalider les dépendances si elle est retracée.

Chaque consolidation suit la boucle de travail du §6 et assume explicitement
toute modification du snapshot SVG.

#### Phasage

- **Phase A — sans changement de tracé :** provenance, dépendances et coutures
  nommées ; compatibilité avec les `PatternPiece` actuelles.
- **Phase B — consolidation du buste :** transformations de pinces, vraie pince
  dos, encolure et emmanchure assemblées.
- **Phase C — avant M5 :** relations de couture, crans attachés aux courbes et
  invalidation buste → manche.
- **Phase D — M7+ :** variantes de toile et de coupe, marges, corrections
  d'essayage et base corrigée.

M3 n'est pas élargi par cet apport : le PDF tuilé reste livrable sur le format
actuel. La phase A peut être menée sans modifier le rendu ; les phases B à D
font chacune l'objet d'une branche et d'une PR dédiées.

La fermeture interne d'une pince pour rectification ou contrôle n'est pas une
fonction de transformation de patron offerte en v1 : c'est un mécanisme de
calcul nécessaire à la fidélité du patron de base. Le périmètre fonctionnel du
§1 reste donc inchangé.

---

## 5. Jalons

| Jalon | Contenu | Critère de sortie |
|---|---|---|
| **M0** | Scaffolding : Vite + TS strict + Tailwind + Vitest, workflow GitHub Actions → Pages, page « hello » déployée | Le site est en ligne sur `<user>.github.io/patrons` |
| **M1** | Noyau géométrique + `Draft` + buste complet dans le moteur, golden tests du livre au vert | `draftBuste(demo)` passe tous les tests, sans UI |
| **M2** | UI : formulaire validé, profils localStorage, viewer SVG zoom/pan, mode construction, panneau des valeurs | Le buste du profil démo s'affiche conforme aux planches du livre |
| **M3** ✅ | Exports : SVG 1:1 + PDF A4 tuilé avec repères d'assemblage | Accepté par décision de projet le 15 juillet 2026 sur la base des tests automatiques ; contrôle physique du carré de 5 cm reporté et toujours recommandé |
| **M3.1** ✅ | Consolidation du buste : transformations réversibles de pinces, vraie pince d'épaule dos, vérification assemblée de l'encolure et de l'emmanchure (§4.6 phase B) | Transformations, golden tests et invariants fermés/assemblés au vert ; contrôle visuel effectué ; snapshot mis à jour explicitement le 15 juillet 2026 |
| **M4** | Jupe (moteur + tests + UI) | |
| **M5** | Manche, avec mesure d'emmanchure inter-pièces + vérification tête de manche. Introduire avant ou pendant ce jalon les relations de couture, les crans attachés par distance curviligne et l'invalidation de la manche quand l'emmanchure change (§4.6 phase C). Prévoir le **cran de montage à 1/3 de la longueur d'emmanchure mesurée sur la courbe** (repère dos/devant pour poser la manche — pratique relevée le 2026-07-07 en comparant une méthode tierce, anicka.design) | Toute modification de l'emmanchure invalide puis régénère la manche ; coutures et crans conservent leur provenance |
| **M6** | Pantalon | |
| **M7+** | Mode pas-à-pas, pinces supplémentaires automatiques, transformations de base, variantes de toile/coupe et corrections d'essayage sourcées (§4.6 phase D). Inclure une **check-list d'essayage de la toile** guidée : pas de plis de tension à l'encolure dos ni à l'emmanchure, milieux et coutures de côté d'aplomb ; sur le patron, les pinces de poitrine rejoignent le saillant, tandis que l'épinglage s'arrête environ 2 cm avant chaque pointe (`buste.md` C15, p. 75) | Une base corrigée peut être restituée sans élargissement ni marge ; chaque correction conserve observation, état d'assemblage, côté et provenance |

Chaque jalon = une branche, une PR, le déploiement Pages se fait au merge sur `main`.

---

## 6. Méthode de travail avec Claude Code

- **`CLAUDE.md`** à la racine : résumé de l'architecture (§4), conventions (moteur pur, constantes dans `method.ts`, tout point nommé, tests obligatoires sur le moteur), commandes (`npm run dev/test/build`), et renvoi vers `docs/methode/`.
- **`docs/methode/<piece>.md`** : pour chaque pièce, AVANT de coder, rédiger la transcription des étapes de construction en langage clair (tes propres notes de lecture du livre : étapes numérotées, formules, valeurs, références de pages). C'est le document que Claude Code lit pour implémenter — il fait autorité sur le code, et c'est toi qui le valides livre en main. Ce découplage (notes de méthode ↔ code) évite que des approximations s'installent dans le code sans trace.
- **`docs/architecture/*.md`** : décisions de structure du moteur, origine de la proposition, alternatives rejetées, phasage et critères d'acceptation. Ces documents ne peuvent pas remplacer ni corriger une note de méthode ; ils expliquent comment implémenter et vérifier une règle déjà validée.
- Boucle de développement par pièce : 1) rédiger/valider `docs/methode/<piece>.md`, 2) écrire les golden tests attendus, 3) implémenter la construction jusqu'au vert, 4) contrôle visuel contre les planches du livre, 5) ajuster tensions de courbes et détails, 6) invariants.
- Le prototype React/SVG existant sert de référence de départ pour M1/M2 (structure de `draft()`, rendu miroir, export SVG cm) mais le code du moteur est réécrit proprement sur l'architecture ci-dessus, pas copié.

---

## 7. Contraintes et licence

- Application 100 % statique, aucune donnée ne quitte le navigateur (mensurations = données personnelles ; à mentionner dans le README).
- Le dépôt ne contient **aucune reproduction du livre** (ni scans, ni texte, ni schémas). Les notes de `docs/methode/` sont des reformulations personnelles de la méthode ; le livre est cité comme référence bibliographique. Si le dépôt est public, licence code libre (MIT) sur le code uniquement.
- Compatibilité : navigateurs evergreen desktop en priorité ; le mobile affiche mais l'usage réel (impression) est desktop.

---

## 8. Historique des apports au plan initial

| Version | Date | Apport | Provenance |
|---|---|---|---|
| 1.0 | juillet 2026 | Plan initial : moteur pur, points nommés, buste, UI, exports et pièces suivantes | Cahier des charges d'origine |
| 1.1 | 15 juillet 2026 | Graphe de construction, provenance, transformations réversibles de pinces, vues assemblées, relations de couture, variantes immuables et corrections d'essayage ; ajout de M3.1 et préparation de M5/M7+ | Analyse comparative documentée dans `docs/architecture/evolution-graphe-construction.md` |

### Décisions de clôture

- **M3 — 15 juillet 2026 :** jalon accepté sur la base de la génération PDF,
  des tests de tuilage, du contrôle du format A4 et du carré de contrôle inclus.
  L'impression et l'assemblage physiques n'étaient pas réalisables au moment
  de la clôture ; ils restent une vérification différée, sans bloquer M3.1.
