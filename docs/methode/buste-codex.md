# Buste — lecture indépendante et spécification moteur (Codex)

> Statut : proposition indépendante fondée sur les pages 31 à 89 du livre
> (PDF 29 à 87), texte **et** figures. Ce fichier a été rédigé sans consulter
> `buste.md` ni `generalites.md`. Les points marqués **[À VALIDER]** ne doivent
> pas devenir des constantes définitives avant confrontation à la source et aux
> essais.

Cette note décrit le moteur souhaité, pas seulement une succession de coups de
crayon. L'objectif est que chaque construction soit nommée, reproductible,
rectifiable dans son bon état de montage et testable.

## 1. Résultat attendu

Le générateur doit produire au minimum deux demi-pièces, `back` et `front`,
avec :

- ligne de couture exacte zéro aisance ;
- pinces complètes et leurs transformations de fermeture ;
- courbes d'encolure et d'emmanchure rectifiées en assemblage virtuel ;
- lignes de construction et points de méthode nommés ;
- relations de couture épaule/côté ;
- longueurs d'arc mesurées ;
- diagnostics et références de pages ;
- variantes dérivées pour la toile, l'aisance et la coupe ;
- surcharges d'essayage sans perte de la construction initiale.

La base corrigée finale ne contient ni aisance, ni marge de couture, ni
croisure d'essayage. Ces éléments appartiennent à des variantes dérivées.

## 2. Entrées et validations

### 2.1 Mensurations requises

| Identifiant | Usage principal |
|---|---|
| `backLength` | hauteurs dos, taille, emmanchure et carrure |
| `frontLength` | hauteur de la ligne d'épaule devant |
| `shoulderLength` | longueur de couture d'épaule fermée |
| `backCrossWidth` | point de carrure dos |
| `frontCrossWidth` | point de carrure devant |
| `bustHeight` | ordonnée du saillant de poitrine |
| `bustSpan` | abscisse du saillant et axe de pince taille devant |
| `neckCircumference` | rectangle d'encolure |
| `bustCircumference` | largeurs hautes et pince bretelle |
| `waistCircumference` | largeur cousue à la taille |
| `hipCircumference` | largeurs au bassin |
| `hipHeight` ou convention | ordonnée du bassin |

### 2.2 Entrées facultatives

| Identifiant | Effet |
|---|---|
| `fullBackWidth` | alternative morphologique à la longueur d'épaule |
| `clavicleToApex` | surcharge de profondeur d'encolure devant |
| `apexToAcromion` | surcharge de position/pente d'épaule devant |
| répartitions partielles devant/dos | remplace les `-1/+1 cm` aux niveaux concernés |
| valeurs d'essayage | corrige pente, pince, côté ou courbe avec provenance |

Validations minimales avant construction :

1. toutes les longueurs et tous les tours sont strictement positifs ;
2. `frontCrossWidth < backCrossWidth` ;
3. la taille n'excède pas les tours source sans qu'une stratégie d'ajout soit
   explicitement choisie ;
4. les demi-largeurs de carrure tiennent dans les largeurs des cadres ;
5. les contraintes personnalisées par cercles possèdent une intersection
   anatomiquement plausible ;
6. aucune aisance n'est incorporée dans les mensurations brutes.

## 3. Constantes de méthode

Toutes ces valeurs doivent vivre dans `engine/method.ts`, accompagnées de leur
page et de leur statut :

