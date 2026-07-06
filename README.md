# Patrons de base sur mesure

Application web statique qui génère des **patrons de base de couture sur
mesure** (buste, puis jupe/manche/pantalon) à partir de vos mensurations, selon
la méthode de construction géométrique de Teresa Gilewska (*Les patrons de base
sur mesure*, Eyrolles — cité comme référence bibliographique, aucune
reproduction du livre dans ce dépôt).

Le tracé est consultable à l'écran (zoom/pan, grille centimétrique, mode
construction avec points nommés) et exportable en **SVG à l'échelle 1:1** avec
carré de contrôle de 10 cm et cartouche. Le patron de base est produit **sans
valeurs de couture ni aisance**, conformément à la méthode.

## Vie privée

Vos mensurations sont des données personnelles : **aucune donnée ne quitte le
navigateur**. Pas de compte, pas de backend ; les profils sont stockés dans le
localStorage de votre navigateur et exportables en JSON.

## Développement

```bash
npm install
npm run dev     # serveur de développement
npm test        # tests du moteur (golden tests du livre + invariants)
npm run build   # production
```

Architecture et conventions : voir [CLAUDE.md](CLAUDE.md) et
[docs/cahier-des-charges.md](docs/cahier-des-charges.md). Les notes de méthode
par pièce (qui font autorité sur le code) sont dans [docs/methode/](docs/methode/).

## Licence

Code sous licence MIT. La méthode de construction appartient à son autrice ;
les notes de `docs/methode/` sont des reformulations personnelles.
