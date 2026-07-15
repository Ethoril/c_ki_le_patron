# Évolution proposée — graphe de construction, états assemblés et provenance

> **Statut : architecture adoptée. Phases A et B implémentées dans M3.1 le
> 15 juillet 2026 ; phases C et D planifiées.**
>
> **Origine :** analyse comparative menée le 15 juillet 2026 entre les notes
> indépendantes `docs/methode/*-codex.md`, les transcriptions validées
> `docs/methode/generalites.md` et `docs/methode/buste.md`, le moteur actuel et
> ses tests.
>
> **Autorité :** ce document ne décrit pas la méthode Gilewska et ne remplace
> aucune note de `docs/methode/`. Il décrit une manière de mieux représenter,
> vérifier et faire évoluer les constructions déjà validées. En cas de conflit,
> `docs/methode/<piece>.md` fait foi. Toute évolution qui modifie un tracé doit
> d'abord être inscrite et validée dans la note de méthode de la pièce, puis
> couverte par des tests.

## 1. Pourquoi cette évolution est proposée

Le moteur actuel remplit correctement le besoin des premiers jalons : il prend
des mensurations, enregistre des points et des courbes nommés, puis produit des
`PatternPiece` consommées par l'écran et les exports.

Cette représentation devient cependant trop courte dès qu'il faut :

- fermer une pince pour rectifier une couture, puis restituer le patron ouvert ;
- vérifier une encolure ou une emmanchure dans l'état réellement assemblé ;
- distinguer ligne de couture, contour de coupe, aisance et marge ;
- attacher un cran à une couture de manière stable après retracé ;
- reporter une correction d'essayage sans écraser les mensurations brutes ;
- invalider la manche lorsqu'une emmanchure dont elle dépend a changé ;
- expliquer précisément de quelles mesures et de quelles étapes vient un point.

La proposition consiste à faire évoluer progressivement le moteur d'un
registre de géométries finales vers un **graphe de construction traçable**,
capable de produire plusieurs états dérivés sans perdre la base ni la
provenance.

Cette évolution ne doit pas modifier le SVG actuel par simple changement de
structure. Une modification visuelle ne peut apparaître que dans une étape
fonctionnelle dédiée, documentée dans la note de méthode et couverte par un
snapshot assumé.

## 2. Décisions issues de la comparaison

### 2.1 Apports retenus

Les idées suivantes sont retenues comme orientations d'architecture :

1. enrichir chaque étape avec ses dépendances, ses entrées et sa provenance ;
2. représenter les fermetures de pinces par des transformations rigides
   réversibles ;
3. rectifier les coutures dans l'état pertinent, notamment pince fermée ou
   pièces assemblées ;
4. distinguer les coutures des contours de coupe et des lignes d'aide ;
5. représenter les relations entre coutures partenaires ;
6. attacher les crans à une couture par distance curviligne plutôt que par une
   coordonnée absolue ;
7. dériver explicitement les variantes du patron sans muter la base ;
8. enregistrer les corrections d'essayage comme des surcharges sourcées ;
9. propager l'invalidation vers les pièces dépendantes ;
10. tester les constructions dans leurs états ouvert, fermé et assemblé.

### 2.2 Propositions écartées ou corrigées

Les points suivants, présents dans les notes indépendantes, ne doivent pas être
introduits dans le moteur :

- **Arrondi géométrique de l'encolure : refusé.** Les valeurs exactes servent à
  la construction. L'arrondi au demi-centimètre supérieur reste une convention
  d'affichage.
- **Recul dessiné de 2 cm aux pointes de poitrine : refusé pour le buste de
  base actuel.** Sur le patron, la pince bretelle et la pince de taille
  rejoignent le saillant. L'arrêt environ 2 cm avant la pointe est une consigne
  de montage de la toile, pas une modification du contour de la pince.
- **Mesures de vérification injectées silencieusement dans le tracé : refusé.**
  La profondeur d'encolure mesurée et le galbe d'épaule peuvent devenir des
  corrections explicites, avec provenance, après la construction nominale.
- **Carrure devant supérieure ou égale au dos comme erreur bloquante : non
  retenu.** Le moteur conserve un avertissement non bloquant tant qu'aucune
  règle validée ne justifie de refuser une morphologie saisie.