| Constante proposée | Valeur | Pages | Statut |
|---|---:|---:|---|
| `panelBalanceCm` | 1 cm | 32–35 | méthode |
| `neckWidthAddCm` | 1 cm | 38 | méthode |
| `frontNeckDepthAddCm` | 2 cm | 39 | méthode |
| `neckRoundingStepCm` | 0,5 cm | 38–39 | **[À VALIDER]** |
| `backShoulderAngleDeg` | 18° | 40–41 | méthode nominale |
| `frontShoulderAngleDeg` | 26° | 42 | méthode nominale |
| `backArmholeDiagonalCm` | 1,5 cm | 43 | méthode |
| `frontArmholeDiagonalCm` | 2,5 cm | 44 | méthode |
| `armholeSideFlatCm` | 1 cm | 43–44 | méthode |
| `backShoulderDartIntakeCm` | 1 cm total | 47–48 | **[À VALIDER]** |
| `backShoulderDartLengthCm` | 7 cm | 47 | méthode |
| `roundedBackDartIntakeCm` | 2 cm total | 47 | interprétation |
| `roundedBackDartLengthCm` | 5 cm | 47 | méthode |
| `bustDartFlatCm` | environ 2 cm | 75 | ajustable |
| `easeShoulderCm` | 1 cm | 65 | méthode |
| `easeArmholeDropCm` | 2 cm | 65 | méthode |
| `easeSideCm` | 1 cm par demi-pièce | 65–66 | méthode |
| `standardAllowanceCm` | 1 cm | 67 | méthode |
| `fittingSideAllowanceCm` | 2 à 3 cm | 67 | méthode |
| `fittingFrontOverlapCm` | 2 à 3 cm | 67 | méthode |

Trois incohérences sont conservées explicitement, pas résolues en silence :

1. les exemples d'encolure transforment `7,33` en `7,5` et `2,38` en `2,5`,
   ce qui correspond à un plafond au demi-centimètre malgré une formulation
   textuelle différente ;
2. la pince d'épaule dos est décrite comme `1 cm` de part et d'autre de l'axe
   (2 cm total), mais la correction d'épaule et la variante dos rond suggèrent
   un défaut de 1 cm total ;
3. `fullBackWidth` est mesurée acromion à acromion, puis semble reportée depuis
   le milieu dos : sur une demi-pièce, le moteur doit provisoirement utiliser
   `fullBackWidth / 2`.

## 4. Repère et conventions géométriques

Un repère local par demi-pièce évite de reproduire le placement tête-bêche de
la feuille du livre :

- unité : centimètre ;
- `x = 0` sur le milieu de la pièce ;
- `x > 0` vers le côté ;
- `y` croît vers le bas ;
- origine verticale commune sur la ligne horizontale d'épaule dos.

Ordonnées du cadre :

```text
yShoulderBack  = 0
yWaist         = backLength
yHip           = backLength + draftHipHeight
yArmhole       = backLength / 2
yCross         = backLength / 3
yShoulderFront = backLength - frontLength
ySmallHip      = backLength + draftHipHeight / 2
```

La ligne de carrure est bien à un tiers de la distance épaule–emmanchure en
remontant depuis l'emmanchure, soit `backLength / 3` sous l'épaule dans ce
repère.

Le dos et le devant partagent les ordonnées taille, bassin, emmanchure et
carrure. Seule leur ligne d'épaule horizontale initiale diffère.

## 5. Graphe de construction

Chaque bloc ci-dessous crée des étapes nommées. Une étape peut dépendre de
points antérieurs mais ne les modifie pas.

### Bloc 0 — Profil validé

Produire :

- `ValidatedProfile` ;
- `draftHipHeight` et sa provenance ;
- la politique de répartition des tours ;
- les angles nominaux ou surcharges morphologiques ;
- des diagnostics bloquants/non bloquants.

### Bloc 1 — Cadre du dos (p. 31–34)

Créer les références :

```text
CB0 = (0, yShoulderBack)
CBW = (0, yWaist)
CBH = (0, yHip)
```

Largeurs :

```text
backBustWidth = bustCircumference / 4 - panelBalanceCm
backHipWidth  = hipCircumference  / 4 - panelBalanceCm
```

Créer séparément :

- côté haut provisoire à `x = backBustWidth`, de l'épaule à la taille ;
- côté bas provisoire à `x = backHipWidth`, de la taille au bassin ;
- horizontales de taille, bassin, emmanchure et carrure.

Ne pas raccorder les côtés haut et bas à ce stade : leur écart participe au
calcul du galbe et de l'absorption à la taille.

### Bloc 2 — Cadre du devant (p. 34–37)

```text
frontBustWidth = bustCircumference / 4 + panelBalanceCm
frontHipWidth  = hipCircumference  / 4 + panelBalanceCm
```

Créer le milieu devant `x = 0`, copier les quatre horizontales du dos et placer
la ligne d'épaule à `yShoulderFront`.

La petite hanche est une ligne d'aide à mi-hauteur. Pour une morphologie très
projetée devant ou dos, accepter des largeurs partielles mesurées comme
remplacement explicite des répartitions standard. L'API doit garder la source
de chaque largeur (`formula`, `partial-measurement`, `fitting-override`).

