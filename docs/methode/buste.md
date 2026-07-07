# Méthode — Buste de base (demi-dos + demi-devant)

> **Statut : TRANSCRIPTION v2 — VALIDÉE SUR LES PLANCHES DU LIVRE.**
> Ce document fait autorité sur le code (`src/engine/pieces/buste.ts`).
> Transcription confrontée au livre (*Les patrons de base sur mesure*,
> T. Gilewska, Eyrolles, 2019) : références de pages complétées, points
> **[À VALIDER]** de la v1 résolus sauf mention contraire. Les rares points
> restants marqués **[À VALIDER]** sont des détails que le livre ne chiffre
> pas explicitement (choix de transcription proposés, à confirmer à l'essayage).

## Corrections v1 → v2 (à vérifier livre en main en cas de doute)

| # | Point | v1 (faux ou incomplet) | v2 (livre) |
|---|---|---|---|
| C1 | Ligne de taille | y = profondeur encolure + longueur dos | **y = longueur dos** : la longueur dos se reporte depuis la ligne d'épaule (p. 33, ét. 3), et se mesure sur le corps depuis le ras-du-cou *sur la ligne d'épaule* (p. 18) |
| C2 | Encolure dos | nuque au-dessus de la ligne d'épaule | **nuque SOUS la ligne d'épaule** : profondeur (cou/16) portée vers le bas ; le point d'épaule côté cou reste SUR la ligne d'épaule (p. 39-40, fig. 6) |
| C3 | Bas d'emmanchure | « ligne de poitrine » commune posée par le saillant | **ligne d'emmanchure** = mi-distance épaule dos ↔ taille (p. 34, ét. 7). La ligne de poitrine (par le saillant) est une AUTRE ligne, propre à la pince bretelle (p. 50) |
| C4 | Ligne de carrure | mi-hauteur épaule ↔ poitrine | **1/3 de la distance épaule ↔ emmanchure, reporté depuis la ligne d'emmanchure vers le haut** (p. 34, ét. 8) |
| C5 | Largeurs | côté commun à x = poitrine/4 | **dos = poitrine/4 − 1 ; devant = poitrine/4 + 1** (p. 34 ét. 6, p. 35 ét. 10). Dans notre repère miroir les deux lignes de côté coïncident à x = poitrine/4 − 1 |
| C6 | Valeur pince bretelle | 3 cm [à valider] | **tour de poitrine / 20 + 1 cm** (p. 52) |
| C7 | Saillant | arc de cercle depuis le point d'encolure | **hauteur de poitrine portée VERTICALEMENT depuis la ligne d'épaule devant** (perpendiculaire à la ligne d'épaule, p. 50) ; puis demi-écart depuis le milieu devant |
| C8 | Pinces de côté | ≤ 2 cm par pièce | **valeur identique dos/devant, ≤ 4 cm chacune** (p. 54-55) |
| C9 | Pince d'épaule dos | absente de la v1 | pince principale de la méthode (p. 45-48) ; v1 : valeur **absorbée** (option du livre, p. 47), cf. §Épaule dos |
| C10 | Bissectrices | à valider dos/devant | **1,5 cm dos, 2,5 cm devant** (p. 42, ét. 2) + **platitude de 1 cm** côté (ét. 3), absente de la v1 |

---

## Conventions

- Unité : centimètre. Axe **y vers le bas** (convention SVG).
- Planche en miroir comme dans le livre : **milieu dos à gauche (x = 0)**,
  **milieu devant à droite (x = tour de poitrine / 2)**. Avec les largeurs
  ∓ 1 cm (C5), les lignes de côté dos et devant coïncident à
  **x = poitrine/4 − 1** (le rendu écran peut écarter les pièces, le livre
  utilise un blanc de 10-15 cm, p. 35).
- `y = 0` : **ligne d'épaule dos** (horizontale de référence du gabarit, p. 33
  ét. 2). Le point d'encolure côté cou du dos est SUR cette ligne ; la nuque
  est en dessous (C2).
- Le patron est tracé **sans aisance ni valeurs de couture** (p. 18 : les
  élargissements s'ajoutent à la transformation, jamais à la prise de mesures).
- **Arrondis : pour l'affichage uniquement.** Le livre arrondit ses exemples
  au demi-centimètre supérieur (7,33 → 7,5) mais recommande explicitement de
  construire avec les valeurs exactes (p. 40 : « il vaut mieux travailler avec
  une mesure exacte »). Le moteur calcule exact, le panneau de valeurs arrondit.

## Valeurs dérivées (exemples du livre)

| Valeur | Formule | Exemple | Réf. |
|---|---|---|---|
| Largeur d'encolure | cou / 6 + 1 | 38 → 7,33 (aff. 7,5) | p. 39 |
| Profondeur d'encolure dos | cou / 16 | 38 → 2,38 (aff. 2,5) | p. 40 |
| Profondeur d'encolure devant | largeur d'encolure + 2 | 7,5 → 9,5 | p. 40 |
| Valeur pince bretelle | poitrine / 20 + 1 | 88 → 5,4 | p. 52 |
| À absorber à la taille (haut, par quart) | (poitrine − taille) / 4 | 88/68 → 5 | p. 56 |
| À absorber à la taille (bas, par quart) | (bassin − taille) / 4 | 92/68 → 6 | p. 56 |

Le calcul « bas » sert aux vêtements descendant au bassin ; le buste v1
s'arrête à la taille et applique le calcul « haut » (p. 57 : le calcul
poitrine−taille s'applique en partie haute du buste, à partir de la ligne de
côté). Le calcul « bas » est seulement reporté dans le panneau de valeurs.

## Lignes horizontales du gabarit (communes dos/devant)

Le gabarit dos établit toutes les horizontales ; le devant les recopie **sauf
la ligne d'épaule**, qui lui est propre (p. 35, fig. 3).

| Ligne | Position | Réf. |
|---|---|---|
| Ligne d'épaule dos | y = 0 (référence) | p. 33 ét. 2 |
| Ligne de taille | y = longueur dos (**ligne de référence, rouge**) | p. 33 ét. 3 |
| Ligne de bassin | y = taille + hauteur bassin (hors v1, documenté pour M4+) | p. 33 ét. 4 |
| Ligne d'emmanchure | y = longueur dos / 2 (mi-distance épaule ↔ taille) | p. 34 ét. 7 |
| Ligne de carrure | y = emmanchure − (longueur dos / 2) / 3, soit **(longueur dos / 3)** depuis l'épaule… non : **y = (longueur dos/2) − (longueur dos/2)/3 = longueur dos / 3** | p. 34 ét. 8 |
| Ligne d'épaule devant | y = taille − longueur devant (propre au devant) | p. 35 ét. 10 |
| Ligne de poitrine | y = ligne d'épaule devant + hauteur de poitrine (aide, pince bretelle) | p. 50 |

Note carrure : le livre dit « le tiers de la distance épaule-emmanchure,
reporté depuis la ligne d'emmanchure » (vers le haut). Distance épaule ↔
emmanchure = longueur dos/2 ; le tiers = longueur dos/6 ; donc
**y_carrure = longueur dos/2 − longueur dos/6 = longueur dos/3**.
Exemple longueur dos 40 : emmanchure y = 20, carrure y = 13,33.

## Construction du demi-dos

1. **Cadre** (p. 33-34, ét. 1-6). Milieu dos vertical en x = 0 (**ligne de
   référence, rouge**). Horizontales du tableau ci-dessus. Largeur haut :
   **poitrine/4 − 1**, appliquée sur la ligne d'épaule depuis le milieu dos ;
   perpendiculaire jusqu'à la taille = **ligne de côté**. (Largeur bas
   bassin/4 − 1 : hors v1.)
