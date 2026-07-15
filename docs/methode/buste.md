# Méthode — Buste de base (demi-dos + demi-devant)

> **Statut : TRANSCRIPTION v3 — CHAPITRE COMPLET RELU PAGE À PAGE.**
> Ce document fait autorité sur le code (`src/engine/pieces/buste.ts`).
> Chapitre « Le buste », *Les patrons de base sur mesure* (T. Gilewska,
> Eyrolles), pages livre **31 à 89** (PDF 29 à 87, décalage −2 vérifié constant
> sur toute la zone ; le chapitre suivant « La manche » ouvre livre 91 = PDF 88).
> Reformulation personnelle : aucune phrase du livre n'est recopiée ; le
> contenu des figures est décrit, pas reproduit.
> La v3 enrichit la v2 (validée sur les planches) : étapes dans l'ordre du
> livre, valeurs chiffrées des exemples, contenu des figures, et les sections
> jusqu'ici absentes (élargissement de base, marges, coupe, assemblage,
> essayage et corrections, patron de base fini). Les divergences relevées
> entre le livre et la v2 sont dans le tableau « Corrections v2 → v3 ».

## Corrections v1 → v2 (historique, validées sur les planches)

| # | Point | v1 (faux ou incomplet) | v2 (livre) |
|---|---|---|---|
| C1 | Ligne de taille | y = profondeur encolure + longueur dos | **y = longueur dos** : la longueur dos se reporte depuis la ligne d'épaule (p. 33, ét. 3), et se mesure sur le corps depuis le ras-du-cou *sur la ligne d'épaule* (p. 18) |
| C2 | Encolure dos | nuque au-dessus de la ligne d'épaule | **nuque SOUS la ligne d'épaule** : profondeur (cou/16) portée vers le bas ; le point d'épaule côté cou reste SUR la ligne d'épaule (p. 39-40, fig. 6) |
| C3 | Bas d'emmanchure | « ligne de poitrine » commune posée par le saillant | **ligne d'emmanchure** = mi-distance épaule dos ↔ taille (p. 34, ét. 7). La ligne de poitrine (par le saillant) est une AUTRE ligne, propre à la pince bretelle (p. 50) |
| C4 | Ligne de carrure | mi-hauteur épaule ↔ poitrine | **1/3 de la distance épaule ↔ emmanchure, reporté depuis la ligne d'emmanchure vers le haut** (p. 34, ét. 8) |
| C5 | Largeurs | côté commun à x = poitrine/4 | **dos = poitrine/4 − 1 ; devant = poitrine/4 + 1** (p. 34 ét. 6, p. 35 ét. 10) |
| C6 | Valeur pince bretelle | 3 cm [à valider] | **tour de poitrine / 20 + 1 cm** (p. 52) |
| C7 | Saillant | arc de cercle depuis le point d'encolure | **hauteur de poitrine portée perpendiculairement à la ligne d'épaule devant** (p. 50) ; puis demi-écart depuis le milieu devant |
| C8 | Pinces de côté | ≤ 2 cm par pièce | **valeur identique dos/devant, ≤ 4 cm chacune** (p. 54-55, 62) |
| C9 | Pince d'épaule dos | absente de la v1 | pince principale de la méthode (p. 45-48) ; option « valeur absorbée » (p. 47) retenue en v1/v2 — voir C12 |
| C10 | Bissectrices | à valider dos/devant | **1,5 cm dos, 2,5 cm devant** (p. 42, ét. 2) + **platitude de 1 cm** côté (ét. 3) |

## Corrections et précisions v2 → v3 (lecture intégrale du chapitre)