**Invariant du cadre** : toutes les transversales sont perpendiculaires aux
milieux et les largeurs recomposent exactement les demi-tours.

### Bloc 3 — Rectangles d'encolure (p. 38–39)

Calculs bruts :

```text
neckWidthRaw     = neckCircumference / 6 + 1 cm
backNeckDepthRaw = neckCircumference / 16
frontNeckDepth   = neckWidth + 2 cm
```

Avec l'interprétation provisoire des exemples :

```text
roundNeck(v) = ceil(v / 0.5 cm) × 0.5 cm
```

Construire uniquement les rectangles et leurs coins :

- largeur identique au dos et au devant ;
- profondeur dos vers le bas depuis l'épaule dos ;
- profondeur devant vers le bas depuis l'épaule devant.

Les courbes définitives sont volontairement retardées jusqu'à la rectification
des épaules et à leur assemblage virtuel.

### Bloc 4 — Épaules nominales (p. 40–42)

Dos : depuis le coin extérieur du rectangle d'encolure, lancer un rayon
descendant vers le côté à 18° et y reporter `shoulderLength`.

Alternative `fullBackWidth` : placer l'acromion à
`x = fullBackWidth / 2`, puis intersecter sa verticale avec le rayon à 18°.
**[À VALIDER]** : la division par deux corrige une omission vraisemblable de la
formulation, mais doit rester visible dans la configuration.

Devant : rayon descendant vers le côté à 26°, même longueur d'épaule initiale
que le dos.

Les angles sont des valeurs de construction initiales. Après essayage, une
pente corrigée devient la référence de la personne et remplace le nominal dans
les opérations dépendantes.

### Bloc 5 — Emmanchures provisoires (p. 43–46)

Pour chaque pièce, construire quatre repères durs et un guide souple :

1. extrémité d'épaule ;
2. point de carrure à `backCrossWidth / 2` ou `frontCrossWidth / 2` sur
   `yCross` ;
3. point de début de platitude, 1 cm vers l'intérieur depuis le côté sur la
   ligne d'emmanchure ;
4. extrémité de l'emmanchure sur le côté ;
5. guide sur la bissectrice du coin carrure/emmanchure : 1,5 cm au dos, 2,5 cm
   au devant.

Le guide de bissectrice règle le creux, mais la source autorise son adaptation
à la morphologie. Il doit donc être une cible souple, contrairement aux points
d'épaule, de carrure, de platitude et de côté.

Courbe recommandée :

- segment paramétrique épaule → carrure, peu creusé ;
- segment carrure → platitude/côté, plus creusé ;
- continuité `C1` au point de carrure ;
- tangente horizontale à l'arrivée au côté ;
- absence de rebroussement et d'inflexion parasite.

Ces courbes restent provisoires : les pinces d'épaule vont modifier leurs
points supérieurs.

### Bloc 6 — Pince d'épaule dos (p. 47–48)

Objet `Dart` :

- axe perpendiculaire à l'épaule, ancré au milieu de la couture ;
- longueur nominale 7 cm ;
- valeur totale provisoire 1 cm, jambes à `±0,5 cm` ;
- variante dos rond : 2 cm total et 5 cm de longueur ;
- pli orienté selon l'instruction de montage.

Procédure géométrique :

1. construire axe, pivot et jambes ;
2. fermer la pince par rotation autour de sa pointe ;
3. dans l'état fermé, rétablir une épaule rectiligne suivant la pente courante ;
4. imposer comme longueur cousue `shoulderLength` ;
5. ramener cette ligne dans l'état ouvert ;
6. produire le chapeau de pince ;
7. recalculer l'emmanchure entre épaule et carrure.

L'invariant fiable est la longueur de couture d'épaule **pince fermée**. Une
extension mécanique de l'extrémité d'épaule par la valeur de pince est un moyen
manuel, pas l'invariant du moteur.

### Bloc 7 — Saillant et corrections morphologiques devant (p. 49–51)

```text
apex.x = bustSpan / 2
apex.y = yShoulderFront + bustHeight
```

La hauteur de poitrine est reportée depuis l'horizontale d'épaule, pas le long
de l'épaule inclinée.