2. **Encolure dos** (p. 39-40, fig. 6 ; forme p. 63). Point d'épaule côté cou
   `snp-dos` = (largeur encolure, 0), SUR la ligne d'épaule. Nuque =
   (0, **+ profondeur encolure dos**) — sous la ligne d'épaule (C2). Courbe de
   `nuque` à `snp-dos` : **platitude au milieu dos** (tangente horizontale à
   la nuque, p. 63 : « la courbe d'encolure du dos englobe une platitude assez
   large placée à partir du milieu dos ») ; à l'arrivée, raccord net sur
   l'épaule (le livre trace au perroquet en touchant la pointe d'épaule ;
   convention v1 : arrivée ≈ perpendiculaire à la ligne d'épaule inclinée —
   **[À VALIDER à l'essayage]**, le livre ne chiffre pas l'angle d'arrivée).
3. **Épaule dos** (p. 41). Droite à **18° sous l'horizontale** depuis
   `snp-dos`, longueur = **longueur d'épaule** → `epaule-dos`.
   Option B du livre (non implémentée) : fixer l'extrémité par la largeur dos
   (verticale à largeur dos/2 depuis le milieu dos) et joindre à 18° — les
   deux méthodes doivent coïncider si les mesures sont justes (p. 41).
4. **Pince d'épaule dos — valeur absorbée** (p. 45-48, C9). La méthode compte
   trois familles de pinces principales : épaule dos, bretelle devant, taille
   (p. 45). La pince d'épaule dos vaut 1 à 2 cm (p. 46). La v1 utilise
   l'option « valeur absorbée » du livre (p. 47, fig. 4) : pas de pince
   tracée, l'épaule dos conserve un **excédent d'environ 1 cm** par rapport à
   l'épaule devant, résorbé en embu au montage (les bords étant en biais, « se
   détendent très aisément »). Transcription v1 : épaule dos = longueur
   d'épaule ; épaule devant (hors pince bretelle) = **longueur d'épaule −
   1 cm**. **[À VALIDER : le livre montre l'écart de 1 cm en fig. 4 p. 47 sans
   préciser laquelle des deux longueurs est l'entrée ; alternative : dos =
   épaule + 1, devant = épaule.]** v2+ : vraie pince d'épaule dos.
