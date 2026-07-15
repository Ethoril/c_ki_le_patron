# Généralités — lecture indépendante et spécification moteur (Codex)

> Statut : proposition indépendante fondée sur les pages 9 à 29 du livre
> (PDF 8 à 28), texte **et** figures. Ce fichier a été rédigé sans consulter
> `generalites.md` ni `buste.md`. Il est destiné à une comparaison ultérieure,
> pas à remplacer la note de méthode validée.

## 1. Convention de lecture

Cette note sépare trois niveaux qui ne doivent jamais être confondus :

- **Méthode** : ce que le livre prescrit ou ce que ses figures imposent sans
  ambiguïté ;
- **interprétation moteur** : la traduction géométrique et logicielle que je
  propose ;
- **[À VALIDER]** : une valeur ou une règle que la source laisse imprécise,
  contradictoire ou seulement qualitative.

Les numéros de page cités sont ceux imprimés dans le livre. Les formules sont
des reformulations fonctionnelles : ce document ne reproduit ni le texte ni
les planches de l'ouvrage.

## 2. Ce que le moteur construit réellement

Un patron de base n'est pas d'abord un contour. C'est un **graphe de
construction contraint** qui projette à plat :

1. des longueurs portées par des axes verticaux ou sagittaux ;
2. des contours répartis sur des lignes transversales ;
3. des volumes absorbés par des pinces ;
4. des coutures qui ne deviennent vérifiables qu'après fermeture virtuelle des
   pinces et assemblage des pièces partenaires.

Le contour final n'est qu'une vue de ce graphe. Conserver uniquement les
coordonnées finales ferait perdre l'explication, les dépendances, les états
ouverts/fermés et la possibilité de corriger proprement le tracé.

### 2.1 Repères fondamentaux (p. 9–10)

- Les milieux dos et devant sont les références verticales principales.
- La taille est la référence horizontale principale.
- Les autres horizontales (carrure, emmanchure, petites hanches, bassin, etc.)
  sont positionnées depuis ces références.
- Une ligne transversale de construction est perpendiculaire au milieu de sa
  pièce, même si le contour anatomique qu'elle rencontre est courbe.
- Une ligne d'aide participe au calcul mais peut être masquée à l'export.

Le moteur doit donc stocker séparément :

```ts
type GeometricKind = "point" | "axis" | "segment" | "ray" | "curve";
type ConstructionRole = "reference" | "construction" | "helper";
type PatternRole = "base" | "ease" | "transformation" | "cut";
```

La couleur appartient au thème de rendu, jamais au modèle de données. Une
entité peut, par exemple, être une `curve`, de rôle `construction`, dans la
couche `base`.

### 2.2 Demi-pièces et dépendances entre pièces

Le dos, le devant, la jupe et le pantalon sont construits par demi-pièces. La
manche est une exception : son repère central représente la ligne d'épaule et
sépare les zones dos et devant ; il ne représente pas un milieu anatomique.

La manche dépend de l'emmanchure **effectivement tracée**. Toute dépendance
inter-pièces doit consommer la géométrie produite — longueurs d'arc, points de
cran et tangentes — et non recalculer une grandeur supposée équivalente.

## 3. États du patron

Le vocabulaire du livre décrit plusieurs usages proches. Pour le moteur, je
propose les états explicites suivants :

| État | Contenu | Aisance | Marges | Peut couper ? |
|---|---|---:|---:|---|
| `exactBodyBlock` | Gabarit corporel calculé | 0 | 0 | non |
| `fittingSeamPattern` | Ligne de couture de la toile | minimale | 0 | non |
| `fittingCutPattern` | Toile prête à couper, réserves et repères inclus | minimale | variables | oui, pour la toile |
| `correctedBase` | Base après report d'essayage | 0 | 0 | non |
| `modelPattern` | Base corrigée transformée pour un modèle | selon modèle | 0 | non |
| `productionPattern` | Pièces de coupe finies et annotées | selon modèle | oui | oui |

Principes :

- chaque état dérive immuablement d'un état précédent ;
- retirer une marge ou une aisance ne doit pas effacer une correction de
  morphologie ;
- une mesure brute n'est jamais remplacée par une correction d'essayage : la
  correction est une surcharge avec provenance ;
- le renderer choisit quelles couches montrer, il ne calcule aucune géométrie.

Le livre distingue aussi deux vues liées de la base (p. 86–89) :