| # | Point | v2 | v3 (livre, page) |
|---|---|---|---|
| C11 | Ordre de tracé de l'emmanchure devant | « la pince bretelle est fermée AVANT de tracer l'emmanchure » | Faux comme récit : l'emmanchure est tracée dès p. 42-44 (épaules encore rectilignes), puis **retracée deux fois** — après la pince d'épaule dos (p. 48, de l'épaule à la carrure) et après la pince bretelle (p. 53, « rétablissement des mesures » : les valeurs avalées par la fermeture sont re-mesurées sur les lignes de carrure et d'emmanchure et reportées depuis la courbe, nouvelle courbe par les points 1-2-3). **Le résultat net valide le choix v1/v2** : carrure, bissectrice et dessous-bras retrouvent leurs positions d'origine, seuls la seconde moitié d'épaule et le haut de courbe bougent |
| C12 | Pince d'épaule dos | option absorbée par défaut | p. 48 « À noter » : la construction du patron de base doit **impérativement** comporter cette pince pour que le tracé d'emmanchure soit correct. L'absorption dans l'épaule (p. 47, fig. 4) reste une option montrée par le livre (pas de découpe emmanchure/milieu dos), l'écart y est chiffré **1 cm, dos plus long que devant**, résorbé au montage (bords en faux biais) — résout l'[À VALIDER] v2 sur le sens de l'écart. Cible v3+ : tracer la vraie pince (voir §9) |
| C13 | Construction de la pince d'épaule dos | non chiffrée | axe **au milieu de la largeur d'épaule**, perpendiculaire à la ligne d'épaule inclinée, **longueur 7 cm** ; largeur standard **1 cm** (dos arrondi : jusqu'à 2 cm de large et 5 cm de long) ; après fermeture : **rallonger l'extrémité d'épaule de la valeur de la pince** puis retracer l'emmanchure jusqu'à la carrure, et retracer l'épaule à la règle **à 18°** pince fermée (p. 46-48). NB : le livre écrit « 1 cm de part et d'autre de l'axe » puis parle d'une « valeur de 1 cm » — lecture retenue : **largeur totale 1 cm** (cohérent avec « environ 1 à 2 cm » p. 46 et « augmentée à 2 cm » p. 48) **[AMBIGUÏTÉ notée]** |
| C14 | Direction du report de la valeur bretelle | non précisée | depuis le milieu d'épaule **vers l'emmanchure** (fig. 5-6 p. 52 : 1er bras au milieu, 2e bras côté emmanchure) ; fermeture pliée sur le 1er bras, valeur couchée **vers le milieu devant** |
| C15 | Retrait de pointe des pinces au saillant | pince de taille arrêtée 4 cm sous le saillant (source tierce) | livre : **platitude de poitrine ≈ 2 cm à l'extrémité de CHAQUE pince** (bretelle et taille) pour éviter le bec au saillant, valeur exacte fonction du volume de poitrine, ajustée à l'essayage (p. 75) ; les planches p. 55 montrent le haut de pince juste sous la croix. Les 4 cm v2 sont à reconsidérer (l'essayage tranche) |
| C16 | Platitudes de l'encolure devant | « suit la verticale sur 2-3 cm » | quantifié p. 64 : **≈ 1/3 de la largeur** d'encolure (platitude horizontale à la gorge) et **≈ 1/3 de la profondeur** (platitude verticale sous l'épaule). Le « 2-3 cm » de p. 63 en est le cas particulier (cou 38 : 9,5/3 ≈ 3,2 ; 7,5/3 = 2,5) |
| C17 | Longueurs d'emmanchure | mesurées, exposées, sans contrôle | contrôle du livre : **différence normale de 1 à 2 cm** entre dos et devant (le plus long des deux dépend de la morphologie). Hors plage → erreur d'inclinaison d'épaule ou de répartition du tour de poitrine dos/devant ; manche difficile voire impossible à monter (p. 65) |
| C18 | Élargissement de base / marges | résumés | procédure chiffrée p. 66-68 : épaule +1 cm (parallèle), ligne d'emmanchure **abaissée de 2 cm**, côtés +1 cm dos ET devant, courbe d'emmanchure **décalquée puis décalée** depuis la carrure ; marges 1 cm (côté de la toile : 2-3 cm) ; dos d'essayage **toujours coupé au pli** ; croisure à 2-3 cm du milieu devant. Voir §15-17 |
| C19 | Pince milieu dos | facultative, dernier recours | confirmé pour le patron (découpe milieu dos ; rarissime au pli, p. 55) **mais indispensable sur la toile d'essayage** (élargissements minimaux), valeur standard 1 cm à adapter (p. 81) — cohérent avec mD = 1 de l'exemple normatif |
| C20 | Haut de la pince de demi-dos | y emmanchure + 2 [À VALIDER] | toujours pas chiffré par le texte ; les planches p. 55 (fig. 2) font monter le haut de pince **jusque vers la ligne d'emmanchure**. [À VALIDER] maintenu, borne haute = ligne d'emmanchure |

---

## Conventions

- Unité : centimètre. Axe **y vers le bas** (convention SVG).
- Planche en miroir comme dans le livre : **milieu dos à gauche (x = 0)**,
  **milieu devant à droite (x = tour de poitrine / 2)**. Avec les largeurs
  ∓ 1 cm (C5), les lignes de côté dos et devant coïncident à
  **x = poitrine/4 − 1** (le rendu écran peut écarter les pièces ; le livre
  trace le devant à 10-15 cm du dos, p. 35, ét. 9).
- `y = 0` : **ligne d'épaule dos** (horizontale de référence du gabarit, p. 33
  ét. 2). Le point d'encolure côté cou du dos est SUR cette ligne ; la nuque
  est en dessous (C2).
- **Couleurs du livre** : lignes de référence en rouge (milieu dos, milieu
  devant, taille), lignes de construction en noir (p. 33-35) — cohérent avec
  le code couleur des Généralités (`generalites.md` §3).
- Le patron de base du livre est tracé **sans aisance ni valeurs de couture**
  (p. 18 ; confirmé p. 86 : le patron de base fini ne comporte ni
  élargissements ni marges, qui fausseraient les transformations). Une
  **aisance globale optionnelle** (0–5 cm au tour, défaut produit 2) peut
  néanmoins élargir le gabarit — voir §Extensions hors livre ; réglée à 0, le
  tracé est exactement celui du livre.
- **Arrondis : pour l'affichage uniquement.** Le livre arrondit ses exemples
  au dixième supérieur (7,33 → 7,5) mais recommande de construire avec les
  valeurs exactes (p. 40). Le moteur calcule exact, le panneau de valeurs
  arrondit.
- **Ordre du livre** (structurant, p. 31-89) : cadre dos → cadre devant →
  vérification des mesures → encolure (gabarit droit) → épaules 18°/26° →
  emmanchures au perroquet → pinces (épaule dos, bretelle, taille) avec
  retraçages successifs de l'épaule et de l'emmanchure → forme des pinces →
  forme de l'encolure (courbe) → vérification de l'emmanchure → élargissement
  de base → marges → coupe → assemblage → essayage/corrections → report sur le
  papier → patron de base fini. Le tracé commence **toujours par le dos** :
  peu affecté par les volumes (contrairement au devant, dont la longueur
  intègre la poitrine), il fixe de façon fiable les lignes d'emmanchure et de
  carrure (p. 32).

## Valeurs dérivées (exemples du livre)

| Valeur | Formule / règle | Exemple | Réf. |
|---|---|---|---|
| Largeur d'encolure | cou / 6 + 1 | 38 → 7,33 (aff. 7,5) | p. 39 |
| Profondeur d'encolure dos | cou / 16 (2 à 3 cm pour tailles 38 à 46-48) | 38 → 2,38 (aff. 2,5) | p. 40 |
| Profondeur d'encolure devant | largeur d'encolure + 2 | 7,5 → 9,5 | p. 40 |
| Platitudes encolure devant | ≈ largeur/3 (gorge) et profondeur/3 (verticale) | 2,5 et ≈ 3,2 | p. 64 |
| Angles d'épaule | dos 18°, devant 26° sous l'horizontale | — | p. 41 |
| Pince d'épaule dos | largeur ≈ 1 cm (≤ 2), longueur 7 cm (5 si dos arrondi) | — | p. 46, 48 |
| Valeur pince bretelle | poitrine / 20 + 1 | 88 → 5,4 | p. 52 |
| Bissectrices d'emmanchure | 1,5 cm dos ; 2,5 cm devant | — | p. 42 |
| Platitude d'emmanchure | repère à 1 cm de la ligne de côté | — | p. 42 |
| À absorber à la taille (haut, par quart) | (poitrine − taille) / 4 | 88/68 → 5 | p. 56-57 |
| À absorber à la taille (bas, par quart) | (bassin − taille) / 4 | 92/68 → 6 | p. 56-57 |
| Plafonds des pinces de taille | devant 3 ; côtés 4 chacune ; demi-dos 2 ; milieu dos 1-2 | — | p. 55 |
| Longueur sous la taille | devant ≤ 9 cm ; demi-dos ≤ 11 cm ; côté finit aux petites hanches | — | p. 55 |
| Platitude de pince à la taille | 2 à 4 cm, à parts égales de part et d'autre de la taille, inversement proportionnelle à la valeur | valeur 3 → 2 ; valeur 1-1,5 → ≥ 3 | p. 59 |
| Platitude de poitrine | ≈ 2 cm à l'extrémité de chaque pince au saillant | — | p. 75 |
| Différence de longueur d'emmanchure dos/devant | 1 à 2 cm (sens selon morphologie) | — | p. 65 |
| Élargissement de base | épaule +1 ; emmanchure −2 (abaissée) ; côtés +1 | — | p. 66 |
| Marges de couture | 1 cm ; côté de la toile 2-3 cm | — | p. 67 |
| Croisure (patron d'essayage) | 2 à 3 cm du milieu devant | — | p. 68 |

Le calcul « bas » sert aux vêtements descendant au bassin ; le buste v1
s'arrête à la taille et applique le calcul « haut ». Règle d'application
(p. 57, « À retenir ») : différence poitrine/taille → valeurs posées **à
partir de la ligne de côté en partie haute** ; différence bassin/taille → à
partir de la ligne de côté **en partie basse**. Dans les deux cas, un quart de
la valeur totale par demi-panneau, et le patron final est le même.

## Lignes horizontales du gabarit (communes dos/devant)

Le gabarit dos établit toutes les horizontales ; le devant les recopie en
miroir **sauf la ligne d'épaule**, qui lui est propre (p. 35, fig. 3).

| Ligne | Position | Réf. |
|---|---|---|
| Ligne d'épaule dos | y = 0 (référence ; sur la feuille : à 7-10 cm du haut) | p. 33 ét. 2 |
| Ligne de taille | y = longueur dos (**ligne de référence, rouge**) | p. 33 ét. 3 |
| Ligne de bassin | y = taille + hauteur bassin (hors v1, documenté pour M4+) | p. 33 ét. 4 |
| Ligne d'emmanchure | y = longueur dos / 2 (mi-distance épaule ↔ taille) | p. 34 ét. 7 |
| Ligne de carrure | y = longueur dos / 3 (tiers de la distance épaule ↔ emmanchure, reporté depuis l'emmanchure vers le haut) | p. 34 ét. 8 |
| Ligne d'épaule devant | y = taille − longueur devant (propre au devant) | p. 35 ét. 10 |
| Ligne de poitrine | y = ligne d'épaule devant + hauteur de poitrine (ligne d'aide, effacée après pose du saillant) | p. 50 |
| Ligne de petites hanches | mi-distance taille ↔ bassin ; **ligne d'aide**, jamais de construction | p. 36, 38 |

Note carrure : distance épaule ↔ emmanchure = longueur dos/2 ; le tiers =
longueur dos/6 ; donc y_carrure = longueur dos/2 − longueur dos/6 =
**longueur dos/3**. Exemple longueur dos 40 : emmanchure y = 20, carrure
y = 13,33.

Détail matériel du livre (p. 33, ét. 1) : le milieu dos se trace à ~5 cm du
bord de feuille, longueur 60-70 cm ≈ longueur dos + hauteur bassin ; l'encart
p. 33 rappelle que la ligne de côté dépend de **deux** mesures : tour de
poitrine (épaule → taille) et tour de bassin (taille → bassin).

## 1. Cadre du gabarit dos (p. 33-34, ét. 1-8)

Milieu dos vertical en x = 0 (**référence, rouge**). Horizontales du tableau
ci-dessus. Largeur haut : **poitrine/4 − 1**, appliquée **sur la ligne
d'épaule** depuis le milieu dos ; perpendiculaire jusqu'à la taille = **ligne
de côté** (ét. 6). Largeur bas (hors v1) : **bassin/4 − 1**, appliquée **sur
la ligne de bassin** depuis le milieu dos, perpendiculaire remontant à la
taille (ét. 5).

Fig. 1 p. 33 : la silhouette de dos et la feuille, les huit étapes numérotées
(① milieu dos, ② épaule, ③ taille, ④ bassin, ⑤ côté bas, ⑥ côté haut,
⑦ emmanchure, ⑧ carrure). Fig. 2 p. 34 : le cadre coté par deux accolades —
« épaule ↔ emmanchure ÷ 3 » et « épaule ↔ taille ÷ 2 ».

## 2. Cadre du gabarit devant (p. 35, ét. 9-11)

Construction **miroir** : recopier sur le devant toutes les horizontales du
dos (bassin, emmanchure, carrure en noir, taille en rouge), **pas** la ligne
d'épaule (ét. 9 : le devant se place à 10-15 cm du dos, parallèle à sa ligne
de côté). Largeur : **poitrine/4 + 1** → verticale parallèle = **milieu
devant** (référence, rouge). Sur le milieu devant, **depuis la taille**,
reporter la **longueur du devant vers le haut** ; au point obtenu, horizontale
jusqu'à la ligne de côté = **ligne d'épaule devant** (ét. 10). Largeur bas
(hors v1) : **bassin/4 + 1** reporté **sur la ligne de taille** depuis le
milieu devant, perpendiculaire descendant au bassin (ét. 11).

### Petites hanches et silhouettes rondes (p. 36-37)

La ligne de petites hanches est controversée chez les professionnels — non
pour son placement mais pour l'usage de son tour comme mesure de
construction : pris au niveau des petites hanches, le tour intègre le ventre
mais pas les fesses (fig. 1 : profil), il ne peut donc pas établir les
largeurs dos/devant. Dans cette méthode elle reste une **ligne d'aide**
(placer poches, empiècements, découpes — fig. 2 : deux jupes cotées taille /
petites hanches / bassin). Pour les **silhouettes rondes** (ventre et/ou
fesses développés) : compléter par des **mesures partielles depuis la ligne de
côté** — ventre au niveau des petites hanches (ligne verte fig. 3), fesses au
niveau du bassin (ligne bleue fig. 3). Renvoi du livre : vol. 6 « Coupe à
plat — Grandes tailles » pour ces morphologies.

### Vérification des mesures (p. 38)

Avant encolure et emmanchure : **vérifier le report des mesures et le
placement de toutes les lignes**. C'est l'étape la plus importante — une
erreur ici ruine tout ce qui suit. Fig. 4 : les deux cadres finis, milieux et
taille en rouge, petites hanches en pointillé à mi-distance taille-bassin.

## 3. Encolure — gabarit rectangulaire (p. 39-40)

Référence : le **tour de cou** (pris au ras-du-cou, p. 22). Tracé en deux
parties — dos puis devant (calculé à partir du dos) — parce que les
inclinaisons d'épaule dos/devant diffèrent ; la correspondance des deux
courbes est vérifiée plus tard, platitudes respectées (p. 39). Fig. 5 :
l'encolure complète posée dans un carré, moitié dos (verte, peu profonde) et
moitié devant (bleue, profonde) séparées par la ligne d'épaule et la verticale
« milieux dos et devant ».

- **Encolure dos** (fig. 6) : largeur = **cou/6 + 1** reportée sur la ligne
  d'épaule depuis le milieu dos ; au point obtenu, courte verticale (vers le
  bas) recevant la profondeur = **cou/16**. Le rectangle 7,5 × 2,5 de
  l'exemple pend **sous** la ligne d'épaule (C2). Pour les tailles 38 à 46-48
  la profondeur tombe entre 2 et 3 cm, mais le livre insiste : calculer la
  valeur exacte plutôt qu'utiliser la fourchette (p. 40).