5. **Points d'emmanchure dos** (p. 42, ét. 1-3). Sur la ligne de carrure :
   point de carrure à x = **carrure dos / 2** ; perpendiculaire (pointillés)
   jusqu'à la ligne d'emmanchure. Sur la **bissectrice** du coin (carrure/2,
   y emmanchure) : point à **1,5 cm** du coin, direction 45° vers le haut-côté
   (C10). **Platitude** : point à **1 cm de la ligne de côté**, sur la ligne
   d'emmanchure ; l'arrivée au point de côté est plate (horizontale).
6. **Emmanchure dos** (p. 42-44). Courbe continue, sans rupture, passant
   impérativement par : `epaule-dos` → point de carrure → point de
   bissectrice → platitude → `dessous-bras` = (poitrine/4 − 1, y emmanchure).
   Tracée en deux temps au perroquet dans le livre (épaule→carrure « forme
   légèrement arrondie », puis carrure→emmanchure) ; spline à tension
   paramétrable dans le moteur, la valeur de bissectrice restant le point de
   contrôle ajustable (p. 42, « À noter » : le tracé peut modifier la valeur
   posée sur la bissectrice, pas les autres points).
7. **Pinces de taille dos** (p. 54-58) — voir §Répartition ci-dessous.
   - **Pince de côté dos** : même valeur que la pince de côté devant (C8).
     Partie haute = **droite** de `dessous-bras` au repère de platitude de
     pince aligné sur la valeur à la taille (p. 61, fig. 6 : tracé à la règle).
   - **Pince de demi-dos** : axe vertical à mi-distance entre le bras de la
     pince de côté et le milieu dos (ou le bras de la pince milieu dos si elle
     existe) — p. 54, ét. 5 : placer d'abord la pince de côté, puis diviser en
     deux parties égales. Largeur ≤ 2 cm ; extrémité basse ≤ 11 cm sous la
     taille (hors v1 qui s'arrête à la taille) ; extrémité haute :
     **[À VALIDER : non chiffrée dans le livre ; les planches (p. 55, fig. 2)
     la montrent entre la ligne d'emmanchure et la ligne de carrure —
     proposition v1 : y emmanchure + 2.]**
   - **Milieu dos** (facultative, p. 55) : largeur 1-2 cm max, placée entre la
     ligne d'emmanchure et la ligne de petites hanches. v1 : cintrage du
     milieu dos de (0, y emmanchure) à (valeur, y taille). N'est remplie
     qu'en dernier recours (cf. répartition).
8. **Contour v1** : encolure → épaule → emmanchure → côté (droite) → taille →
   milieu dos.

## Construction du demi-devant

Coordonnées ci-dessous exprimées en local devant (x' depuis le milieu devant,
vers le côté) ; le rendu miroir fait x = poitrine/2 − x'.

D1. **Cadre** (p. 35, ét. 9-10 — validé). Le devant recopie les horizontales
   du dos (taille, emmanchure, carrure — et bassin hors v1), PAS la ligne
   d'épaule. Largeur : **poitrine/4 + 1** → milieu devant (**ligne de
   référence, rouge**) parallèle à la ligne de côté. Sur le milieu devant,
   depuis la taille, reporter **la longueur du devant vers le haut** ; au
   point obtenu, horizontale jusqu'à la ligne de côté = **ligne d'épaule
   devant**.
D2. **Encolure devant** (p. 40, fig. 7 ; forme p. 63). `snp-devant` =
   (largeur encolure, y épaule devant), sur la ligne d'épaule devant. Point de
   gorge = (0, y épaule devant + **profondeur encolure devant**). Courbe
   `snp-devant` → gorge : au départ elle **suit la verticale d'encolure sur
   2-3 cm** (p. 63, point 3), puis s'arrondit ; arrivée à la gorge tangente
   horizontale (perpendiculaire au milieu devant).