Si `clavicleToApex` est fourni, corriger la profondeur d'encolure par
intersection du milieu devant avec le cercle centré sur le saillant.

Si `apexToAcromion` est fourni, résoudre l'acromion par intersection :

- cercle centré sur le saillant, rayon `apexToAcromion` ;
- cercle centré sur le départ d'épaule, rayon `shoulderLength`.

Choisir l'intersection anatomiquement extérieure et supérieure. Aucune
intersection plausible produit une erreur de mensurations. Ces corrections
précèdent la pince bretelle.

### Bloc 8 — Pince bretelle devant (p. 49–53)

Valeur totale :

```text
bustDartIntake = bustCircumference / 20 + 1 cm
```

Construction :

1. première jambe du milieu de l'épaule vers le saillant ;
2. second point sur la couture d'épaule, vers l'extérieur, à une distance égale
   à la valeur de pince ;
3. seconde jambe vers le saillant ;
4. égaliser les deux jambes en prenant la première comme référence ;
5. fermer la pince vers le milieu devant ;
6. rectifier la moitié extérieure de l'épaule, pince fermée, suivant la pente
   devant courante ;
7. ramener la couture et le chapeau dans l'état ouvert ;
8. restaurer les largeurs de carrure et d'emmanchure perdues à la fermeture ;
9. retracer l'emmanchure devant.

La restauration doit être résolue par les valeurs réellement interceptées :
à chaque hauteur utile, calculer la distance horizontale `δ(y)` entre les deux
bras du triangle, puis reporter `δ(y)` vers l'extérieur depuis la courbe. Les
repères ouverts sont reconstruits de façon que leur largeur diminuée de
`δ(y)` retrouve la largeur cible pince fermée. Pour la bissectrice, située
entre carrure et emmanchure, le même calcul à sa hauteur fournit
l'interpolation exacte des reports puisque les bras de pince sont droits.

Deux pointes doivent être distinguées (p. 75) :

```text
pivot        = saillant de poitrine, centre des rotations
construction = jambes géométriques convergeant vers le pivot
sewnTip      = point reculé d'environ 2 cm sur l'axe de couture
```

Le recul forme une platitude de poitrine et peut varier avec le volume. La
pince de taille devant utilise la même distinction.

### Bloc 9 — Solveur de taille (p. 54–60)

#### 9.1 Cibles

Les largeurs cousues cibles conservent la répartition dos/devant :

```text
backWaistTarget  = waistCircumference / 4 - panelBalanceCm
frontWaistTarget = waistCircumference / 4 + panelBalanceCm
```

Les suppressions vues depuis le haut et le bas sont :

```text
upperSuppression = (bustCircumference - waistCircumference) / 4
lowerSuppression = (hipCircumference  - waistCircumference) / 4
```

Il ne faut pas créer deux tailles concurrentes. Le solveur choisit les pinces
internes, calcule **un point de taille côté commun**, puis déduit l'absorption
latérale nécessaire depuis la poitrine et depuis le bassin.

Si `internalBackUpper` et `internalFrontUpper` désignent les valeurs cumulées
des pinces intérieures, la symétrie de la couture côté impose :

```text
sideUpper = upperSuppression - internalBackUpper
          = upperSuppression - internalFrontUpper

sideLower = lowerSuppression - internalBackLower
          = lowerSuppression - internalFrontLower
```

Une politique de répartition qui ne satisfait pas ces égalités doit soit
redistribuer les pinces intérieures, soit produire une variante morphologique
explicitement non symétrique ; elle ne doit pas forcer deux côtés de longueurs
ou de formes incompatibles.

#### 9.2 Pinces et plafonds

| Pince | Placement | Valeur maximale | Extension basse |
|---|---|---:|---:|
| devant principale | axe vertical du saillant | 3 cm | 9 cm max |
| côté dos/devant | couture côté, miroir | 4 cm par pièce | rejoint sous petites hanches |
| milieu dos | sur milieu si couture prévue | 1 à 2 cm | selon tracé |
| milieu demi-dos | entre milieu et côté | 2 cm | 11 cm max |

La pince milieu dos est utile sur la toile très ajustée même si un modèle final
ne conserve pas cette couture/pince.

