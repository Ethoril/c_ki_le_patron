# Référence des règles de calcul — moteur du buste

> Ce document décrit **ce que le moteur calcule réellement** (fichiers
> `src/engine/method.ts`, `src/engine/pieces/buste.ts`, `src/engine/layout.ts`),
> règle par règle, avec le profil de démonstration en exemple chiffré.
> Il sert à relire le moteur livre en main et à repérer quoi corriger où.
> En cas d'écart avec `docs/methode/buste.md` (la transcription, qui fait
> autorité), c'est le code qui a un bug.
>
> **Profil de démonstration** : poitrine 88 · taille 68 · bassin 92 · cou 38 ·
> carrure dos 35 · carrure devant 33 · longueur dos 41 · longueur devant 44 ·
> hauteur poitrine 26 · écart poitrine 18 · épaule 13.

## 1. Conventions du repère

| Règle | Valeur | Où corriger |
|---|---|---|
| Unité | centimètre partout (moteur, SVG, PDF) | — |
| Axe y | **vers le bas** (convention SVG) ; un angle positif descend | `geometry/point.ts` |
| Origine y = 0 | ligne d'épaule dos | `pieces/buste.ts` |
| Milieu dos | x = 0 | `pieces/buste.ts` |
| Milieu devant | x = tour de poitrine / 2 → **44** | `pieces/buste.ts` |
| Calculs | toujours **exacts**, jamais arrondis | — |
| Arrondi d'affichage | au ½ cm **supérieur** (7,33 → 7,5) — panneau de valeurs uniquement | `METHOD.ARRONDI_AFFICHAGE` |

## 2. Mesures d'entrée et validation

Bornes physiques (erreur bloquante) — `measurements.ts`, `MEASUREMENT_FIELDS` :

| Mesure | min | max | | Mesure | min | max |
|---|---|---|---|---|---|---|
| Tour de poitrine | 60 | 160 | | Longueur dos | 30 | 60 |
| Tour de taille | 45 | 150 | | Longueur devant | 30 | 65 |
| Tour de bassin | 60 | 170 | | Longueur d'épaule | 8 | 20 |
| Tour de cou | 26 | 55 | | Hauteur de poitrine | 18 | 40 |
| Carrure dos | 26 | 55 | | Écart de poitrine | 12 | 30 |
| Carrure devant | 24 | 52 | | | | |

Contrôles de cohérence (avertissement non bloquant) — `checkCoherence` :
carrure devant ≥ carrure dos · longueur devant ≤ longueur dos ·
taille ≥ poitrine · hauteur poitrine ≥ longueur devant.

## 3. Valeurs dérivées

| Valeur | Formule | Démo | Réf. livre | Constante |
|---|---|---|---|---|
| Largeur d'encolure | cou / 6 + 1 | 7,333 (aff. 7,5) | p. 39 | `ENCOLURE_LARGEUR` |
| Profondeur encolure dos | cou / 16 | 2,375 (aff. 2,5) | p. 40 | `ENCOLURE_PROFONDEUR_DOS` |
| Profondeur encolure devant | largeur encolure **exacte** + 2 | 9,333 (aff. 9,5) | p. 40 | `ENCOLURE_PROFONDEUR_DEVANT` |
| Pince bretelle | poitrine / 20 + 1 | 5,4 | p. 52 | `PINCE_BRETELLE` |
| À absorber, haut (par quart) | (poitrine − taille) / 4 | 5 | p. 56 | calcul dans `buste.ts` |
| À absorber, bas (par quart) | (bassin − taille) / 4 | 6 (info seulement) | p. 56 | idem |

## 4. Lignes horizontales et verticales du gabarit

| Ligne | Formule | Démo (y ou x) | Réf. | Constante |
|---|---|---|---|---|
| Ligne d'épaule dos | y = 0 (référence) | 0 | p. 33 ét. 2 | — |
| Ligne de taille | y = longueur dos | 41 | p. 33 ét. 3 | — |
| Ligne d'emmanchure | y = longueur dos / 2 | 20,5 | p. 34 ét. 7 | `LIGNE_EMMANCHURE` |
| Ligne de carrure | y = longueur dos / 3 | 13,667 | p. 34 ét. 8 | `LIGNE_CARRURE` |
| Ligne d'épaule devant | y = taille − longueur devant | −3 | p. 35 ét. 10 | — |
| Ligne de poitrine (devant) | y = épaule devant + hauteur poitrine | 23 | p. 50 | — |
| Ligne de côté (commune) | x = poitrine/4 − 1 (dos = P/4 − 1, devant = P/4 + 1) | 21 | p. 34-35 | `DEMI_LARGEUR_AJUSTEMENT` |