D3. **Saillant** (p. 50 — corrigé C7). Ligne de poitrine = horizontale à
   **hauteur de poitrine sous la ligne d'épaule devant** (le livre : depuis un
   point quelconque de la ligne d'épaule, perpendiculaire de longueur =
   hauteur de poitrine, puis horizontale). Saillant = (écart de poitrine / 2,
   y poitrine). Marqué d'une croix sur le patron (p. 50, fig. 2).
D4. **Vérifications sur mesure** (p. 51 — optionnelles v1, prévues au rapport) :
   la hauteur de profondeur d'encolure (mesurée saillant → milieu devant,
   p. 21) permet de corriger la profondeur d'encolure ; la hauteur de galbe
   d'épaule (saillant → acromion, p. 21) permet de corriger l'inclinaison de
   26°. Ces deux mesures « ne participent pas à la construction et ne
   modifient pas les étapes du tracé » (p. 21) — v1 : affichage d'un écart
   constaté, sans correction automatique.
D5. **Épaule devant + pince bretelle** (p. 41 ; p. 49-53). Épaule provisoire à
   **26° sous l'horizontale** depuis `snp-devant`, longueur = longueur
   d'épaule (− 1 cm si option pince d'épaule absorbée, cf. dos ét. 4).
   Pince bretelle :
   - `pince-bretelle-1` = **milieu de la longueur d'épaule** (p. 52) ;
     première jambe : droite `pince-bretelle-1` → saillant.
   - Valeur **v = poitrine/20 + 1** (C6), reportée sur la ligne d'épaule
     depuis `pince-bretelle-1` → `pince-bretelle-2`.
   - Seconde jambe : `pince-bretelle-2` → saillant, **longueur égalisée sur la
     première jambe** (p. 52 : « en prenant comme référence la longueur du
     premier bras »).
   - Le livre ferme la pince (couchée vers le milieu devant, p. 52) et
     retrace la seconde moitié d'épaule **en conservant l'angle initial de
     26°** (p. 52, « Rétablissement de la ligne d'épaule »). Équivalent
     moteur : rotation de la partie extérieure (seconde moitié d'épaule)
     autour du saillant, d'un angle θ = 2·asin(v / (2·|jambe 1|)) ; la seconde
     moitié d'épaule repart de `pince-bretelle-2` à 26°.
D6. **Points d'emmanchure devant** (p. 42). Point de carrure : x' =
   **carrure devant / 2**, sur la ligne de carrure (la carrure devant est
   toujours plus petite que la carrure dos — contrôle de cohérence, p. 19).
   Bissectrice : **2,5 cm** du coin (carrure devant/2, y emmanchure).
   Platitude : 1 cm de la ligne de côté. Le point de carrure appartient à la
   partie non pivotée du tracé dans le livre (la pince est fermée AVANT de
   tracer l'emmanchure — l'ordre du livre est : vérifications p. 51, pince
   p. 52, puis emmanchure p. 42-44 tracée pince fermée). **Choix v1 documenté
   (cahier §4.4) : seuls la seconde moitié d'épaule et le haut d'emmanchure
   sont portés par la rotation ; carrure, bissectrice et dessous-bras ne
   bougent pas ; la spline lisse le raccord.**
D7. **Emmanchure devant**. Spline : extrémité d'épaule (pivotée) → carrure →
   bissectrice (2,5) → platitude → `dessous-bras` = (poitrine/4 + 1 en local,
   y emmanchure).
D8. **Pinces de taille devant** (p. 54-55).
   - **Pince du devant** : axe vertical **passant par le saillant** (p. 54,
     ét. 1 : tracée depuis le saillant, valeur répartie de façon équilibrée
     des deux côtés de l'axe). Largeur ≤ **3 cm** ; extrémité basse ≤ 9 cm
     sous la taille (hors v1) ; extrémité haute : **[À VALIDER : non chiffrée ;
     les planches la montrent juste sous la croix du saillant — proposition
     v1 : y saillant + 2.]**
   - **Pince de côté devant** : tracée en premier, la pince dos en miroir
     (p. 54, ét. 2-3) ; ≤ 4 cm ; partie haute à la règle (p. 61).
D9. **Côté devant** : droite de `dessous-bras` au point de taille cintré.

## Répartition des pinces de taille (p. 54-58)

Valeur à absorber par quart de patron : **U = (poitrine − taille) / 4**
(v1, buste s'arrêtant à la taille — p. 56, « Du buste jusqu'à la taille »).
Chaque quart (demi-dos, demi-devant) absorbe U. Contrainte structurante :
**les pinces de côté dos et devant ont la même valeur c** (C8).

Plafonds (p. 55) : pince devant ≤ 3 ; côtés ≤ 4 chacune ; pince demi-dos ≤ 2 ;
milieu dos ≤ 1-2 (facultative).

Exemple normatif du livre (p. 57, fig. 3, U = 5) : demi-devant = 3 (pince) +
2 (côté) ; demi-dos = 1 (milieu dos) + 2 (pince demi-dos) + 2 (côté).

Algorithme v1, reproduisant cet exemple :

```
c  = clamp(U − 3, 0, 4)        // côté : le minimum permettant pince devant ≤ 3
dF = U − c                     // pince devant (≤ 3 par construction)
dB = min(2, U − c)             // pince demi-dos
mD = U − c − dB                // milieu dos (0..1)
si mD > 1 → avertissement « pince supplémentaire requise » (p. 58)
```

Vérification sur l'exemple : U=5 → c=2, dF=3, dB=2, mD=1 ✓.
Pinces supplémentaires (p. 58, hors v1) : ~2 cm plus courtes que les
principales ; axes aux tiers (dos, entre bras de pince de côté et bras de
pince milieu dos) ou à la moitié (devant, entre bras de pince principale et
bras de pince de côté).

**Forme des pinces** (p. 59-61) : chaque pince à la taille comporte une
**platitude de 2 à 4 cm**, répartie à parts égales au-dessus et au-dessous de
la ligne de taille, inversement proportionnelle à la valeur (valeur 3 →
platitude 2 ; valeur 1-1,5 → platitude ≥ 3 ; p. 59). Bras rectilignes des
extrémités jusqu'à la platitude, joints par une ligne légèrement courbée
passant par le repère de valeur sur la taille (p. 60). v1 (arrêt taille) :
les bras hauts sont tracés jusqu'à la platitude haute ; la platitude est
portée au patron.

## Choix documentés de la v1 (cahier §4.4)

- Mise en planche (`engine/layout.ts`) : après construction, le devant est
  écarté du dos d'un blanc calculé (≥ 5 cm entre boîtes englobantes) pour
  qu'aucun chevauchement ne soit possible — équivalent du blanc de 10-15 cm
  des planches du livre (p. 35). Les coordonnées de construction du gabarit
  (côtés coïncidents) restent celles du livre dans `pieces/buste.ts`.
- Buste arrêté à la taille ; le livre poursuit le gabarit jusqu'au bassin
  (largeurs bassin/4 ∓ 1, pinces prolongées 9/11 cm sous la taille, pince de
  côté arrondie finissant aux petites hanches, p. 61). Reporté au jalon
  dédié ; le calcul (bassin − taille)/4 est déjà exposé au rapport.
- Pince d'épaule dos absorbée (option p. 47) plutôt que tracée.
- Rotation de pince bretelle limitée à la seconde moitié d'épaule (cf. D6).
- Ligne de petites hanches : ligne d'aide, pas de construction (p. 36) — non
  tracée en v1.
- Élargissements de base (p. 66) : hors périmètre, le patron de base est sans
  aisance.
- Les longueurs d'emmanchure dos et devant sont mesurées sur les courbes
  tracées et exposées dans le rapport — donnée d'entrée de la manche (M5),
  avec le tour du corps au niveau de la carrure comme mesure de contrôle de
  la tête de manche (p. 22).

## Invariants testés (tests/invariants.test.ts)

- Contour fermé, sans auto-intersection, aire positive (chaque pièce).
- Épaules : |épaule devant hors pince| = |épaule dos| − 1 cm (option pince
  absorbée ; l'écart de 1 cm est l'embu du montage, p. 47).
- Jambes de pince bretelle égalisées : ||jambe 1| − |jambe 2|| < 0,01.
- Largeur à la taille après déduction des pinces = taille/4 ∓ 1 (dos : −1,
  devant : +1), à l'excédent signalé près.
- Pinces de côté dos et devant de même valeur ; longueurs de côté dos =
  devant (emmanchure → taille).
- Nuque SOUS la ligne d'épaule (y > 0) ; encolure dos à tangente horizontale
  à la nuque ; gorge à tangente horizontale au milieu devant.
- Emmanchures : passage à moins d'un epsilon des points imposés (carrure,
  bissectrice, platitude) ; arrivée horizontale au dessous-bras.
- Golden tests (profil 88/68/92, cou 38) : largeur encolure 7,33 ;
  profondeur dos 2,375 ; profondeur devant 9,33 ; pince bretelle 5,4 ;
  U = 5 ; répartition c=2, dF=3, dB=2, mD=1.