La source donne des plafonds et un exemple, pas une politique exhaustive pour
toutes les silhouettes. Le moteur doit exposer la stratégie de répartition et
signaler lorsqu'une pince supplémentaire est nécessaire.

Placement proposé des supplémentaires :

- dos : axes aux tiers de l'intervalle entre la pince côté et le milieu dos ;
- devant : axe au milieu de l'intervalle saillant–côté ;
- environ 2 cm plus courtes que les pinces principales.

#### 9.3 Golden chiffré de la méthode

Pour poitrine 88, taille 68, bassin 92 :

```text
suppression haute = 5 cm par panneau
suppression basse = 6 cm par panneau

dos haut    : milieu dos 1 + milieu demi-dos 2 + côté 2 = 5
dos bas     : milieu dos 1 + milieu demi-dos 2 + côté 3 = 6
devant haut : devant 3 + côté 2 = 5
devant bas  : devant 3 + côté 3 = 6
```

Le test doit confirmer que les calculs haut et bas atteignent le même point de
taille et les largeurs cibles `-1/+1`.

### Bloc 10 — Forme des pinces de taille (p. 60–61)

Une pince de taille contient : axe, valeur totale, extrémités haute et basse,
zone de platitude, jambes, courbure à la taille et sens de couchage.

La zone presque droite autour de la taille mesure environ 2 à 4 cm au total :

- valeur importante (environ 3 cm) → platitude plutôt courte, autour de 2 cm ;
- petite valeur (1 à 1,5 cm) → platitude plus longue, autour de 3 cm ou plus.

Interprétation géométrique :

- platitude centrée sur la taille ;
- jambes rectilignes entre extrémités de pince et bords de platitude ;
- raccord doux à la valeur maximale sur la taille ;
- tangente parallèle à l'axe au passage de la taille ;
- symétrie autour de l'axe, sauf surcharge d'essayage explicite.

La fonction qui relie valeur et longueur de platitude reste **[À VALIDER]** :
la source donne des exemples, pas une loi continue.

### Bloc 11 — Couture côté (p. 57–61)

Construire un profil canonique puis le refléter entre dos et devant :

- branche haute : point de côté d'emmanchure → bord de platitude taille ;
- passage presque rectiligne autour de la taille ;
- branche basse légèrement courbe, raccordée au côté sous les petites hanches,
  proche du bassin ;
- aucune cuspide à la taille ou au raccord bassin.

La construction de base exige mêmes formes en miroir et mêmes longueurs de
couture. Une correction morphologique ultérieure peut rompre cette symétrie de
façon documentée.

Invariants : raccords taille et emmanchure homologues, longueurs côté dos/devant
égales et crans dans le même ordre.

### Bloc 12 — Encolure définitive (p. 62–64)

Fermer les pinces d'épaule et assembler virtuellement les épaules dos/devant
jusqu'aux pinces. Construire l'encolure comme une courbe composite dans cet
espace assemblé :

- tangente horizontale et platitude large au milieu dos ;
- raccord doux à l'épaule, généralement sans longue platitude ;
- au devant, platitudes d'environ un tiers de la largeur et de la profondeur du
  rectangle ;
- tangente horizontale au milieu devant ;
- continuité `C1` au raccord d'épaule.

Ramener ensuite chaque segment vers la pièce ouverte. Cette construction évite
les becs qu'engendreraient deux courbes indépendantes.

### Bloc 13 — Vérification de l'emmanchure assemblée (p. 45–46, 63–64)

Fermer pince d'épaule dos et pince bretelle, puis assembler les épaules.

La courbe complète doit :

- être continue et légèrement courbée au raccord d'épaule ;
- ne présenter ni bec, ni creux, ni angle ;
- conserver les carrures prévues ;
- garder la platitude horizontale au côté.

Mesurer séparément les arcs dos et devant. La différence absolue attendue est
de 1 à 2 cm ; l'un ou l'autre peut être le plus long selon la morphologie. Une
valeur hors plage est un avertissement orientant vers la pente d'épaule, la
répartition des volumes ou la restauration après pince. Ne jamais déformer
automatiquement la courbe pour forcer cet intervalle.

La manche consommera ces arcs réellement tracés et devra être invalidée après
toute modification de pince ou d'emmanchure.