- **Références de pages approximatives : refusées.** Les références précises
  des notes validées doivent être reprises dans les étapes et les tests.

### 2.3 Point à traiter comme évolution fonctionnelle, pas comme refactor

La **vraie pince d'épaule dos** est prescrite par la note de méthode actuelle,
mais le moteur utilise encore l'option où sa valeur est absorbée dans l'épaule.
La tracer constitue une correction fonctionnelle du buste, pas une simple
évolution de types. Elle doit donc faire l'objet d'une étape dédiée avec golden
tests, invariants, contrôle visuel et snapshot volontairement mis à jour.

## 3. Modèle cible

Les noms de types ci-dessous décrivent les responsabilités. Ils ne figent pas
encore l'API TypeScript définitive.

### 3.1 Étapes et provenance

Le `DraftStep` actuel enregistre un identifiant, un type, une géométrie, un
libellé et une référence. Il serait enrichi de façon compatible :

```ts
type DraftStep = {
  id: string;
  type: DraftStepType;
  geometry: Geometry;
  label?: string;
  bookRef?: string;
  dependsOn: string[];
  inputs: Record<string, number | string>;
  origin: "method" | "project-choice" | "fitting";
  status: "validated" | "interpretation" | "to-validate";
  diagnostics: Diagnostic[];
};
```

Règles :

- `dependsOn` contient les identifiants des mesures, points, courbes ou étapes
  réellement consommés ;
- `inputs` enregistre les valeurs utiles à l'explication, sans dupliquer tout
  le profil ;
- `origin` distingue une règle du livre, une décision propre au projet et une
  correction issue d'un essayage ;
- `status` empêche une transcription non validée d'apparaître comme une
  constante certaine ;
- les étapes antérieures restent immuables ; une correction produit une
  nouvelle étape.

Les appels actuels de `Draft` doivent continuer à fonctionner pendant la
migration, avec des valeurs par défaut explicites. L'ajout de provenance seul
ne doit changer aucune coordonnée.

### 3.2 Pinces et transformations réversibles

Une pince ne doit plus être uniquement un tracé en V ou en losange. Elle doit
également décrire l'opération permettant de la fermer :

```ts
type Dart = {
  id: string;
  legs: [Pt, Pt];
  pivot: Pt;
  axis: [Pt, Pt];
  value: number;
  lowerTip?: Pt;
  waistFlatCm?: number;
  foldToward?: "center" | "side" | "custom";
  closeTransform: RigidTransform;
  assemblyInstruction?: {
    stitchStopBeforeTipCm?: number;
  };
};
```

La distinction importante est la suivante :

- `pivot` appartient à la géométrie du patron et sert aux rotations ;
- `stitchStopBeforeTipCm` est une instruction de montage et ne déplace pas la
  pointe dessinée ;
- une éventuelle pointe cousue différente du pivot ne sera ajoutée à la
  géométrie que si une note de méthode la prescrit explicitement pour une
  pièce donnée.

Le noyau géométrique devra fournir au minimum :

```ts
applyTransform(point, transform)
invertTransform(transform)
composeTransforms(a, b)
closeDart(dart, geometry)
reopenDart(dart, geometry)
```

Invariants obligatoires :

- fermeture puis réouverture restitue tout point non rectifié dans la
  tolérance numérique définie ;
- les deux jambes destinées à être superposées ont la même longueur de couture ;
- la rectification effectuée pince fermée est correctement transportée vers
  l'état ouvert ;
- le chapeau de pince est produit depuis la ligne rectifiée, pas par une
  formule indépendante.

### 3.3 Coutures et relations d'assemblage

`PatternPiece.outline` est aujourd'hui à la fois un contour visuel et le seul
support des vérifications. Le modèle cible distingue :

```ts
type Seam = {
  id: string;
  path: Segment[];
  from: string;
  to: string;
};

type SeamRelation = {
  id: string;
  first: SeamRef;
  second: SeamRef;
  orientation: "same" | "reversed";
  lengthPolicy: "equal" | "ease-first" | "ease-second";
  notches: NotchPair[];
};
```

Applications immédiates :