## 5. Demi-dos, point par point

| # | Point / tracé | Règle | Démo (x ; y) |
|---|---|---|---|
| 1 | `nuque` | (0 ; profondeur encolure dos) — **sous** la ligne d'épaule | (0 ; 2,375) |
| 2 | `snp-dos` | (largeur encolure ; 0) — **sur** la ligne d'épaule | (7,33 ; 0) |
| 3 | Encolure dos | courbe de `nuque` à `snp-dos` ; tangente **horizontale** à la nuque (platitude du milieu dos, p. 63) ; arrivée **perpendiculaire à l'épaule** ⚠ à valider à l'essayage | — |
| 4 | `epaule-dos` | depuis `snp-dos`, droite à **18° sous l'horizontale**, longueur = **épaule mesurée** (pince d'épaule absorbée, p. 47) | (19,70 ; 4,02) |
| 5 | `carrure-dos` | (carrure dos / 2 ; y carrure) | (17,5 ; 13,67) |
| 6 | `bissectrice-dos` | coin (carrure dos/2 ; y emmanchure) + **1,5 cm** sur la bissectrice à 45° vers le haut-côté : +1,5·√2/2 en x, −1,5·√2/2 en y | (18,56 ; 19,44) |
| 7 | `platitude-dos` | **repère** à (x côté − **1** ; y emmanchure) — la queue du virage lèche la ligne à son niveau (~1 mm), ce n'est pas un point de passage exact | (20 ; 20,5) |
| 8 | `dessous-bras` | (x côté ; y emmanchure) | (21 ; 20,5) |
| 9 | Emmanchure dos | spline 4-5-6 avec tangente **imposée à 45°** au point de bissectrice (la courbe coupe la bissectrice à angle droit, p. 42-44), puis **une seule cubique** 6 → 8 à courbure continue (coup de perroquet), raccordée **C1** ; arrivée exactement horizontale au dessous-bras | longueur mesurée 18,63 |
| 10 | Côté dos | **droite** de `dessous-bras` à (x côté − pince de côté ; y taille) | → (19 ; 41) |
| 11 | Milieu dos cintré | droite de (milieu dos ; y taille) à (0 ; **y emmanchure**), puis verticale jusqu'à la nuque | (1 ; 41) → (0 ; 20,5) |
| 12 | Pince demi-dos | axe = milieu entre milieu dos cintré et côté cintré à la taille ; sommet à **2 cm au-dessus** de la ligne d'emmanchure ⚠ interprétation ; jambes à ± valeur/2 sur la taille | axe x = 10 ; sommet (10 ; 18,5) |

## 6. Demi-devant, point par point