- **Encolure devant** (fig. 7) : sur la ligne d'épaule **devant**, depuis le
  milieu devant, reporter la **même largeur** que le dos ; perpendiculaire à
  la ligne d'épaule ; profondeur = **largeur + 2** (ex. 9,5) sur cette
  verticale ; du point obtenu, perpendiculaire rejoignant le milieu devant.
- « À noter » p. 40 : à ce stade l'encolure n'est qu'un **gabarit en lignes
  droites** ; la courbe se trace à la vérification du patron (p. 63-64, §12).

## 4. Inclinaison et largeur d'épaule (p. 41)

- **Épaule dos — méthode A (largeur d'épaule)** : depuis l'extrémité de la
  largeur d'encolure sur la ligne d'épaule, droite à **18° sous
  l'horizontale** ; y reporter la **largeur d'épaule** ; fixer l'extrémité par
  une petite verticale (fig. 1).
- **Méthode B (largeur dos)** : reporter la **largeur dos** depuis le milieu
  dos, la fixer par une verticale ; joindre l'extrémité d'encolure à 18°
  jusqu'à cette verticale (fig. 2, intersection cerclée). Mesures justes ⇒
  les deux méthodes coïncident (et l'angle reste 18°) ; sinon, refaire les
  mesures. (Le choix épaule vs dos selon morphologie est en p. 19 :
  `generalites.md` §6.1.)
- **Épaule devant** (fig. 3) : depuis l'extrémité de la largeur d'encolure
  devant, droite à **26°** ; y reporter la **largeur d'épaule du dos** ;
  fixer par une verticale. (À ce stade les deux épaules ont la même longueur ;
  les pinces changeront cela.)
- Si la pente d'épaule est mesurée, l'angle est déduit de la mesure — voir
  §Extensions hors livre.

## 5. Emmanchure dos et devant — points imposés (p. 42)

**Ordre impératif.** La forme n'est établie que si les **4 points de chaque
côté** sont posés (fig. 1 : points bleus sur les deux gabarits) : extrémité
d'épaule, carrure, bissectrice, platitude.

1. Sur la ligne de carrure, depuis le milieu : **carrure dos / 2** (dos) et
   **carrure devant / 2** (devant) ; perpendiculaire en pointillé jusqu'à la
   ligne d'emmanchure. La carrure devant est toujours plus petite que la
   carrure dos (contrôle de saisie, p. 20).
2. Sur la **bissectrice** du coin (carrure/2, y emmanchure) : point à
   **1,5 cm** du coin au dos, **2,5 cm** au devant.
3. **Platitudes** : marque sur la ligne d'emmanchure à **1 cm de la ligne de
   côté** (dos et devant) — « extrêmement important » ; corrigeables à
   l'essayage.

« À noter » p. 42 : les valeurs de bissectrice sont des **repères** — le
tracé de la courbe peut les modifier (elles dépendent de la morphologie :
carrures, tour de poitrine). Les points d'épaule, de carrure et de platitude,
eux, sont **intouchables** (p. 43).

## 6. Emmanchure — tracé au perroquet (p. 43-44)

Courbe **continue, sans rupture**, joignant les 8 points. Tracé **en deux
temps** :

1. **Épaule → carrure** (fig. 2 : pistolets posés bord long contre le segment,
   sur les deux gabarits) : part de l'extrémité d'épaule, quasi rectiligne,
   prend une forme **légèrement arrondie** à l'approche de la carrure.
2. **Carrure → emmanchure** (fig. 3 : pistolets retournés épousant le virage) :
   repositionner le perroquet là où sa courbure correspond ; passage
   **impératif** par le repère de carrure, la platitude et la ligne
   d'emmanchure ; pour respecter la platitude, la valeur de bissectrice peut
   changer (renvoi à l'encadré p. 42).

Fig. 4 : résultat — deux courbes complètes arrivant à plat sur la ligne
d'emmanchure au point de côté.

**Allure du bas de courbe (planches p. 42-44 + coup de perroquet, validé
livre en main 2026-07-07)** : la courbe **coupe la bissectrice à angle
droit** — au point de bissectrice, la tangente est à 45° de l'horizontale, en
descente vers le côté — puis rejoint le point de côté en **un seul balayage à
courbure continue** : aucune rupture entre la bissectrice et le coin du côté.
La **platitude de 1 cm est un repère de queue de perroquet** : la courbe y
devient quasi horizontale et vient lécher la ligne d'emmanchure (écart
≲ 1 mm), l'arrivée au point de côté étant exactement horizontale. Le moteur
trace : spline épaule → carrure → bissectrice (tangente 45° imposée), puis
**une seule cubique** bissectrice → dessous-bras, raccordée C1. (Historique :
la v2 à tangentes déduites des voisins plongeait sous la ligne — angle
écrasé ; l'assemblage arc + segment droit créait des sauts de courbure.)

## 7. Pinces de base — vue d'ensemble (p. 45)

Rôle : absorber les surplus de volume créés par la **poitrine**, la **taille**
et les **omoplates** pour passer du corps au gabarit à plat. Tout patron de
base comporte les **pinces principales** : **épaule dos**, **bretelle
devant**, **taille** ; à la transformation elles peuvent être déplacées ou
ignorées (vêtements droits/amples). Fig. 5 : silhouettes trois-quarts face et
dos — bretelle en rouge (mi-épaule → saillant), épaule dos en rouge (courte),
pinces de taille en noir (verticales), emmanchure en bleu. Encadré : valeurs,
placement, hauteur et longueur des pinces conditionnent le tombant et le
confort — suivre l'ordre méthodiquement.

## 8. Pince d'épaule dos (p. 46-48)

**Pourquoi elle est obligatoire** (p. 46) : valeur minime (≈ 1 à 2 cm),
souvent ignorée, mais conséquences disproportionnées — sans manche, surplus
d'emmanchure et plis que ni enforme ni biais ne rattrapent (fig. 1B) ; avec
manche, le surplus glisse au bas d'emmanchure et, sous le poids de la manche,
déforme le tombant du dos voire la tête de manche (fig. 1C). L'encart p. 48
insiste : le patron de base doit **impérativement** la comporter pour que le
tracé d'emmanchure soit correct (C12).

**Placements alternatifs** (p. 46-47) : telle quelle (fig. 1A) elle n'est pas
très esthétique ; on la déplace souvent —

- **dans l'emmanchure** (découpe princesse, fig. 2) : en général au niveau de
  la ligne de carrure (esthétique ; plus haut/bas ne change pas la
  construction) ; accorder les longueurs des bras, fermer, retracer la courbe ;
- **dans la découpe milieu dos** (vestes tailleur, fig. 3) : basculer tout le
  bloc concerné (encolure + épaule + emmanchure) pour conserver les dimensions ;
- **valeur absorbée dans l'épaule** (fig. 4) : sans découpe disponible, très
  courant ; deux largeurs d'épaule différentes, écart montré de **1 cm (dos
  plus long)**, résorbé au montage — bords coupés en faux biais qui se
  détendent. C'est l'option v1/v2 du moteur.

**Construction** (p. 48, fig. 1-3) : au **milieu de la largeur d'épaule**,
perpendiculaire (axe) de **7 cm** ; largeur standard **1 cm** répartie autour
de l'axe (voir C13 pour l'ambiguïté du texte) ; bras tirés des repères à la
pointe de l'axe. Valeurs indicatives, morphologie-dépendantes (dos arrondi :
2 cm de large, 5 cm de long) et ajustées à l'essayage (renvoi fig. 3 p. 84).
La fermeture avalant de la longueur d'épaule : **rallonger l'extrémité
d'épaule de la valeur de la pince** puis **retracer l'emmanchure jusqu'à la
ligne de carrure** (fig. 1 : rallonge en bleu, nouvelle courbe en vert).
**Ajustement de la ligne d'épaule** (fig. 2-3) : toute fermeture déforme la
ligne d'épaule — fermer (point A sur point B), retracer à la règle **à 18°**,
couper le papier pince fermée le long de la nouvelle ligne.

