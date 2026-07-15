# Sommaire de la source — index de repérage

Index du livre **Teresa Gilewska, *Les patrons de base sur mesure* (Buste,
manche, jupe et pantalon — Construction et ajustement)**, Éditions Eyrolles,
4ᵉ tirage 2021.

But de ce fichier : localiser rapidement un sujet dans le PDF source (scan sans
couche texte, lu page par page via `pdftoppm`). **Ce n'est pas une
reproduction du livre** — seulement des titres et numéros de page, pour la
navigation. Le PDF lui-même n'est jamais committé (voir `.gitignore`).

## Conversion page livre → page PDF

Le scan (CamScanner) a sauté des pages blanches, donc le décalage **dérive** le
long du livre. Il n'y a pas de formule unique : partir de l'estimation ci-dessous
puis **ajuster ±1-2** en lisant le numéro imprimé sur la page rendue.

| Zone (page livre) | Décalage à appliquer | Exemple vérifié |
| --- | --- | --- |
| Sommaire / avant-propos (4-8) | PDF = livre **+1** | livre 4 → PDF 5 |
| Généralités (9-29) | PDF = livre **−1** | livre 10 → PDF 9 ; livre 29 → PDF 28 |
| Le buste (31-90) | PDF = livre **−2** | livre 31 → PDF 29 ; livre 89 → PDF 87 (vérifié constant sur tout le chapitre, dernière page de contenu = 89) |
| La manche (91-118) | PDF = livre **−3** | livre 91 (ouverture) → PDF 88 |
| La jupe (119-136) | PDF = livre **−4** | livre 121 → PDF 117 |
| Le pantalon (137-166) | PDF = livre **−4** | livre 139 → PDF 135 |
| Transformation (167-187) | PDF = livre **−5** | livre 170 → PDF 165 |

PDF : 187 pages au total. Page 1 = couverture ; colophon (dépôt légal mars 2021)
en PDF 185.

Commande de rendu d'une page (r = résolution en DPI) :

```bash
PT="/c/Users/arnot/AppData/Local/Microsoft/WinGet/Packages/oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe/poppler-25.07.0/Library/bin/pdftoppm.exe"
"$PT" -png -r 110 -f <pdf> -l <pdf> "994093051-Les-Patrons-de-Base-Sur-Mesure (1).pdf" sortie
```

> Après redémarrage de Claude Code / VSCode, `pdftoppm` sera dans le PATH et
> l'outil `Read` lira directement le PDF via son paramètre `pages:` (plus besoin
> du rendu manuel ci-dessus).

## Sommaire (numéros = pages du livre)

### Généralités — p. 9 (pagination vérifiée sur les pages rendues)
- Lignes virtuelles — 9
  - Principales lignes du patron — 11
  - Du gabarit au patron fini — 13
  - Particularités des patrons — 15
- Prise des mesures — 18
  - Prise des mesures pour le buste — 18
  - Prise des mesures pour la jupe — 26
  - Prise des mesures pour le pantalon — 27

> Note de méthode du chapitre : `docs/methode/generalites.md`.

### Le buste — p. 31 (pagination vérifiée sur les pages rendues ; contenu jusqu'à p. 89)
- Construction de patron sur mesure — 32
  - Gabarit dos — 33
  - Gabarit devant — 35
  - Ligne de petites hanches — 36
  - Vérification des mesures — 38
  - Encolure — 39
  - Inclinaison et largeur d'épaule — 41
  - Emmanchure dos et devant — 42
  - Pinces de base — 45
  - Pince d'épaule dos — 46
  - Pince bretelle — 49
  - Pinces de taille — 54
  - Forme de la pince de côté — 61
  - Forme de l'encolure — 63
  - Vérification de l'emmanchure — 64
  - Élargissement de base — 66
  - Marges de couture — 67
  - Patron d'essayage fini — 68
  - Coupe — 69
- Assemblage et essayage — 71
  - Ordre d'assemblage — 73
  - Essayage du buste — 78
  - Milieu devant — 78
  - Pinces de taille du devant — 81
  - Ligne de côté — 82
  - Emmanchure — 83
  - Report des corrections sur le tracé de base — 85
- Patron de base fini — 86
  - Deux patrons sur le même tracé — 86
  - Exemples d'utilisation — 88 (fin du chapitre : p. 89)

> Note de méthode du chapitre : `docs/methode/buste.md` (v3, chapitre complet).

### La manche — p. 91
- Particularité de la manche — 92
- Construction de la manche — 95
  - Vérification des mesures de la tête et de l'emmanchure — 102
  - Construction de la pince — 105
- Patron fini de la manche — 111
- Assemblage — 112
  - Défaut le plus courant — 117

### La jupe — p. 119
- Construction du patron — 121
  - Pinces de taille — 124
- Patron fini de la jupe — 131
- Assemblage de la jupe — 132
  - Essayage — 132
  - Défauts dus à la construction — 134

### Le pantalon — p. 137
- Construction du patron — 138
  - Pinces — 141
  - Pli central — 143
  - Élargissement de base — 150
- Assemblage — 154
- Essayage — 156
  - Défauts les plus courants — 161
  - Adaptation du tracé à la morphologie — 164

### Transformation des patrons de base — p. 167
- Élargissements — 169
- Modification des patrons — 172
  - Pivotement des pinces — 173
  - Lignes de découpe — 176
  - Transformation de la manche — 177
  - Transformation de la jupe — 183
  - Transformation de pantalon — 186
  - Outils pour réaliser un patron — 187