- côté dos ↔ côté devant : longueurs égales et crans homologues ;
- épaule dos ↔ épaule devant : politique dépendant de la pince d'épaule
  choisie ;
- emmanchure ↔ tête de manche : relation avec embu contrôlé au jalon M5 ;
- taille buste ↔ future pièce associée : relation explicite si nécessaire.

Un cran est stocké par distance depuis une ancre ou par abscisse curviligne
normalisée. Il suit ainsi un retracé de la courbe et peut être projeté ensuite
sur le contour de coupe.

### 3.4 Vues d'assemblage temporaires

Une `AssemblyView` applique des transformations sans modifier les pièces
sources. Elle sert à :

1. fermer les pinces concernées ;
2. orienter et superposer les coutures partenaires ;
3. mesurer continuité, angle, tangence et longueur ;
4. rectifier si la note de méthode le prévoit ;
5. transporter la rectification vers les pièces ouvertes.

Premiers usages sur le buste :

- encolure dos + devant, épaules assemblées, sans bec au raccord ;
- emmanchure complète, pinces d'épaule fermées, sans angle ni creux ;
- épaule avec vraie pince dos, rectifiée à 18° dans l'état fermé ;
- côté dos + devant, contrôle des longueurs et des crans.

L'apparence isolée d'une demi-courbe ne suffit plus comme critère lorsque la
méthode demande explicitement une vérification après assemblage.

### 3.5 États et variantes dérivées

Les états proposés sont des variantes immuables :

```text
mensurations brutes
  → profil validé
  → cadre et constructions nominales
  → patron de base exact, pinces ouvertes
  → vues fermées/assemblées de vérification
  → patron de base exact rectifié
  → variante de toile avec élargissement de base
  → ligne de coupe avec marges et croisure
  → corrections d'essayage
  → base corrigée sans élargissement ni marges
  → transformation de modèle future
  → patron de production avec marges
```

Règles de séparation :

- les mensurations brutes ne sont jamais modifiées ;
- l'aisance globale actuelle, ajoutée aux tours en amont, reste identifiée
  comme une extension produit distincte de l'élargissement de base du livre ;
- une marge ne modifie jamais une ligne ni une longueur de couture ;
- le contour de coupe n'est jamais utilisé pour vérifier l'assemblage ;
- la base corrigée finale ne conserve ni marge, ni croisure, ni élargissement
  spécifique à la toile ;
- le gabarit sans pinces et la base complète sont deux vues du même graphe,
  pas deux calculs indépendants.

Les variantes de toile, de coupe et de modèle restent hors du périmètre v1.
Leur représentation peut être préparée avant leur exposition dans l'interface.

### 3.6 Corrections d'essayage

Le moteur ne doit pas prétendre déduire un défaut d'essayage des seules
mensurations. Il doit pouvoir enregistrer une observation et une correction
choisie :

```ts
type FittingCorrection = {
  id: string;
  observation: string;
  assemblyState: "front-open" | "front-closed";
  piece: "back" | "front" | "both";
  bodySide: "left" | "right" | "symmetric";
  delta: GeometricDelta;
  anchors: string[];
  invalidates: string[];
  sourceRef: string;
};
```

Exemples de corrections représentables :

- surcharge de profondeur d'encolure après vérification ;
- nouvelle pente ou nouvelle position d'épaule ;
- augmentation d'une pince d'épaule ;
- déplacement, remplacement ou suppression d'une pince de taille ;
- déplacement latéral `deltaX(y)` pour redistribuer le volume dos/devant ;
- correction asymétrique conservée séparément à gauche et à droite.

Les préconditions d'observation doivent être enregistrées : le milieu devant
se juge devant ouvert, alors que l'emmanchure se juge devant fermé. Deux
corrections incompatibles dans la même session doivent produire un diagnostic,
pas être combinées silencieusement.

### 3.7 Diagnostics et invalidation

Les diagnostics conservent trois niveaux :

- `error` : construction impossible ou donnée hors bornes physiques ;
- `warning` : construction possible mais résultat atypique ou règle à vérifier ;
- `info` : convention ou valeur par défaut utilisée.

Chaque diagnostic référence les entités concernées et, si possible, la
première étape divergente.

Le graphe sert aussi à propager les invalidations. Exemples :