## 9. Pince bretelle (p. 49-53)

**Rôles** (p. 49-50) : (1) ajuster l'emmanchure pour qu'elle **ne bâille
pas** — indispensable pour les vêtements ajustés ; (2) donner le volume
nécessaire pour envelopper la poitrine. Construite **sur la ligne
d'inclinaison d'épaule**, placement qui permet de calculer sa valeur de base ;
elle peut ensuite être déplacée n'importe où autour de la poitrine (fig. 1
p. 49 : éventail rayonnant du saillant — encolure, emmanchure, côté, taille,
poitrine ; pivotements au chapitre Transformation, p. 172+). Sur mesures
standards la valeur de base est « +1 cm » ; sur mesure elle s'ajuste **à
l'essayage selon le volume de poitrine** (renvoi p. 83).

**Saillant de poitrine** (p. 50, fig. 1-2 — C7) : d'un point quelconque de la
ligne d'épaule devant, perpendiculaire de longueur = **hauteur de poitrine** ;
horizontale jusqu'au milieu devant = **ligne de poitrine** (pointillé) ; sur
elle, **demi-écart de poitrine** depuis le milieu devant ; l'intersection est
le saillant (cercle rouge). Effacer les lignes d'aide, garder une **petite
croix**.

**Vérifications préalables — impératives** (p. 50-51) : la pince bretelle va
modifier épaule et emmanchure ; après, plus aucune vérification possible.
Avec les deux mesures supplémentaires (p. 21) :

- **profondeur d'encolure** : reporter la hauteur de profondeur d'encolure
  relevée (saillant → milieu devant) sur le tracé (fig. 3 : règle en diagonale
  de la croix au milieu devant) ; monter ou descendre la profondeur au besoin ;
- **inclinaison d'épaule** : angle trop petit → l'emmanchure bâille ; trop
  grand → le devant bascule vers le côté. 26° = valeur standard ; reporter la
  **hauteur de galbe d'épaule** (saillant → acromion, fig. 4 : éventail de
  droites autour de l'épaule) et corriger l'angle au besoin.
- « Bon à savoir » : effacer ensuite les lignes périmées (lisibilité).

**Valeur et tracé** (p. 52, fig. 5) : point au **milieu de la longueur
d'épaule** ; 1er bras (vert) de ce point au saillant ; valeur
**v = poitrine/20 + 1** (C6) reportée sur la ligne d'épaule depuis le milieu
**vers l'emmanchure** (C14) ; 2e bras (bleu) de l'autre extrémité au
saillant ; **égaliser les longueurs des bras sur le 1er bras**.

**Fermeture** (fig. 6) : plier le papier sur le 1er bras, superposer les bras
(A sur B), valeur couchée **vers le milieu devant**.

**Rétablissement de la ligne d'épaule** (fig. 7) : pince maintenue fermée
(épingle/scotch), retracer à la règle la **seconde moitié de la longueur
d'épaule** en respectant **l'angle initial de 26°**.

**Rétablissement des mesures** (p. 53, fig. 8-9 — C11) : déplier ; mesurer les
valeurs que le triangle de pince intercepte **sur les lignes de carrure et
d'emmanchure** ; pince fermée, carrure devant et largeur du haut du buste se
réduisent d'autant → reporter ces valeurs sur les deux lignes **à partir de
la courbe d'emmanchure** (flèches bleues) et retracer la nouvelle courbe par
les points **1 (extrémité d'épaule) - 2 (carrure) - 3 (emmanchure)** en
respectant la platitude. Après fermeture, les largeurs retrouvent leurs
mesures de départ. Le petit triangle qui dépasse au-dessus de l'épaule pince
fermée est le **chapeau de pince** (fig. 9) — il sert au montage (p. 74).

Équivalent moteur (choix v1/v2, validé par ce rétablissement) : rotation de la
seconde moitié d'épaule autour du saillant d'un angle
θ = 2·asin(v / (2·|jambe 1|)) ; carrure, bissectrice et dessous-bras ne
bougent pas ; la spline lisse le raccord ; la seconde moitié d'épaule repart
de `pince-bretelle-2` à 26°.

**Cas sans pince** (p. 53) : vêtements décontractés, larges ou extensibles →
utiliser le **tracé de base sans pince** (fig. 9, noir ; exemples p. 87-89,
§19).

## 10. Pinces de taille (p. 54-58)

**Règle** : s'en tenir aux pinces principales — y déroger déstabilise le
tombant (p. 54). Ordre de placement : ① **pince du devant**, ②③ **pinces de
côté** (une seule couture après assemblage), ④ **milieu dos** (facultative —
appliquée si découpe milieu dos, rarissime si dos au pli), ⑤ **milieu de
demi-dos**. Sur le devant les pinces suivent les formes (la poitrine) ; sur le
dos, des espacements réguliers donnent le résultat le plus esthétique.

- ① **Devant** : axe = **verticale passant par le saillant** (croix) ; valeur
  répartie équilibrée des deux côtés de l'axe. Dépend de la hauteur et de
  l'écart de poitrine.
- ②③ **Côtés** : tracés et valeurs **identiques** dos/devant (C8) — tracer le
  côté devant, puis le côté dos **en miroir** (parfois asymétriques selon
  morphologie/modèle).
- ⑤ **Demi-dos** : placer d'abord la pince de côté, puis la milieu dos (si
  elle existe), et **diviser l'espace entre les deux en deux parties égales** →
  axe ; valeur répartie des deux côtés (p. 55).

**Plafonds et longueurs** (p. 55, fig. 2 ; « À noter ») : devant ≤ **3 cm**,
longueur ≤ **9 cm sous la taille**, haut juste sous la croix du saillant ;
côtés ≤ **4 cm** chacune, forme légèrement arrondie finissant **aux petites
hanches** ; milieu dos ≤ **1-2 cm**, entre ligne d'emmanchure et petites
hanches (cintrage du bord) ; demi-dos ≤ **2 cm**, longueur ≤ **11 cm sous la
taille** (haut : voir C20). Trop petit → taille non soulignée ; trop grand →
déformations au-dessus/au-dessous de la taille et, sur un vêtement ouvert,
demi-devants qui ne tombent plus ensemble.

**Calcul** (p. 56-57) : voir §Valeurs dérivées. Exemples normatifs 88/68/92 :

- partie haute (fig. 3, U = 5) : demi-dos = **1 (milieu dos) + 2 (demi-dos) +
  2 (côté)** ; demi-devant = **2 (côté) + 3 (devant)** ;
- partie basse (fig. 4, 6 cm) : demi-dos = 1 + 2 + **3 (côté)** ; demi-devant =
  **3 (côté) + 3 (devant)**.

**Pinces supplémentaires** (p. 58, fig. 5 — hors v1) : nécessaires si la
valeur à absorber est élevée ; **~2 cm plus courtes** que les principales.
Axes : dos — diviser la distance entre bras de la pince de côté et bras de la
pince de milieu dos **par 3** (axes aux tiers, repères bleus) ; devant —
diviser la distance entre bras de la pince principale et bras de la pince de
côté **par 2**. Valeurs réparties équilibrées.