- le **gabarit global sans pinces**, utile comme support de certains modèles
  amples ou extensibles ;
- la **base complète avec pinces**, nécessaire à la toile, aux modèles ajustés
  et à une emmanchure fidèle.

La première n'est pas une version cousable simplifiée de la seconde. Ce sont
deux vues du même système de construction.

## 4. Modèle des mensurations

### 4.1 Une mesure est plus qu'un nombre

```ts
interface MeasurementValue {
  id: string;
  valueCm: number;
  role: "construction" | "validation" | "override";
  path: string;          // trajet anatomique reformulé
  posture?: string;
  provenance: "measured" | "method-default" | "fitting";
  confidence?: "direct" | "estimated";
}
```

Les tours corporels sont pris sans aisance implicite : ruban horizontal,
ajusté au corps, sans intercaler de doigt. L'aisance est une transformation
ultérieure, jamais une propriété cachée de la valeur saisie.

### 4.2 Mesures utiles au buste (p. 14–23)

| Identifiant proposé | Trajet fonctionnel | Rôle moteur | Contrôles |
|---|---|---|---|
| `backLength` | base du cou sur l'épaule → taille, en suivant le galbe des omoplates | construction | ne pas partir de la vertèbre saillante |
| `shoulderLength` | base du cou → acromion | construction | côté gauche/droit possible |
| `fullBackWidth` | acromion → acromion | alternative/validation | mesure complète, donc demi-valeur sur une demi-pièce |
| `backCrossWidth` | articulation de bras → articulation de bras, au dos | construction | supérieure à la carrure devant |
| `frontLength` | base du cou → taille en passant sur le saillant de poitrine | construction | le trajet ne passe pas entre les seins |
| `bustHeight` | base du cou → saillant de poitrine | construction | même origine que la longueur devant |
| `frontCrossWidth` | articulation de bras → articulation de bras, devant | construction | strictement inférieure à `backCrossWidth` |
| `bustSpan` | saillant → saillant | construction | place l'axe vertical des pinces devant |
| `neckCircumference` | tour à la base du cou | construction | ne pas mesurer à mi-hauteur du cou |
| `bustCircumference` | tour horizontal passant par les saillants | construction | dos horizontal |
| `waistCircumference` | tour sur le cordon de taille | construction | cordon horizontal |
| `hipCircumference` | tour horizontal au plus fort du bassin | construction | niveau à identifier sur la personne |
| `hipHeight` | taille → niveau du bassin | construction/option | voir convention ci-dessous |
| `clavicleToApex` | milieu devant au niveau des clavicules → saillant | validation/override | corrige la profondeur d'encolure |
| `apexToAcromion` | saillant → acromion | validation/override | corrige la pente/position d'épaule |

Les deux dernières mesures ne remplacent pas les formules standard par défaut.
Elles permettent une résolution géométrique personnalisée et doivent produire
un diagnostic si les cercles ou contraintes correspondants ne s'intersectent
pas.

### 4.3 Hauteur de bassin et petites hanches (p. 13, 22–23)

La prise de mesure réelle est décrite, mais le plateau fessier rend le niveau
exact difficile à stabiliser. La construction normalise ensuite le bassin à
20 cm sous la taille et les petites hanches à 10 cm.

Le moteur doit distinguer :

```ts
measuredHipHeight?: number;
draftHipHeight: number;       // défaut de méthode : 20 cm
smallHipRatio: number;        // défaut : 0.5
```

Le choix `measured` ou `method-default` doit être visible dans les étapes. La
ligne de petites hanches reste une aide, sauf lorsqu'une correction
morphologique l'utilise explicitement. **[À VALIDER]** : priorité exacte de la
hauteur mesurée sur la convention de 20 cm dans cette application.

### 4.4 Mesures destinées aux autres pièces

Les généralités décrivent aussi les longueurs de bras, hauteur de coude, tours
de bras et de poignet, ainsi que des mesures de jupe et pantalon. Elles doivent
suivre le même modèle `MeasurementValue`. Pour la manche, le tour de bras est
surtout un contrôle : la largeur et la tête dépendent d'abord de l'emmanchure
tracée et de l'aisance prévue.

## 5. Répartition des contours

La méthode ne centre pas automatiquement la couture côté au quart exact du
tour de poitrine (p. 10–12) :