## 6. Aisance de base (p. 65–66)

L'aisance minimale destinée à la toile est une transformation de la base
exacte :

1. nouvelle ligne d'épaule parallèle, distante de 1 cm ;
2. ligne basse d'emmanchure abaissée de 2 cm ;
3. côté déplacé vers l'extérieur de 1 cm sur le dos et 1 cm sur le devant ;
4. partie basse de l'emmanchure retracée depuis la carrure jusqu'au nouveau
   côté en conservant son caractère et sa tangence.

Ce n'est pas un offset normal uniforme de toute l'emmanchure. Il s'agit d'une
transformation contrainte par des repères. **[À VALIDER]** : transport exact de
la forme entre carrure et nouveau côté.

Invariant simple : `+1 cm` sur chacune des quatre demi-largeurs du tour complet
ajoute 4 cm de circonférence.

## 7. Patron de toile (p. 67–75)

### 7.1 Géométrie de coupe

À partir de la ligne de couture avec aisance :

- marge standard : 1 cm ;
- côtés : réserve de 2 à 3 cm ;
- devant : croisure provisoire de 2 à 3 cm ;
- dos de toile : toujours au pli, même si une couture milieu dos est envisagée
  pour le futur modèle ;
- ajouter droit-fil, coupe au pli/quantité, crans, points de pince et repères des
  horizontales.

La marge est un profil par segment. Le pli du dos implique marge nulle au
milieu. Les crans s'attachent à la couture, puis sont projetés sur le contour de
coupe ; l'entaille physique reste un détail d'instruction. Les indications de
profondeur observées dans les généralités et dans la préparation de la toile ne
semblent pas parfaitement identiques (environ 2–3 mm contre 3–5 mm) : stocker
une règle d'export par contexte et laisser la valeur **[À VALIDER]**.

### 7.2 Contraintes matière

La toile doit être stable, non extensible, non fluide et sans détente notable.
Le droit-fil est parallèle à la lisière. Ces données ne modifient pas le calcul
du gabarit, mais appartiennent au profil d'essayage et aux instructions.

### 7.3 Ordre d'assemblage

L'ordre est une partie de la méthode et doit pouvoir alimenter un futur
pas-à-pas :

1. pince bretelle ;
2. pince d'épaule dos ;
3. pinces de taille ;
4. côtés, ancrés d'abord à la taille puis montés séparément vers le haut et le
   bas ;
5. épaules en dernier.

Les pinces sont évaluées fermées : épaule rectiligne, chapeau correct, pli dans
le bon sens. Les pinces de taille se ferment depuis la taille vers leurs
extrémités et sont couchées vers le milieu de la pièce. À l'épaule, le dos
recouvre le devant pendant l'épinglage de la toile.

## 8. Essayage et corrections (p. 76–85)

Le moteur ne peut pas déduire ces corrections des seules mensurations. Il doit
fournir un modèle de saisie et de report, avec observation distincte du
diagnostic.

```ts
interface FittingCorrection {
  observation: string;
  assemblyState: "front-open" | "front-closed";
  piece: "back" | "front" | "both";
  bodySide: "left" | "right" | "symmetric";
  cause: CorrectionCause;
  delta: GeometricDelta;
  anchors: EntityId[];
  invalidates: EntityId[];
  sourcePage: number;
}
```

### 8.1 Invariants globaux

- milieux et axes verticaux d'aplomb sur le corps ;
- taille horizontale ;
- horizontales homologues raccordées ;
- correction d'un côté recopiée par symétrie seulement si la personne le
  permet ; sinon deux variantes anatomiques distinctes.

### 8.2 Milieu devant — devant ouvert (p. 78–80)

Les deux lignes de milieu doivent être verticales, concordantes, sans écart ni
chevauchement. Diagnostic ordonné :

1. vérifier la longueur devant saisie et reportée ;
2. si elle est fausse, corriger la mesure puis régénérer ;
3. si elle est correcte, libérer l'épaule et remonter le devant jusqu'à
   l'aplomb ;
4. relever la nouvelle épaule et la nouvelle profondeur d'encolure ;
5. retracer épaule et encolure à plat ;
6. ajouter une réserve provisoire si la nouvelle position manque de largeur ;
7. appliquer la correction symétrique ou reprendre chaque côté séparément.