Algorithme v1 (reproduit l'exemple normatif ; inchangé) :

```
c  = clamp(U − 3, 0, 4)        // côté : le minimum permettant pince devant ≤ 3
dF = U − c                     // pince devant (≤ 3 par construction)
dB = min(2, U − c)             // pince demi-dos
mD = U − c − dB                // milieu dos (0..1)
si mD > 1 → avertissement « pince supplémentaire requise » (p. 58)
```

Vérification sur l'exemple : U=5 → c=2, dF=3, dB=2, mD=1 ✓.

## 11. Forme des pinces de taille et platitudes (p. 59-62)

**Platitude de pince** (p. 59) : le vêtement suit le corps → chaque pince à la
taille comporte un petit segment plan de **2 à 4 cm**, réparti **à parts
égales** au-dessus et au-dessous de la ligne de taille, **inversement
proportionnel** à la valeur (3 cm → platitude 2 ; 1-1,5 cm → ≥ 3). Raison
technique (fig. 1A/1B) : la couture s'arrondit d'elle-même à la taille — on ne
pique pas droit jusqu'à la taille pour repartir en ligne brisée. Sur le tissu,
la platitude se fait à la couture sans repère ; **sur le patron, elle se
trace**. Ordre de tracé (fig. 2) : ① axe sur la taille, ② extrémités
(hauteur), ③ valeur sur la taille, ④ largeur de platitude.

**Tracé des bras** (p. 60, fig. 3-4) : règle alignée sur extrémité + repère de
valeur → droite arrêtée **à la ligne de platitude** ; répéter 4 fois (deux
côtés, haut et bas). Les bras sont joints par une ligne **légèrement courbée**
passant par le repère de valeur sur la taille (pistolet). Pour une forme
identique des deux côtés de l'axe (et dos/devant) : marquer la platitude sur
le bord du pistolet, le retourner en miroir et faire coïncider les marques
(fig. 4A/4B et « À retenir » p. 62).

**Pince de côté** (p. 61-62, fig. 5-9) : même principe — valeur sur la taille,
platitude également répartie. **Partie haute à la règle** : de l'extrémité
d'emmanchure sur la ligne de côté à la ligne de platitude, alignée sur le
repère de valeur (fig. 6). **Partie basse** (taille → bassin, hors v1) :
courbe **aplatie** (différente de la jupe) pour éviter un bec au montage ;
presque droite à la taille, elle rejoint la ligne de côté **sous la ligne des
petites hanches** par une légère courbe (fig. 7-8). Fig. 9 « Incorrect »
(barrée) : pistolet posé pour creuser un S revenant à la ligne de côté trop
haut, au niveau des petites hanches.

## 12. Forme de l'encolure (p. 63-64)

Tracer les courbes dos et devant séparément donne un mauvais raccord.
Méthode : **décalquer les parties hautes** dos et devant (inclinaison d'épaule
retracée), les découper avec une **grande marge de papier** côté encolure
(fig. 10, marge en marron), puis les poser **lignes d'épaule coïncidant
jusqu'aux pinces** (fig. 11) et tracer l'encolure d'un seul geste, **continue
sur l'ensemble dos + devant** (fig. 13 : on coupe ensuite la marge aux
ciseaux le long de la courbe).

- **Dos** : la courbe englobe une **platitude assez large à partir du milieu
  dos** ; on ne fait (presque) jamais de platitude sur la profondeur côté
  épaule ; ne pas trop échancrer (perroquet bien positionné).
- **Devant** : ne pas trop échancrer non plus — à l'essayage, découper un
  surplus est facile, rajouter du manque ne l'est pas. Platitudes ≈ **1/3 de
  la largeur** (à la gorge) et **1/3 de la profondeur** (le long de la
  verticale d'encolure) (C16).
- Position du perroquet (fig. 11-12) : le bord courbé **touche la pointe
  d'épaule** (point d'encolure, jonction des deux pièces) ①, passe vers le
  **milieu de la largeur d'encolure dos** ②, et sur le devant **suit la
  verticale d'encolure sur 2-3 cm** ③. Le placement exact dépend des mesures
  et de la morphologie.

Transcription moteur : platitude horizontale à la nuque (tangente horizontale)
et à la gorge ; encolure devant qui suit la verticale sous `snp-devant` sur
~profondeur/3 ; la continuité de la courbe à travers la ligne d'épaule
(pièces assemblées) reste le critère de l'angle d'arrivée — la convention v1
« arrivée ≈ perpendiculaire à l'épaule » l'assure par symétrie
**[À VALIDER à l'essayage]**.

## 13. Vérification de l'emmanchure (p. 64-65)

**Forme** : fermer la pince bretelle **et** la pince d'épaule dos, ajuster les
deux lignes d'épaule, poser les pièces épaule contre épaule (fig. 14) :
l'emmanchure doit dessiner une ligne légèrement courbée **continue**, sans
**bec** (cercle rouge fig. 15) ni **creux**. Sinon, retracer au perroquet
(fig. 16) en respectant les **largeurs de carrure** dos et devant.

**Longueur** : vérifier séparément les longueurs des emmanchures dos et
devant. Bien construite : **différence de 1 à 2 cm** entre les deux — dos plus
long que devant **ou l'inverse**, selon la morphologie (C17). Hors plage :
vérifier la construction (à plat ou à l'essayage). Une erreur ici rend le
montage de la tête de manche difficile ou impossible ; causes fréquentes —
inclinaison d'épaule ou mauvaise distribution du tour de poitrine dos/devant.
Fig. 17 : la courbe devant surlignée (mesure au ruban le long de la courbe).

## 14. Élargissement de base (p. 66)

Les mesures du corps donnent le gabarit **exact** : pour pouvoir enfiler la
toile et corriger, on ajoute un élargissement **en hauteur et en largeur** —
il couvre l'épaisseur du tissu et l'encombrement des marges. En général,
ajouté **seulement au patron d'essayage** (les élargissements « vêtement »,
eux, varient selon style, modèle, tissu, confort, goûts).

Procédure (fig. 1-2) :

1. parallèle à la ligne d'épaule à **+1 cm** (bleu) ;
2. **abaisser la ligne d'emmanchure de 2 cm** (parallèle, bleu) ;
3. sur la ligne abaissée, **+1 cm** depuis la ligne de côté, dos **et**
   devant ; par ces points, parallèles aux lignes de côté (vert).

Retracer la courbe d'emmanchure **à partir de la ligne de carrure** pour
rejoindre le nouveau dessous-bras ; pour ne pas déformer la courbe, la
**décalquer puis la décaler** en l'ajustant au point de carrure. (Hors v1 —
voir §Extensions hors livre pour l'aisance uniforme du moteur, qui reste une
approche différente : le livre élargit le tracé fini, l'option moteur élargit
les tours en amont.)

## 15. Marges de couture (p. 67)

En général **1 cm**. Sur le patron d'essayage, marge du **côté** portée à
**2-3 cm** pour permettre les corrections de la ligne de côté (p. 82). Deux
façons de couper le dos :

- **A — avec pince/couture milieu dos** : dos coupé en deux fois (2×), marge
  ajoutée au milieu dos (fig. 3A) ;
- **B — sans** : dos **coupé au pli** (milieu sur le repli du tissu), pas de
  marge au milieu (fig. 3B).

Pour la **toile d'essayage**, le dos est **toujours coupé au pli**, même si le
modèle a une pince milieu dos — une couture milieu gênerait les corrections et
épaissirait toute la ligne.

## 16. Patron d'essayage fini (p. 68)