- valeur de pince bretelle modifiée → chapeau, épaule devant, emmanchure
  devant, longueur d'arc et manche invalidés ;
- pince d'épaule dos modifiée → épaule dos, encolure assemblée, emmanchure dos
  et manche invalidées ;
- couture de côté modifiée → relation de côté, crans et variante de marge
  invalidés ;
- emmanchure modifiée → toute manche construite à partir de cette courbe
  invalidée.

## 4. Modifications fonctionnelles proposées pour le buste

Ces modifications ne seront réalisées qu'en respectant la boucle note de
méthode → tests → construction → contrôle visuel → invariants.

### B1 — Tracer la vraie pince d'épaule dos

Objectif : remplacer l'option absorbée actuelle comme représentation principale
du patron de base, tout en pouvant la conserver comme variante documentée.

Comportement attendu d'après `docs/methode/buste.md` :

- axe au milieu de l'épaule et perpendiculaire à celle-ci ;
- longueur nominale 7 cm ;
- largeur standard retenue 1 cm, avec ambiguïté source déjà documentée ;
- fermeture autour de la pointe ;
- rallonge et rectification de l'épaule à 18° dans l'état fermé ;
- retracé de l'emmanchure jusqu'à la carrure ;
- production du chapeau lors du retour à l'état ouvert.

Tests de sortie : longueur d'épaule fermée, égalité des jambes, réversibilité,
absence de bec à l'épaule et invariants d'emmanchure.

### B2 — Construire l'encolure dans une vue assemblée

Objectif : remplacer l'approximation « deux courbes indépendantes arrivant
perpendiculairement aux épaules » par une vérification commune correspondant au
geste décrit dans la note de méthode.

Contraintes :

- platitude horizontale au milieu dos ;
- platitudes devant selon les proportions validées ;
- continuité au raccord d'épaule dans la vue assemblée ;
- aucune modification des valeurs exactes du rectangle d'encolure ;
- retour des deux segments sur les pièces ouvertes.

Cette évolution répond au défaut visuel d'encolure encore identifié dans la
note de méthode. Elle exige des tests de tangence et un snapshot assumé.

### B3 — Vérifier l'emmanchure complète dans une vue assemblée

Objectif : fermer les pinces d'épaule, assembler les épaules et contrôler la
courbe complète.

Les références fermées de carrure et de platitude restent imposées. Sur le
devant ouvert, C11 reporte toutefois les points vers l'extérieur de la largeur
interceptée par la pince ; les contrôles doivent donc comparer l'état utile
après absorption aux références. La différence de longueur dos/devant de 1 à
2 cm reste un avertissement et ne déclenche aucune déformation automatique.

### B4 — Séparer géométrie de pince et instruction de montage

Pour le buste actuel :

- la pince de taille devant et la pince bretelle ont leur pointe géométrique au
  saillant ;
- la platitude de poitrine d'environ 2 cm est stockée comme instruction
  d'assemblage ;
- le rendu du patron ne raccourcit pas les pinces ;
- un futur pas-à-pas de montage peut afficher l'arrêt de piqûre ou d'épinglage.

### B5 — Séparer l'élargissement de toile de l'aisance globale produit

L'option actuelle ajoute une même aisance aux tours avant division. Elle reste
une extension produit neutre à zéro.

L'élargissement de base du livre est une autre transformation : épaule,
emmanchure et côtés sont déplacés après construction. Il devra produire une
variante de toile séparée et ne pas être cumulé implicitement avec l'aisance
globale.

## 5. Impact prévu sur les fichiers

| Zone | Évolution envisagée |
|---|---|
| `src/engine/types.ts` | Enrichir `DraftStep`, `Dart`, `PatternPiece` ; ajouter coutures, relations, diagnostics et variantes |
| `src/engine/drafting.ts` | Enregistrer dépendances, entrées, origine et statut sans casser les appels actuels |
| `src/engine/geometry/` | Ajouter les transformations rigides et leurs inverses |
| `src/engine/assembly.ts` | Construire des vues temporaires de fermeture et d'assemblage |
| `src/engine/variants.ts` | Dériver toile, marges et futures transformations sans muter la base |
| `src/engine/corrections.ts` | Représenter les corrections d'essayage et leurs invalidations |
| `src/engine/pieces/buste.ts` | Adopter la vraie pince dos et les vérifications assemblées après validation |
| `src/engine/generate.ts` | Propager les dépendances et invalider les pièces dérivées |
| `tests/` | Ajouter tests de réversibilité, assemblage, relations de couture, variantes et corrections |

