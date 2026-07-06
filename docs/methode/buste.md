# Méthode — Buste de base (demi-dos + demi-devant)

> **Statut : TRANSCRIPTION v1 À VALIDER LIVRE EN MAIN.**
> Ce document fait autorité sur le code (`src/engine/pieces/buste.ts`). Il a été
> rédigé à partir du cahier des charges et des principes connus de la méthode
> Gilewska ; chaque point marqué **[À VALIDER]** est un choix de transcription
> qui doit être confronté au livre (*Les patrons de base sur mesure*, Eyrolles)
> et corrigé ici AVANT de corriger le code. Les références de pages sont à
> compléter lors de cette relecture.

## Conventions

- Unité : centimètre. Axe **y vers le bas** (convention SVG).
- Planche en miroir comme dans le livre : **milieu dos à gauche (x = 0)**,
  **milieu devant à droite (x = tour de poitrine / 2)**, couture de côté
  commune à x = tour de poitrine / 4.
- `y = 0` : horizontale passant par le point d'encolure côté cou du dos
  (« ligne d'épaule dos »).
- Le patron est tracé **sans aisance ni valeurs de couture**.
- Arrondi de la méthode : au demi-centimètre le plus proche (7,33 → 7,5).

## Valeurs dérivées (exemples du livre, tour de cou 38)

| Valeur | Formule | Exemple |
|---|---|---|
| Largeur d'encolure | cou / 6 + 1 | 38 → 7,33, arrondi **7,5** |
| Profondeur d'encolure dos | cou / 16 | 38 → 2,38, arrondi **2,5** |
| Profondeur d'encolure devant | largeur arrondie + 2 | 7,5 → **9,5** |
| À absorber à la taille (haut, par quart) | (poitrine − taille) / 4 | 88/68 → **5** |
| À absorber à la taille (bas, par quart) | (bassin − taille) / 4 | 92/68 → **6** (info pour la jupe) |

## Construction du demi-dos

1. **Cadre.** Milieu dos vertical en x = 0. Ligne de taille horizontale en
   y = profondeur d'encolure dos + longueur dos. Point `nuque` = (0, profondeur
   encolure dos).
2. **Encolure dos.** Point d'épaule côté cou `snp-dos` = (largeur encolure, 0).
   Courbe de `nuque` à `snp-dos`, tangente horizontale au milieu dos,
   perpendiculaire à la ligne d'épaule à l'arrivée (raccord sans bec).
3. **Épaule dos.** Droite à **18°** sous l'horizontale depuis `snp-dos`,
   longueur = longueur d'épaule → `epaule-dos`.
4. **Ligne de poitrine.** Positionnée par le devant (étape D4) ; commune aux
   deux pièces. Point de côté `dessous-bras` = (poitrine/4, y poitrine).
5. **Carrure dos.** Point de passage de l'emmanchure : x = carrure dos / 2,
   y = mi-hauteur entre `epaule-dos` et la ligne de poitrine. **[À VALIDER :
   le livre définit la ligne de carrure autrement ?]**
6. **Emmanchure dos.** Spline passant par `epaule-dos` → point de carrure →
   point de bissectrice (à **1,5 cm** du coin côté/poitrine, sur la bissectrice
   du coin) → `dessous-bras`. **[À VALIDER : 1,5 dos / 2,5 devant ou l'inverse]**
7. **Pinces de taille dos.** Valeur à absorber = (poitrine − taille)/4.
   Répartition : couture de côté (≤ 2 cm par pièce), pince demi-dos (≤ 2 cm),
   milieu dos (1 cm nominal, ≤ 2 cm) ; au-delà, avertissement « pince
   supplémentaire requise ». **[À VALIDER : ordre exact de remplissage]**
   - Milieu dos : la couture est retracée de (0, y poitrine) vers
     (valeur milieu dos, y taille). **[À VALIDER : point de départ du cintrage]**
   - Pince demi-dos : axe vertical à mi-distance entre le milieu dos cintré et
     le côté cintré ; sommet 2 cm au-dessus de la ligne de poitrine.
     **[À VALIDER : position de l'axe et du sommet]**
8. **Côté dos.** Droite de `dessous-bras` à (poitrine/4 − reprise côté, y taille).

## Construction du demi-devant

D1. **Cadre.** Milieu devant vertical en x = poitrine/2. Point d'épaule côté cou
   `snp-devant` = (poitrine/2 − largeur encolure, y taille − longueur devant).
   **[À VALIDER : le livre reporte-t-il la longueur devant verticalement ?]**
D2. **Encolure devant.** Point de gorge = (poitrine/2, y de `snp-devant` +
   profondeur encolure devant). Courbe gorge → `snp-devant`, tangente verticale
   à la gorge, perpendiculaire à l'épaule à l'arrivée.
D3. **Saillant.** x = poitrine/2 − écart de poitrine / 2 ; y tel que la
   distance `snp-devant` → saillant = hauteur de poitrine (arc de cercle depuis
   le point d'encolure).
D4. **Ligne de poitrine.** Horizontale passant par le saillant, prolongée
   jusqu'au milieu dos.
D5. **Épaule devant + pince bretelle.** L'épaule finie est à **26°** sous
   l'horizontale, pince fermée. Construction :
   - Épaule provisoire à 26° depuis `snp-devant`, longueur = longueur d'épaule.
   - Première jambe de pince : du milieu de l'épaule (`pince-bretelle-1`) au
     saillant.
   - Ouverture de la pince par pivot autour du saillant, valeur **3 cm** sur la
     ligne d'épaule **[À VALIDER : valeur/formule du livre]** ; la rotation
     égalise automatiquement les deux jambes (cahier §4.4) et fait pivoter la
     seconde moitié d'épaule et le haut de l'emmanchure.
D6. **Carrure devant.** x = poitrine/2 − carrure devant / 2, y = mi-hauteur
   entre l'extrémité d'épaule (pince fermée) et la ligne de poitrine, puis
   pivoté avec la pince (le point appartient à la partie pivotée).
D7. **Emmanchure devant.** Spline : extrémité d'épaule (pivotée) → carrure
   (pivotée) → bissectrice à **2,5 cm** du coin → `dessous-bras`.
D8. **Pince de taille devant.** Axe vertical passant par le saillant ; sommet
   2 cm sous le saillant ; valeur ≤ 3 cm (répartition : côté ≤ 2 cm d'abord).
D9. **Côté devant.** Droite de `dessous-bras` à (poitrine/4 + reprise côté,
   y taille).

## Choix documentés de la v1 (cahier §4.4)

- Calcul des pinces **poitrine − taille** appliqué en partie haute ; le bas
  (bassin − taille) est seulement reporté dans le panneau de valeurs — le buste
  v1 s'arrête à la taille.
- La rotation de la pince bretelle n'entraîne que la seconde moitié d'épaule et
  le point de carrure ; la bissectrice et le dessous de bras ne bougent pas
  (le raccord est lissé par la spline).
- Les longueurs d'emmanchure dos et devant sont mesurées sur les courbes
  tracées et exposées dans le rapport — c'est la donnée d'entrée de la manche
  (M5).

## Invariants testés (tests/invariants.test.ts)

- Contour fermé, sans auto-intersection, aire positive.
- Longueur d'épaule dos = longueur d'épaule devant (hors pince).
- Largeur à la taille après déduction des pinces = tour de taille / 4
  (+ excédent signalé le cas échéant).
- Longueur des coutures de côté dos = devant.
- Jambes de pince bretelle égalisées (|jambe 1| = |jambe 2|).
- Encolures perpendiculaires aux épaules au point de raccord (pas de bec).