Indications indispensables sur chaque pièce (fig. 4) : **DF** (droit-fil) ou
**DL** (droit lisière) ; **crans** d'assemblage ; indication de placement —
**« au pli »** (bord posé sur la pliure, pièces parfaitement symétriques) ou
**« 2X »** (deux couches coupées ensemble) ; et la **croisure**, parallèle au
milieu devant à environ **2-3 cm**, pour pouvoir fermer le devant. « À
noter » : conserver les **marques des pinces** sur le tissu (déplacer,
élargir, réduire à l'essayage).

## 17. Coupe (p. 69-70)

- Tissu **tissé**, ni trop épais ni trop rigide, jamais élastique/fluide :
  l'idéal est le **tissu-toile** de moulage (p. 69).
- **Doubler le tissu** (deux couches) pour couper d'un coup les deux demi-dos
  et demi-devants ; **DF parallèle à la lisière** ; épingler, tracer le
  contour (craie ou crayon tendre). Fig. 1 : plan de coupe, lisière en rouge,
  chaîne = longueur, trame = largeur.
- Reporter **crans et repères des lignes de construction** sur la toile
  (indispensables pour corriger ensuite).
- **Marquage des pinces** (p. 70, fig. 2) : épingle piquée à chaque point
  délimitant la pince (largeur et longueur) à travers papier + tissu ; papier
  soulevé, point de crayon sous l'épingle. Ne **pas** relier les points (les
  pinces bougeront peut-être à l'essayage).
- **Avant de couper** : retirer le patron, épingler les deux couches à
  l'intérieur du tracé, vérifier que **tous** les repères sont reportés
  (crans, points de pinces, milieux, taille, carrure…). Couper, **cranter**
  (entailles à 3-5 mm du bord). Reporter les repères sur la couche du dessous
  par épingle traversante + crayon au point de sortie (fig. 3).

## 18. Assemblage de la toile (p. 71-77)

**Jamais à la machine** (p. 71) : les corrections imposeraient de découdre.
Assemblage **aux épingles**, marges **couchées** — méthode standard des
cursus de modélisme : défauts repérables, pinces modifiables en déplaçant les
épingles sur la silhouette, marges à l'intérieur qui ne gênent pas
l'ajustement (p. 72).

Technique (p. 72-73, fig. 1-2) : plier la marge de la seconde pièce, la
superposer sur la marge de la première ; épingles piquées **dans le repli**,
inclinées à **≈ 45°** par rapport au bord, ne prenant que **2-3 mm** de
tissu, espacées régulièrement de **4 à 7 cm**, pointe vers le bas. Épingler
parallèlement au repli ou mordre plus de tissu fige la couture provisoire
(elle tire).

**Ordre d'assemblage** (p. 73) — impératif (côtés/épaules d'abord
condamneraient l'accès aux pinces) : **(1) toutes les pinces — bretelle,
puis épaule dos, puis taille ; (2) les côtés ; (3) les épaules en dernier.**

- **Pinces de taille** (p. 74, fig. 1) : fermer d'abord la **valeur sur la
  ligne de taille**, puis la longueur ; repli couché **vers le milieu**.
- **Pince bretelle** (p. 74, fig. 2) : fermeture démarrée **à la ligne
  d'épaule** — le **chapeau de pince** (p. 53) cale l'inclinaison et la
  valeur ; marge couchée **vers le milieu devant** ; épingles tous les
  4-5 cm ; **platitude de poitrine ≈ 2 cm** (voir ci-dessous). Pince fermée,
  la ligne d'épaule doit être **rectiligne** (règle) ; sinon corriger à 26°.
- **Platitude de poitrine** (p. 75, fig. 3) : bretelle et pince de taille
  forment une ligne continue sur le tracé, interrompue par le saillant —
  fermées jusqu'au bout, elles créeraient une pointe. Les espacer d'une
  platitude **d'environ 2 cm à l'extrémité de chacune**, à ajuster selon le
  volume de poitrine (C15).
- **Pince d'épaule dos** (p. 75, fig. 4) : comme la bretelle, depuis la ligne
  d'épaule ; valeurs très petites → épinglage très précis ; vérifier l'épaule
  rectiligne à la règle.
- **Côtés** (p. 76, fig. 5-6) : le côté a **deux parties** — droite
  (emmanchure → taille), arrondie (taille → bassin). Marquer le repli de 1 cm
  **au fer** sur le bord du dos. Commencer **à la taille** (raccorder les
  lignes de taille), raccorder les courbes d'emmanchure, puis épingler entre
  les deux ; le bas s'épingle de la taille **vers le bas**, sans aplatir
  l'arrondi, en surveillant marge et alignement.
- **Épaules** (p. 77, fig. 7-8) : étape délicate — repli d'épaule **dos**
  posé sur le bord d'épaule **devant** (marge couchée vers le dos), la toile
  du dos passe sous la ligne d'assemblage et risque d'être prise. Superposer
  les emmanchures dos/devant, préparer le repli, glisser une **règle entre
  les deux couches**, et **accorder le repli de la pince d'épaule avec le
  repli de la pince bretelle** (les deux pinces se font face à mi-épaule) ;
  raccorder les largeurs d'épaule de l'emmanchure à l'encolure.

## 19. Essayage du buste et corrections (p. 78-85)

Principes (p. 78) : essayage sur silhouette **très légèrement habillée**
(débardeur fin), **sans manches**. Critère n° 1 : le **tombant** — toutes les
verticales tracées (milieux, côté, axes de pinces) doivent tomber
verticalement, alignées sur les bolducs du mannequin. Chaque défaut a une
solution. Corrections établies sur **un seul côté** puis recopiées à plat sur
l'autre — sauf asymétrie corporelle marquée, à traiter côté par côté (p. 85).
Jamais de fer sur la toile pendant l'essayage (chaleur/vapeur déforment le
gabarit ; repasser uniquement avant coupe).

1. **Milieu devant** (p. 78-80, fig. 1-6). Buste enfilé **non fermé** : les
   deux bords du devant doivent être verticaux et concordants, **ni écart ni
   chevauchement** — preuve que inclinaison d'épaule et valeur de bretelle
   sont conformes. Sinon : causes = inclinaison d'épaules, valeur de
   bretelle ou **longueur du devant** erronées. Vérifier d'abord **à plat**
   la longueur devant (mesure p. 20 vs report ét. 10 p. 35) — si fausse,
   refaire le devant. Sinon corriger l'inclinaison **sur la toile** :
   désépingler les épaules, **remonter légèrement le devant** jusqu'à ce que
   le milieu tombe vertical, épingler la pliure sur l'épaule (fig. 3).
   L'encolure remonte avec — **marquer la nouvelle profondeur** (fig. 5).
   Retirer la toile, retracer à plat profondeur d'encolure et inclinaison
   exactes ; si la largeur d'épaule devient insuffisante, **coudre à plat un
   ajout de tissu** (sans épaisseur de marge) et rétablir largeur et
   inclinaison (fig. 4-5). Répéter sur la seconde épaule, renfiler, contrôler
   à nouveau ; recommencer jusqu'à un tombant parfait.
2. **Dos** (p. 81, fig. 1) : l'aplomb du milieu dos est en règle générale
   correct ; il ne se dérègle que si les épaules n'ont pas la même
   inclinaison ou si les marges n'ont pas été respectées. Sur la toile
   (élargissements minimaux), les pinces **milieu dos sont indispensables**
   (sinon le tissu bâille à la taille) : valeur standard 1 cm, à adapter
   (C19).
3. **Pinces de taille du devant** (p. 81, fig. 2) : fermer le devant
   croisures recouvertes, milieux superposés ; épingler depuis la **taille**
   puis aligner emmanchure, carrure, petites hanches, bassin. Les pinces
   (une ou deux selon le calcul) peuvent être **déplacées ou supprimées** à
   l'essayage : critère — pas de plis, toile bien plaquée. Sinon, les
   remplacer par de nouvelles pinces adaptées. (Renvoi livre : vol. 7,
   Moulage.)
4. **Ligne de côté** (p. 82, fig. 1-2) : à vérifier **buste fermé**, après
   les milieux. Elle doit tomber verticale (profil) malgré ses arrondis. Une
   bascule vers l'avant ou l'arrière démarre en général **à la taille, vers
   le bas** — volume des fesses (plus rarement du ventre), morphologie et
   non erreur de calcul. Correction : marquer le bon aplomb au crayon gras
   (B2), désépingler localement, **ajouter une bande de tissu** du côté où la
   largeur manque (dos ou devant), assemblée **à plat**.
5. **Emmanchure** (p. 83-84, fig. 1-3). L'ajustement autour du bras dépend
   **exclusivement** des valeurs de la pince bretelle et de la pince
   d'épaule dos. **Devant** : bâillement du bas d'emmanchure = valeur de
   bretelle inadéquate (plus rarement, marge non respectée) → désépingler
   épaule et pince, **augmenter le repli jusqu'à absorption totale** du
   surplus, épingler la nouvelle valeur (à reporter sur le papier), retracer
   la ligne d'épaule. **Dos** : même rôle pour la pince d'épaule (valeur
   standard ≈ 1 cm, dépend de l'arrondi du dos et du galbe d'épaules) ;
   même procédé, puis rétablir courbe d'emmanchure et épaule à 18°. « À
   noter » p. 84 : ne **pas** régler en même temps tombant du milieu devant
   (buste **ouvert**) et emmanchure (buste **fermé**).