Une pente corrigée est une surcharge morphologique, pas une modification de la
mesure brute.

### 8.3 Dos (p. 81)

Le milieu dos est normalement stable. Un défaut suggère d'abord des pentes
d'épaule dissymétriques ou une erreur de respect des marges au montage. La
pince milieu dos, d'environ 1 cm dans le cas standard, reste ajustable à la
morphologie et utile sur la toile très près du corps.

### 8.4 Pinces de taille devant — devant fermé (p. 81)

Fermer en superposant les **lignes** de milieu, ancrer d'abord la taille, puis
raccorder emmanchure, carrure, petites hanches et bassin.

Les pinces calculées peuvent être déplacées, supprimées, remplacées ou
redistribuées. Critères : toile plaquée sans pli parasite et largeur finale de
taille conservée. Le domaine doit donc accepter une collection de pinces et ne
pas figer leur nombre.

### 8.5 Ligne de côté — devant fermé (p. 82)

Elle doit tomber verticalement sur le corps, même si sa géométrie à plat est
courbe. Une bascule sous la taille traduit souvent une répartition particulière
des volumes devant/dos, pas un mauvais calcul global.

Correction : relever le trajet souhaité, ouvrir localement, ajouter la largeur
nécessaire sur la bonne pièce et rétablir la couture. Pour le moteur, cela
devient un champ de déplacement `deltaX(y)`.

- redistribution pure : deltas opposés dos/devant, tour total conservé à
  chaque hauteur ;
- ajout de volume : composante commune ou nette distincte.

La source ne sépare pas quantitativement ces deux cas : **[À VALIDER]**.

### 8.6 Emmanchures — devant fermé (p. 83–84)

Un bâillement bas devant vient le plus souvent d'une pince bretelle trop faible,
plus rarement d'une marge mal respectée. Augmenter la pince jusqu'à absorption
du surplus, puis recalculer chapeau, épaule et emmanchure.

Au dos, la pince d'épaule joue le même rôle pour le volume d'omoplate et le
galbe d'épaule. Une augmentation invalide également épaule et emmanchure.

Il est déconseillé de corriger simultanément milieu devant et emmanchure : le
premier s'observe devant ouvert, la seconde devant fermé. Le moteur doit
encoder ces préconditions ou émettre un conflit de session.

### 8.7 Report sur la base (p. 85)

La toile est démontée, alignée sur le patron par le milieu puis par les
horizontales de construction, mise parfaitement à plat, et toutes les
corrections sont reportées sur la ligne de couture.

Le moteur modélise ce report comme une série de deltas ancrés, appliqués avant
aisance et marge. Il enregistre les dépendances invalidées :

- valeur de pince → chapeau, épaule, emmanchure, longueur d'arc, manche ;
- pente d'épaule → encolure, épaule, emmanchure ;
- côté → relation de couture, crans et largeurs par niveau ;
- déplacement de pince → suppression totale et contour de taille.

## 9. Base finie et variantes de transformation (p. 86–89)

Après report, produire `correctedBase` sans aisance, marge ni croisure. L'aisance
appropriée au modèle et au tissu n'est ajoutée qu'avant la transformation ; les
marges viennent après la transformation finale.

Conserver ensemble :

- `completeDartedBase`, empreinte ajustée et support des modèles près du corps ;
- `globalUndartedSupport`, support de transformations amples/extensibles.

Le choix dépend du modèle : présence de découpes, ampleur, élasticité,
abaissement d'emmanchure et construction de manche. Une transformation qui
doit préserver une emmanchure exacte part de la base avec pinces.

## 10. États géométriques internes

```text
frame
  → preliminaryCurves
  → openDarts
  → closedForTrueing
  → reopenedWithCaps
  → assembledVerification
  → exactBodyBlock
  → fittingEase
  → fittingSeamPattern
  → cutLineWithAllowances
  → fittingCorrections
  → correctedBase
```

Les transformations de fermeture sont rigides autour des pivots. Les
rectifications se font dans l'état fermé ou assemblé pertinent, puis sont
transportées vers la géométrie ouverte par transformation inverse.

## 11. Invariants à automatiser