```text
largeur demi-dos haut    = tourPoitrine / 4 - 1 cm
largeur demi-devant haut = tourPoitrine / 4 + 1 cm
```

Cette dissymétrie déplace la couture côté vers le dos et équilibre les zones
d'emmanchure. Invariants :

```text
dos + devant = tourPoitrine / 2
devant - dos = 2 cm
```

La même politique apparaît au bassin dans la construction du buste. Elle doit
être une constante nommée de méthode, pas deux valeurs `-1` et `+1` dispersées.

Pour une morphologie dont le ventre ou les fesses imposent une autre
répartition, le moteur doit accepter une paire de largeurs partielles mesurées
ou une surcharge de répartition. Il ne doit pas déduire silencieusement cette
répartition d'un tour global.

## 6. Géométrie sémantique

### 6.1 Étapes et provenance

Chaque résultat de construction doit être nommé et auditable :

```ts
interface DraftStep<T> {
  id: string;
  label: string;
  page: number | [number, number];
  dependsOn: string[];
  inputs: Record<string, number | string>;
  result: T;
  certainty: "method" | "interpretation" | "to-validate";
  diagnostics: Diagnostic[];
}
```

Une correction ou une transformation crée une nouvelle étape. Elle ne mute pas
les points antérieurs, afin que le pas-à-pas puisse afficher le raisonnement et
que les tests puissent identifier la première divergence.

### 6.2 Courbes et platitudes (p. 11–12)

Une platitude est une courte zone terminale presque rectiligne qui évite un bec
ou un creux après pliage, symétrie ou assemblage. Elle concerne notamment les
milieux, l'encolure, les emmanchures, la poitrine et les passages de pinces à la
taille.

Elle doit être modélisée comme une contrainte :

```ts
interface CurveConstraint {
  through: PointId[];
  softGuides?: PointId[];
  startTangent?: Vector;
  endTangent?: Vector;
  flatStartCm?: number;
  flatEndCm?: number;
  continuity?: "C0" | "C1";
}
```

Principes :

- les points anatomiques et raccords de couture sont contraignants ;
- un guide visuel de courbure peut être souple ;
- les tangentes terminales sont testées avant et après fermeture des pinces ;
- la continuité d'une couture assemblée prime sur l'apparence isolée d'une
  demi-courbe ;
- les longueurs sont mesurées par longueur d'arc sur la courbe produite.

Les longueurs précises de certaines platitudes ne sont pas fixées dans les
généralités : elles appartiennent aux constantes de chaque pièce ou restent
**[À VALIDER]**.

### 6.3 Pince

Une pince ne peut pas être réduite à deux segments :

```ts
interface Dart {
  id: string;
  axis: Line;
  pivot: Point;       // centre géométrique des rotations
  sewnTip: Point;     // pointe réellement cousue
  intakeCm: number;   // valeur totale
  legs: [Segment, Segment];
  foldToward: "center" | "side" | "custom";
  upperEnd?: Point;
  lowerEnd?: Point;
  waistFlatCm?: number;
  foldTransform: RigidTransform;
  cap?: Curve;
}
```

Le moteur doit pouvoir : fermer la pince, rectifier la couture dans cet état,
produire le chapeau, puis revenir à l'état ouvert sans déplacer les points non
concernés.

### 6.4 Crans et relations de couture (p. 12–13)

Deux rôles de cran sont utiles :

- `assembly` : met en correspondance deux niveaux ou coutures partenaires ;
- `identity` : distingue une pièce, un côté ou une orientation.

Un cran est attaché à une couture par abscisse curviligne normalisée ou
distance depuis une ancre, jamais seulement par `(x, y)`. Il peut ainsi suivre
un retracé ou un ajout de marge.

```ts
interface SeamRelation {
  id: string;
  first: SeamRef;
  second: SeamRef;
  orientation: "same" | "reversed";
  notches: NotchPair[];
  lengthPolicy: "equal" | "ease-first" | "ease-second";
}
```

## 7. Aisance, compensation matière et marges

Ces trois notions doivent rester indépendantes :

- **aisance corporelle** : volume ajouté pour porter ou styliser le vêtement ;
- **compensation matière** : adaptation éventuelle liée à l'épaisseur ou au
  comportement du tissu ;
- **marge de couture** : géométrie extérieure nécessaire à l'assemblage.