6. **Report des corrections sur le tracé** (p. 85) : ôter les épingles,
   poser la toile sur le papier — **milieu sur milieu**, puis raccorder
   bassin, taille, emmanchure, carrure ; épingler à chaque intersection ;
   toile parfaitement à plat. Reporter **toutes** les marques (valeur de
   pince d'épaule, placements de pinces, côté, inclinaison…). À la fin,
   patron papier et toile doivent être **identiques**. Ne jamais négliger le
   tombant vertical des milieux ni l'horizontalité de la ligne de taille.

## 20. Patron de base fini — deux patrons sur le même tracé (p. 86-89)

Le patron de base fini est **recopié au calque sans élargissements ni marges**
(p. 86) : les élargissements de base conviennent rarement à tous les modèles
(on les ajoute juste avant la transformation) ; les marges s'ajoutent sur le
patron du modèle, après transformation — un patron de base avec marges rend
toute vérification hasardeuse.

Le même tracé porte en réalité **deux patrons** (p. 86-87, fig. 1-3) :

1. le **gabarit** de la silhouette (lignes noires) — proportions sans les
   volumes ;
2. le **patron complet** (tracé bleu) — le gabarit + les pinces qui rendent
   poitrine, taille, hanches et arrondi du dos.

Ils sont indissociables (le gabarit est le support des pinces). Usage
(p. 87-89) : patron **complet** pour couper la toile, pour les vêtements
**ajustés** et les **sans-manches** (la bretelle garantit l'emmanchure) ;
patron **sans pinces** pour tee-shirts, tuniques larges, tissus extensibles.
Exemples du livre : veste droite à large croisure et veste à bords-côtes →
patron simple (fig. 1-2 p. 88) ; robe kimono resserrée en bas → patron simple
(fig. 3 p. 89) ; veste ajustée à découpe princesse → patron complet, pinces
épaule dos et bretelle déplacées vers l'emmanchure et rejointes aux pinces de
taille (fig. 4 p. 89).

*Note moteur : le gabarit « sans pinces » est un sous-produit naturel du tracé
(contour avant application des pinces) — candidat à une option d'export
future, hors périmètre actuel.*

---

## Construction du demi-dos (synthèse moteur)

1. **Cadre** (§1). Milieu dos x = 0, horizontales du tableau, côté à
   poitrine/4 − 1 de l'épaule à la taille. (Bas bassin/4 − 1 : hors v1.)
2. **Encolure dos** (§3, §12). `snp-dos` = (largeur encolure, 0) SUR la ligne
   d'épaule ; nuque = (0, + profondeur encolure dos). Courbe nuque → `snp-dos`
   avec platitude large au milieu dos (tangente horizontale) ; arrivée sur
   l'épaule : continuité à travers la couture (v1 : ≈ perpendiculaire à
   l'épaule inclinée, **[À VALIDER à l'essayage]**).
3. **Épaule dos** (§4). Droite à 18° sous l'horizontale depuis `snp-dos`,
   longueur = longueur d'épaule (méthode A ; la méthode B par la largeur dos
   sert de contrôle croisé). Pente mesurée → angle déduit (§Extensions).
4. **Pince d'épaule dos** (§8, C12-C13). v1/v2 : option « valeur absorbée » —
   pas de pince tracée, épaule dos = longueur d'épaule, épaule devant (hors
   bretelle) = longueur d'épaule − 1, l'écart de 1 cm (dos plus long,
   fig. 4 p. 47) se résorbe en embu au montage. Cible v3+ : vraie pince (axe
   mi-épaule ⊥ à l'épaule, 7 cm, largeur 1 cm, rallonge d'extrémité = valeur,
   emmanchure retracée jusqu'à la carrure).
5. **Points d'emmanchure dos** (§5). Carrure dos/2 ; bissectrice 1,5 cm ;
   platitude à 1 cm du côté.
6. **Emmanchure dos** (§6). Spline `epaule-dos` → carrure → bissectrice
   (tangente 45°) → platitude → `dessous-bras` = (poitrine/4 − 1,
   y emmanchure), arrivée horizontale.
7. **Pinces de taille dos** (§10-11). Côté : même valeur que devant, partie
   haute à la règle du `dessous-bras` à la platitude. Demi-dos : axe à
   mi-distance entre bras de la pince de côté et milieu dos (ou bras de la
   pince milieu dos) ; ≤ 2 cm ; haut : [À VALIDER — C20, borne = ligne
   d'emmanchure] ; bas ≤ 11 cm sous la taille (hors v1). Milieu dos :
   facultative au patron, cintrage 0-1 (algorithme) ; indispensable sur la
   toile (C19).
8. **Contour v1** : encolure → épaule → emmanchure → côté (droite) → taille →
   milieu dos.

## Construction du demi-devant (synthèse moteur)

Coordonnées en local devant (x' depuis le milieu devant, vers le côté) ; le
rendu miroir fait x = poitrine/2 − x'.

D1. **Cadre** (§2). Horizontales recopiées du dos SAUF l'épaule. Largeur
   poitrine/4 + 1 → milieu devant (référence). Longueur devant portée depuis
   la taille vers le haut sur le milieu devant → ligne d'épaule devant.
D2. **Encolure devant** (§3, §12). `snp-devant` = (largeur encolure, y épaule
   devant) ; gorge = (0, y épaule devant + profondeur devant). Courbe qui suit
   la verticale d'encolure sur ≈ profondeur/3 (2-3 cm) sous `snp-devant`,
   puis s'arrondit ; platitude ≈ largeur/3 à la gorge, tangente horizontale
   (C16).
D3. **Saillant** (§9, C7). Ligne de poitrine à hauteur de poitrine sous la
   ligne d'épaule devant ; saillant = (écart/2, y poitrine), marqué d'une
   croix.
D4. **Vérifications sur mesure** (§9, p. 51) : hauteur de profondeur
   d'encolure → corrige la profondeur ; hauteur de galbe d'épaule → corrige
   l'angle de 26°. « Ne participent pas à la construction » (p. 21) — v1 :
   affichage d'un écart constaté, sans correction automatique.
D5. **Épaule devant + pince bretelle** (§4, §9). Épaule provisoire à 26°
   depuis `snp-devant`, longueur = longueur d'épaule (− 1 si option
   absorbée). Bretelle : `pince-bretelle-1` = milieu de l'épaule, 1er bras →
   saillant ; valeur v = poitrine/20 + 1 reportée **vers l'emmanchure**
   (C14) → `pince-bretelle-2` ; 2e bras égalisé sur le 1er. Fermeture
   (équivalent rotation autour du saillant, θ = 2·asin(v/(2·|jambe 1|))) ;
   la seconde moitié d'épaule repart de `pince-bretelle-2` à 26°.
D6. **Points d'emmanchure devant** (§5). Carrure devant/2 (< carrure dos/2,
   contrôle) ; bissectrice 2,5 ; platitude 1 cm. **Choix v1 validé par le
   rétablissement des mesures p. 53 (C11)** : carrure, bissectrice et
   dessous-bras ne bougent pas à la fermeture de la bretelle ; seuls la
   seconde moitié d'épaule et le haut de courbe sont portés par la rotation.
D7. **Emmanchure devant** (§6). Spline extrémité d'épaule (pivotée) → carrure
   → bissectrice (2,5, tangente 45°) → platitude → `dessous-bras` =
   (poitrine/4 + 1 local, y emmanchure). Virage plus ample que le dos par
   construction.
D8. **Pinces de taille devant** (§10-11). Pince du devant : axe vertical par
   le saillant, valeur équilibrée des deux côtés, ≤ 3 cm ; haut : v2 =
   saillant + 4 cm — **le livre indique plutôt une platitude de poitrine
   ≈ 2 cm par pince (C15) ; à trancher à l'essayage** ; bas ≤ 9 cm sous la
   taille (hors v1). Pince de côté : tracée en premier, dos en miroir, ≤ 4,
   partie haute à la règle.
D9. **Côté devant** : droite de `dessous-bras` au point de taille cintré.

## Choix documentés de la v1/v2 (cahier §4.4)

- Mise en planche (`engine/layout.ts`) : après construction, le devant est
  écarté du dos d'un blanc calculé (≥ 5 cm entre boîtes englobantes) —
  équivalent du blanc de 10-15 cm du livre (p. 35, ét. 9). Les coordonnées de
  construction (côtés coïncidents) restent celles du livre.
- Buste arrêté à la taille ; le livre poursuit jusqu'au bassin (largeurs
  bassin/4 ∓ 1 — dos posé sur la ligne de bassin ét. 5, devant posé sur la
  ligne de taille ét. 11 ; pinces prolongées 9/11 cm sous la taille ; pince de
  côté arrondie finissant aux petites hanches, presque droite à la taille,
  rejoignant le côté sous les petites hanches, p. 61-62). Reporté au jalon
  dédié ; le calcul (bassin − taille)/4 est déjà exposé au rapport.
- Pince d'épaule dos absorbée (option p. 47) plutôt que tracée — voir C12
  pour la cible v3+.
- Rotation de pince bretelle limitée à la seconde moitié d'épaule et au haut
  d'emmanchure — désormais adossée au « rétablissement des mesures » p. 53
  (C11).
- Ligne de petites hanches : ligne d'aide, non tracée en v1 (p. 36, 38).
- Élargissement de base (p. 66), marges (p. 67), croisure (p. 68), coupe et
  assemblage (p. 69-77), corrections d'essayage (p. 78-85) : documentés
  ci-dessus, hors périmètre du moteur v1 (concernent la toile et le papier) ;
  l'élargissement de base chiffré est candidat à un jalon « patron
  d'essayage ».
- Les longueurs d'emmanchure dos et devant sont mesurées sur les courbes
  tracées et exposées dans le rapport — donnée d'entrée de la manche (M5),
  avec le tour du corps à la carrure comme contrôle de tête de manche
  (p. 22). Le livre le confirme : pas de patron de manche de base, la manche
  se construit d'après l'emmanchure du buste (ouverture du chap. Manche,
  p. 91).