Les nouveaux fichiers sont des propositions de découpage. Leur création n'est
pas requise tant qu'une responsabilité peut rester claire dans un module
existant.

## 6. Stratégie de migration

### Phase A — Métadonnées, sans changement de tracé

- ✅ étapes enrichies avec provenance, dépendances, entrées, statut et
  diagnostics ;
- ✅ coutures principales nommées sur le dos et le devant ;
- ✅ tests de sérialisation et de compatibilité ajoutés ;
- ✅ changement structurel isolé du changement fonctionnel M3.1, dont le
  snapshot est mis à jour explicitement.

### Phase B — Transformations de pinces et consolidation du buste

- ✅ transformations rigides, composition, inverse, fermeture et réouverture ;
- ✅ vraie pince d'épaule dos 1 × 7 cm, épaule rectifiée dans l'état fermé ;
- ✅ encolure et emmanchure vérifiées dans la vue épaules assemblées ;
- ✅ golden tests, invariants sur 200 mensurations et snapshot mis à jour
  volontairement après contrôle visuel.

### Phase C — Relations inter-pièces avant la manche

- créer les relations de couture et les crans curvilignes ;
- exposer les arcs d'emmanchure avec leur provenance ;
- faire dépendre explicitement la manche de ces arcs ;
- invalider la manche si le buste change.

### Phase D — Variantes de toile et essayage guidé

- produire l'élargissement de base comme variante ;
- séparer lignes de couture et contours de coupe ;
- ajouter marges et croisure selon le contexte ;
- enregistrer et reporter les corrections d'essayage ;
- conserver la base corrigée sans élargissement ni marge.

M3 reste inchangé : il livre le PDF tuilé à partir du format actuel. La phase A
peut être faite sans modifier le tracé, mais les phases B à D doivent chacune
avoir leur branche, leurs tests et leur contrôle visuel.

## 7. Critères d'acceptation globaux

L'évolution sera considérée correctement intégrée lorsque :

1. chaque géométrie finale remonte à des mesures et étapes nommées ;
2. aucune proposition d'architecture ne peut outrepasser une note de méthode ;
3. fermeture puis réouverture d'une pince est réversible dans une tolérance
   nommée ;
4. les coutures partenaires sont vérifiées sur leurs lignes de couture ;
5. les crans restent attachés après retracé et ajout de marge ;
6. une marge ou une aisance ne modifie jamais les mensurations brutes ;
7. la manche est invalidée après modification de l'emmanchure ;
8. une correction d'essayage conserve observation, état, côté et provenance ;
9. le patron de base corrigé peut être restitué sans marge ni élargissement ;
10. toute modification visible du profil de démonstration est justifiée par
    une note validée, des tests et un snapshot explicitement régénéré.

## 8. Traçabilité de la décision

| Date | Décision | Origine | Statut |
|---|---|---|---|
| 2026-07-15 | Conserver `docs/methode/*.md` comme seule autorité de méthode | Règles du dépôt + analyse comparative | Adopté |
| 2026-07-15 | Utiliser les notes Codex comme matériau d'architecture, pas comme remplacement | Analyse comparative | Adopté |
| 2026-07-15 | Garder les valeurs exactes d'encolure dans la géométrie | `buste.md`, moteur et golden tests | Adopté |
| 2026-07-15 | Garder les pointes de poitrine au saillant sur le patron | `buste.md` C15 + moteur | Adopté |
| 2026-07-15 | Préparer un graphe de dépendances, des vues assemblées et des variantes immuables | Proposition issue de l'analyse | Inscrit au plan |
| 2026-07-15 | Faire de la vraie pince d'épaule dos une consolidation dédiée | `buste.md` C12-C13 + analyse | Implémenté dans M3.1 |
| 2026-07-15 | Ne pas bloquer les cohérences morphologiques atypiques sans validation supplémentaire | Politique actuelle de validation | Adopté |