Les marges sont calculées dans le moteur à partir de la ligne de couture, avec
une largeur par segment, des raccords, des angles et des chapeaux de pince. Le
renderer ne fait aucun offset.

Le contour de coupe ne doit jamais servir à vérifier la longueur d'une couture
ou la concordance de deux pièces. Ces contrôles portent sur les `seamPath`.

## 8. Architecture de calcul proposée

```text
Measurements brutes
        ↓ validation anatomique et provenance
ValidatedProfile
        ↓ constantes de MethodConfig
ConstructionFrame
        ↓ points, axes, guides nommés
OpenDartGeometry
        ↓ fermetures virtuelles et rectifications
TruedSeamGeometry
        ↓ contrôles entre pièces
ExactBodyBlock
        ↓ transformation d'aisance choisie
Model/FittingSeamPattern
        ↓ marges, crans et annotations
CutPattern
```

Objets centraux proposés :

- `Measurements` : saisie brute immuable ;
- `ValidatedProfile` : erreurs, avertissements, valeurs de construction et
  surcharges ;
- `MethodConfig` : toutes les constantes, tolérances et politiques ;
- `Draft` : registre des entités et étapes nommées ;
- `PatternPiece` : coutures, contours, pinces, axes, annotations et relations ;
- `AssemblyView` : transformations temporaires pour fermer/joindre des pièces ;
- `PatternVariant` : état dérivé et provenance ;
- `Diagnostic` : observation, gravité, entités touchées et correction possible.

## 9. Validation et diagnostics

Le moteur doit distinguer :

- `error` : construction impossible ou mensurations incompatibles ;
- `warning` : géométrie calculable mais morphologie ou résultat atypique ;
- `info` : convention de méthode utilisée à la place d'une mesure.

Exemples :

- `frontCrossWidth >= backCrossWidth` : erreur probable de prise de mesure ;
- intersection de cercles personnalisés inexistante : erreur ;
- différence d'arcs d'emmanchure hors plage : avertissement, pas correction
  automatique ;
- hauteur de bassin conventionnelle utilisée : information ;
- plafond de pince dépassé : stratégie de répartition requise.

## 10. Invariants et stratégie de tests

### 10.1 Invariants généraux

1. Les mesures brutes ne contiennent aucune aisance implicite.
2. Toute horizontale de construction est perpendiculaire au milieu associé.
3. Les milieux restent rectilignes dans les états de base.
4. `frontCrossWidth < backCrossWidth`.
5. Les répartitions dos/devant recomposent exactement le demi-tour concerné.
6. Une fermeture suivie de son inverse conserve les points non rectifiés.
7. Une platitude respecte ses tangentes dans l'état où la couture est montée.
8. Les coutures partenaires conservent l'ordre et l'identité de leurs crans.
9. Une marge ne modifie ni la ligne ni la longueur de couture.
10. Une transformation n'écrase ni la base corrigée ni les mesures brutes.
11. Une pièce dépendante consomme la courbe réellement générée.
12. Le gabarit zéro aisance ne peut pas être exporté comme patron de coupe sans
    transition explicite.

### 10.2 Familles de tests

- **golden** : exemples chiffrés explicitement fournis par la méthode ;
- **invariants aléatoires** : morphologies plausibles, y compris extrêmes ;
- **réversibilité** : fermeture/réouverture, ajout/retrait d'aisance et de
  marges ;
- **assemblage virtuel** : continuité, tangentes, longueurs, crans ;
- **provenance** : chaque coordonnée finale remonte à des mesures et étapes ;
- **diagnostics** : données incompatibles et ambiguïtés de configuration ;
- **snapshot visuel** : utile seulement après validation numérique des
  contraintes.

## 11. Décisions encore à valider

1. Priorité entre hauteur de bassin mesurée et convention 20/10 cm.
2. Tolérances numériques d'orthogonalité et de raccord tangent.
3. Longueurs exactes des platitudes non précisées par pièce.
4. Politique de surcharge pour les répartitions partielles devant/dos.
5. Séparation éventuelle entre aisance corporelle et compensation d'épaisseur
   dans la première version de l'API.
6. Règles d'export empêchant l'utilisation accidentelle du gabarit comme
   patron de coupe.

La conclusion d'architecture est importante : la fidélité à la méthode ne se
mesure pas seulement aux coordonnées du contour. Elle dépend de la provenance,
des états de montage, des relations entre coutures et des contraintes que les
figures rendent visibles.