## Extensions hors livre (validées le 2026-07-07)

Deux paramètres issus de la comparaison avec une méthode tierce
(anicka.design) étendent la transcription **sans la modifier** : à leur valeur
neutre, le tracé est exactement celui du livre.

### Aisance globale (0–5 cm au tour, défaut produit 2)

- Ajoutée aux **tours** avant division : milieu devant à
  x = (poitrine + aisance)/2 ; lignes de côté à (poitrine + aisance)/4 − 1 ;
  largeur à la taille après pinces = (taille + aisance)/4 ∓ 1.
- **U = (poitrine − taille)/4 inchangé** : la même aisance s'ajoute aux deux
  tours.
- Restent sur les mesures du **corps** : encolure, carrures, écart et hauteur
  de poitrine, longueurs, pince bretelle (pince anatomique).
- aisance absente = 0 ; les golden tests du livre tournent à 0.
- Différence assumée avec l'« élargissement de base » du livre (p. 66, §14) :
  le livre élargit le **tracé fini** (épaule +1, emmanchure −2, côtés +1),
  l'option moteur élargit les **tours en amont**. Les deux ne se cumulent pas
  aujourd'hui ; l'élargissement du livre viendra avec le jalon « patron
  d'essayage ».

### Pente d'épaule mesurée (optionnelle)

- Mesure : dénivelé **vertical** entre le point d'encolure côté cou et la
  pointe d'épaule (cm). Non renseignée → angles du livre **18°/26°** (p. 41).
- Renseignée : angle dos = **asin(pente / longueur d'épaule)** ; angle
  devant = angle dos + 8° — le différentiel 26° − 18° est conservé.
  **[À VALIDER à l'essayage : le report du différentiel est un choix de
  transcription.]** Appui livre : les 18°/26° sont explicitement des valeurs
  **standards**, à corriger sur mesure via la hauteur de galbe d'épaule
  (p. 51) et à l'essayage (p. 79-80) — la pente mesurée est une voie
  équivalente.
- Garde-fou : angle dos plafonné à **45°** (avertissement moteur ; contrôle
  formulaire si pente > 0,7 × longueur d'épaule).
- pente = longueur d'épaule × sin(18°) → tracé identique au défaut.

## Invariants testés (tests/invariants.test.ts)

- Contour fermé, sans auto-intersection, aire positive (chaque pièce).
- Épaules : |épaule devant hors pince| = |épaule dos| − 1 cm (option pince
  absorbée ; écart = embu du montage, p. 47).
- Jambes de pince bretelle égalisées : ||jambe 1| − |jambe 2|| < 0,01.
- Largeur à la taille après déduction des pinces = (taille + aisance)/4 ∓ 1,
  à l'excédent signalé près.
- Extensions neutres → géométrie strictement identique au tracé du livre ;
  pente mesurée → dénivelé vertical de l'épaule dos = pente (plafonné 45°).
- Pinces de côté dos et devant de même valeur ; longueurs de côté dos =
  devant (emmanchure → taille).
- Nuque SOUS la ligne d'épaule (y > 0) ; encolure dos à tangente horizontale
  à la nuque ; gorge à tangente horizontale au milieu devant.
- Emmanchures : passage à moins d'un epsilon des points imposés (carrure,
  bissectrice, platitude) ; arrivée horizontale au dessous-bras.
- Golden tests (profil 88/68/92, cou 38) : largeur encolure 7,33 ;
  profondeur dos 2,375 ; profondeur devant 9,33 ; pince bretelle 5,4 ;
  U = 5 ; répartition c=2, dF=3, dB=2, mD=1.
- **Candidats v3 (à ajouter avec les corrections de code)** : différence de
  longueur d'emmanchure dos/devant dans [1, 2] cm (avertissement hors plage,
  p. 65 — C17) ; carrure devant < carrure dos (validation de saisie, p. 20 et
  42) ; platitude d'encolure devant ≈ largeur/3 et profondeur/3 (C16).

## À confronter au moteur (aide-mémoire — étape suivante, sans toucher au code)

Règles à vérifier dans `src/engine/pieces/buste.ts` et `src/engine/method.ts`
(aucune modification dans cette étape ; chaque écart avéré passera par un test
avant correction) :

1. **Direction du report de la valeur de pince bretelle** : depuis le milieu
   d'épaule **vers l'emmanchure** (C14, fig. 5-6 p. 52). Vérifier le signe
   dans la construction de `pince-bretelle-2`.
2. **Sens de l'écart d'épaule en option absorbée** : dos = longueur d'épaule,
   devant = longueur d'épaule − 1 (dos plus long de 1 cm, fig. 4 p. 47 —
   C12). Vérifier l'invariant existant et le commentaire du code.
3. **Rétablissement post-bretelle** : carrure, bissectrice et platitude
   inchangées après fermeture ; seconde moitié d'épaule repartant de
   `pince-bretelle-2` à 26° avec sa longueur d'origine ; nouvelle courbe par
   les 3 points (C11, p. 53). Confirmer que le moteur reproduit bien les
   largeurs d'origine sur les lignes de carrure ET d'emmanchure.
4. **Retrait de pointe de la pince de taille devant** : 4 cm actuels
   (`method.ts`) vs platitude de poitrine ≈ 2 cm par pince du livre (C15,
   p. 75). Décision à prendre (2 cm livre / 4 cm tiers), à documenter et
   couvrir par test.
5. **Plafonds et répartition des pinces de taille** : devant ≤ 3, côtés ≤ 4,
   demi-dos ≤ 2, milieu dos ≤ 1-2 ; exemple normatif 1+2+2 / 2+3 (p. 55-57).
   Vérifier constantes et algorithme (déjà couverts par golden test).
6. **Axe de la pince demi-dos** : mi-distance entre bras de la pince de côté
   et milieu dos / bras de la pince milieu dos quand elle existe (p. 55).
   Vérifier le cas « pince milieu dos non nulle ».
7. **Haut de la pince demi-dos** : proposition v1 y_emmanchure + 2 ; les
   planches montent jusque vers la ligne d'emmanchure (C20). Vérifier la
   valeur et la borner par la ligne d'emmanchure.
8. **Platitudes des pinces à la taille** : 2-4 cm, parts égales de part et
   d'autre de la taille, inversement proportionnelles à la valeur (p. 59) ;
   bras rectilignes arrêtés à la platitude, jonction légèrement courbée par
   le repère de valeur (p. 60). Vérifier la fonction de platitude et la forme
   émise au patron.
9. **Encolure devant** : tangence verticale sous `snp-devant` sur
   ≈ profondeur/3 et platitude ≈ largeur/3 à la gorge (C16). Vérifier les
   tensions/poignées actuelles de la courbe.
10. **Encolure dos** : platitude large depuis le milieu dos (p. 63) ;
    continuité de la courbe à travers la ligne d'épaule quand dos et devant
    sont assemblés (critère du livre, p. 63-64). Vérifier l'angle d'arrivée
    côté épaule des deux courbes.
11. **Emmanchure** : points imposés intouchables (épaule, carrure,
    platitude), bissectrice seule ajustable (p. 42-43) ; tangente 45° à la
    bissectrice ; arrivée horizontale au dessous-bras. Vérifier les
    contraintes de la spline et la liberté laissée à la bissectrice.
12. **Contrôle des longueurs d'emmanchure** : |L_dos − L_devant| ∈ [1, 2] cm
    attendu (C17, p. 65) — à exposer comme avertissement dans le rapport
    (pas une erreur dure : le sens dépend de la morphologie).
13. **Validation de saisie** : carrure devant < carrure dos (p. 20, 42) — à
    brancher côté formulaire/rapport.
14. **Constantes `method.ts`** : angles 18/26, encolure (cou/6 + 1, cou/16,
    +2), bissectrices 1,5/2,5, platitude d'emmanchure 1 cm, bretelle
    poitrine/20 + 1, plafonds de pinces — tout doit y être nommé, aucune
    valeur en dur dans `buste.ts` (règle du dépôt). Ajouter à terme :
    pince d'épaule dos (1 cm × 7 cm), platitude de poitrine (2 cm),
    élargissement de base (1/2/1), marges (1 ; côté toile 2-3), croisure
    (2-3), différence d'emmanchure [1, 2].
15. **Pince d'épaule dos tracée** (cible v3+, C12-C13) : à spécifier comme
    évolution — axe mi-épaule, ⊥ à l'épaule, 7 cm, 1 cm de large, rallonge
    d'extrémité, emmanchure retracée jusqu'à la carrure, épaule retracée à
    18° pince fermée ; l'option absorbée devient un paramètre.
16. **Gabarit sans pinces** (p. 86-89) : sous-produit d'export potentiel
    (contour avant pinces) — à noter au cahier, pas au moteur v1.