| # | Point / tracé | Règle | Démo (x ; y) |
|---|---|---|---|
| 1 | `snp-devant` | (44 − largeur encolure ; y épaule devant) | (36,67 ; −3) |
| 2 | `gorge` | (44 ; y épaule devant + profondeur encolure devant) | (44 ; 6,33) |
| 3 | Encolure devant | courbe gorge → snp ; tangente **horizontale à la gorge**, arrivée **verticale** au point d'épaule (suit la verticale d'encolure, p. 63) | — |
| 4 | `saillant` | (44 − écart/2 ; y poitrine) — hauteur de poitrine portée **verticalement** | (35 ; 23) |
| 5 | Épaule provisoire | depuis `snp-devant`, droite à **26° sous l'horizontale** vers le côté (direction 180 − 26 = 154°), longueur = **épaule − 1** (embu de la pince d'épaule dos absorbée, p. 47) ⚠ à valider | 12 cm |
| 6 | `pince-bretelle-1` | milieu de l'épaule provisoire (épaule devant / 2) | (31,27 ; −0,37) |
| 7 | Ouverture de la pince | **pivot autour du saillant** d'un angle θ = 2·arcsin( v / (2·jambe) ), v = poitrine/20 + 1, jambe = distance pb1→saillant. Le pivot égalise automatiquement les deux jambes | jambe = 23,67 ; θ = **13,10°** |
| 8 | `pince-bretelle-2` | pb1 pivoté de −θ autour du saillant | (26,07 ; 1,08) |
| 9 | `epaule-devant` | extrémité provisoire pivotée de −θ ; la seconde moitié d'épaule (pb2 → extrémité) garde sa longueur de 6 cm | (21,42 ; 4,87) |
| 10 | `carrure-devant` | (44 − carrure devant/2 ; y carrure) — **non pivotée** (la pince est fermée avant le tracé de l'emmanchure dans le livre ; choix documenté : seuls l'épaule et le haut d'emmanchure pivotent) | (27,5 ; 13,67) |
| 11 | `bissectrice-devant` | coin (44 − carrure devant/2 ; y emmanchure) + **2,5 cm** à 45° vers le haut-côté : −2,5·√2/2 en x, −2,5·√2/2 en y | (25,73 ; 18,73) |
| 12 | `platitude-devant` | **repère** à (x côté + 1 ; y emmanchure) — même rôle qu'au dos | (22 ; 20,5) |
| 13 | Emmanchure devant | spline 9-10-11 avec tangente imposée à 45° à la bissectrice, puis une seule cubique 11 → `dessous-bras` (21 ; 20,5), raccord C1, arrivée horizontale | longueur mesurée 21,54 |
| 14 | Pince devant | axe vertical **par le saillant** ; sommet à 2 cm **sous** le saillant ⚠ transcription ; jambes ± valeur/2 sur la taille | sommet (35 ; 25) |
| 15 | Côté devant | droite de `dessous-bras` à (x côté + pince de côté ; y taille) | → (23 ; 41) |

## 7. Répartition des pinces de taille (p. 54-58)

Algorithme (`repartirPincesTaille`), U = (poitrine − taille)/4 par quart :

```
côté      = borner( U − 3 , entre 0 et 4 )   ← le minimum qui garde la pince devant ≤ 3
devant    = min( 3 , U − côté )
demi-dos  = min( 2 , U − côté )
milieu dos = min( U − côté − demi-dos , 2 )
```

- Excédents (au-delà des plafonds) → avertissement « pince supplémentaire
  requise » (p. 58), émis aussi dès que le milieu dos brut dépasse 1 cm.
- **La pince de côté a la même valeur au dos et au devant** (p. 54).
- Démo : U = 5 → côté 2 · devant 3 · demi-dos 2 · milieu dos 1
  (exemple normatif p. 57, fig. 3). Vérification : devant 2+3 = 5 ✓,
  dos 2+2+1 = 5 ✓.

| Plafond | Valeur | Constante |
|---|---|---|
| Pince devant | 3 | `PLAFOND_PINCE_DEVANT` |
| Pince de côté (chacune) | 4 | `PLAFOND_COTE` |
| Pince demi-dos | 2 | `PLAFOND_PINCE_DEMI_DOS` |
| Milieu dos | 2 (avertissement au-delà de 1) | `PLAFOND_MILIEU_DOS` |

**Forme des pinces de taille** (p. 59-60) : platitude = **5 − valeur**,
bornée entre 2 et 4 cm ⚠ transcription de la proportion. Les bords de pince
sont verticaux (parallèles) sur platitude/2 au-dessus de la taille, puis
rejoignent le sommet en droite. Démo : pince devant 3 → platitude 2 ;
pince demi-dos 2 → platitude 3. Constante : `PLATITUDE_PINCE`.

## 8. Courbes : comment elles sont tracées

| Courbe | Méthode | Contraintes |
|---|---|---|
| Emmanchures (haut) | spline **Catmull-Rom** épaule → carrure → bissectrice, convertie en Béziers cubiques ; coefficient de tangente k = (1 − tension)/6 ; **direction de tangente imposable par point** (l'amplitude Catmull-Rom est conservée) | tension par courbe dans `METHOD.TENSION` (0 = arrondi maximal, actuellement 0 partout) ; tangente à **45°** imposée au point de bissectrice (`TANGENTE_BISSECTRICE_DEG`) |
| Emmanchures (virage) | **une seule cubique** bissectrice → dessous-bras, à courbure continue (coup de perroquet, aucune jonction) ; poignée de départ m1 = min(poignée de la spline, valeur de bissectrice, corde/3), poignée d'arrivée horizontale m2 = **corde/2** | raccord **C1** avec la spline (même poignée de part et d'autre de la bissectrice) ; jamais sous la ligne d'emmanchure ; queue léchant la ligne au repère de platitude (≤ 1,2 mm sur le profil démo), arrivée exactement horizontale |
| Encolures | Bézier cubique unique (forme de Hermite) : point + tangente à chaque bout, tangentes d'amplitude = longueur de la corde | dos : horizontale à la nuque, ⊥ à l'épaule à l'arrivée ; devant : horizontale à la gorge, verticale au point d'épaule |
| Longueur d'arc | échantillonnage 128 points par Bézier | précision ≈ 0,01 cm — c'est la mesure utilisée pour l'emmanchure de la manche (M5) |

## 9. Mise en planche et avertissements

- Après construction, le devant est translaté pour garantir **au moins 5 cm**
  entre les boîtes englobantes des pièces (`ECART_PIECES`, `layout.ts`) —
  équivalent du blanc de 10-15 cm des planches (p. 35). Aucun chevauchement
  possible, quelles que soient les mesures. Les longueurs sont mesurées avant
  translation.
- Avertissements émis par le moteur : `pince-supplementaire` (répartition) +
  les 4 contrôles de cohérence des mesures (§2).

## 10. Points à vérifier en priorité (⚠)

| Sujet | Ce que fait le moteur | Doute |
|---|---|---|
| Arrivée de l'encolure dos | perpendiculaire à la ligne d'épaule inclinée | le livre trace au perroquet sans chiffrer l'angle — à valider à l'essayage |
| Embu d'épaule | dos = épaule mesurée, devant = épaule − 1 | l'alternative dos = épaule + 1, devant = épaule est possible (fig. 4 p. 47 ambiguë) |
| Sommet pince demi-dos | 2 cm **au-dessus** de la ligne d'emmanchure (entre emmanchure et carrure, comme les planches p. 55) | la note de méthode disait « y emmanchure + 2 » (= dessous) ; interprétation planches retenue |
| Sommet pince devant | 2 cm sous le saillant | non chiffré par le livre |
| Rotation pince bretelle | seuls seconde moitié d'épaule et extrémité pivotent ; carrure/bissectrice/dessous-bras fixes | choix documenté (D6) ; le livre ferme la pince avant de tracer l'emmanchure |
| Platitude des pinces | formule 5 − valeur bornée 2..4 | le livre donne la proportion en mots, pas en formule |
| Tension des splines | 0 partout | à ajuster visuellement contre les planches (p. 42 : seul le point de bissectrice peut bouger) |
| Poignées du virage d'emmanchure | m1 borné (spline / bissectrice / corde÷3), m2 = corde/2 | chiffres calibrés visuellement sur les planches (validé livre en main 2026-07-07), pas donnés par le livre — verrouillés par les golden tests (tenue à mi-virage, queue au repère) |

## 11. Carte des constantes (`src/engine/method.ts`)

`ANGLE_EPAULE_DOS` 18° · `ANGLE_EPAULE_DEVANT` 26° · `ENCOLURE_*` (formules §3) ·
`ARRONDI_AFFICHAGE` · `LIGNE_EMMANCHURE` /2 · `LIGNE_CARRURE` /3 ·
`DEMI_LARGEUR_AJUSTEMENT` 1 · `BISSECTRICE_EMMANCHURE_DOS` 1,5 ·
`BISSECTRICE_EMMANCHURE_DEVANT` 2,5 · `PLATITUDE_EMMANCHURE` 1 (repère) ·
`TANGENTE_BISSECTRICE_DEG` 45 ·
`PINCE_BRETELLE` P/20+1 · `EMBU_EPAULE_DOS` 1 · `RETRAIT_SOMMET_PINCE_DEVANT` 2 ·
`RETRAIT_SOMMET_PINCE_DOS` 2 · plafonds §7 · `PLATITUDE_PINCE` ·
`TENSION.emmanchureDos/Devant` 0 · `ECART_PIECES` 5 (dans `layout.ts`).

Chaque constante modifiée doit être couverte par la règle de travail :
**aucune modification du moteur sans test** — les golden tests
(`tests/buste.test.ts`) verrouillent les exemples du livre, le snapshot SVG
(`npx vitest run -u` pour l'assumer) verrouille le tracé.