1. Toutes les horizontales du cadre sont perpendiculaires aux milieux.
2. Dos et devant partagent taille, bassin, emmanchure et carrure.
3. Les largeurs poitrine et bassin recomposent les demi-tours.
4. `frontCrossWidth < backCrossWidth`.
5. Épaule dos fermée : longueur mesurée et pente courante respectées.
6. Épaule devant fermée : longueur mesurée et pente courante respectées.
7. Les jambes de chaque pince d'épaule ont même longueur de couture.
8. Après fermeture bretelle, carrure et largeur d'emmanchure retrouvent leurs
   cibles.
9. Les largeurs cousues à la taille valent `waist/4 - 1` et `waist/4 + 1`, sauf
   surcharge de répartition explicite.
10. Aucun plafond de pince n'est dépassé sans stratégie supplémentaire.
11. Le côté dos et le côté devant concordent en longueur et en crans.
12. Encolure assemblée : continuité et tangence aux milieux/épaule.
13. Emmanchure assemblée : continuité, tangence au côté et absence de cuspide.
14. Différence d'arcs d'emmanchure 1–2 cm : avertissement sinon.
15. Fermeture puis réouverture restitue les points non rectifiés.
16. Une modification de pince invalide toutes les géométries dépendantes.
17. La variante de toile ajoute 4 cm de tour par l'élargissement latéral prévu.
18. Les marges n'altèrent jamais les longueurs de couture.
19. `correctedBase` finit avec aisance, marge et croisure à zéro.
20. Une correction asymétrique conserve deux provenances et n'est pas
   remiroirée automatiquement.

## 12. Tests recommandés

### Golden tests

- encolure, tour de cou 38 cm : valeurs brutes `7,33…` et `2,375`, variante
  illustrée `7,5 / 2,5` ;
- poitrine 88, taille 68, bassin 92 : suppressions 5 et 6 cm, allocations de la
  section 9.3, point de taille commun ;
- pince bretelle : fermeture, épaule rectiligne, restauration des largeurs,
  chapeau valide ;
- pince dos : exécuter les variantes 1 cm total et 2 cm total jusqu'à
  validation, avec même invariant de longueur d'épaule fermée.

### Tests de propriétés

- 200 profils plausibles et profils limites ;
- pas de `NaN`, auto-intersection ni inversion d'orientation ;
- contraintes de tangence et perpendicularité dans une tolérance nommée ;
- réversibilité des transformations ;
- conservation des tours après répartition et corrections latérales pures ;
- ordre des crans stable après retracé et marge ;
- longueur de manche invalidée si un arc d'emmanchure change.

### Tests de corrections d'essayage

- remplacement de longueur devant et régénération ;
- surcharge de pente d'épaule et retracé d'encolure ;
- augmentation de pince bretelle/dos et invalidations ;
- déplacement/suppression/création d'une pince taille ;
- redistribution latérale `deltaX(y)` à tour constant ;
- ajout net de volume distinct d'une redistribution ;
- conflit si une observation `front-open` est combinée avec une correction
  d'emmanchure `front-closed` dans la même étape.

## 13. Questions laissées ouvertes

1. Arrondi d'encolure au demi-centimètre ou autre règle éditoriale ?
2. Pince d'épaule dos : 1 cm total ou 2 cm total dans le cas standard ?
3. Confirmation que `fullBackWidth` doit être divisée par deux sur la
   demi-pièce.
4. Loi exacte reliant valeur de pince et longueur de platitude à la taille.
5. Politique générale de répartition quand les plafonds de pinces sont atteints.
6. Transport mathématique précis de l'emmanchure lors de l'aisance.
7. Tolérances numériques pour « aplomb », tangence, bâillement et concordance.
8. Formalisation de la correction de côté : redistribution seule ou ajout de
   volume dans les différents exemples.
9. Étendue de l'automatisation des corrections d'essayage : la source fournit
   un protocole d'observation, pas une quantité calculable depuis les seules
   mensurations.
10. Profondeur physique des crans selon qu'il s'agit d'un patron courant ou de
    la toile d'essayage.

Ces ambiguïtés ne bloquent pas la modélisation du moteur. Elles imposent que les
constantes et politiques soient configurables, sourcées et testées, afin qu'une
validation ultérieure ne nécessite pas de réécrire le graphe de construction.
