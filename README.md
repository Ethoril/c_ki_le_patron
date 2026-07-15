# Patrons de base sur mesure

Application web statique qui génère des **patrons de base de couture sur
mesure** (buste, puis jupe/manche/pantalon) à partir de vos mensurations, selon
la méthode de construction géométrique de Teresa Gilewska (*Les patrons de base
sur mesure*, Eyrolles — cité comme référence bibliographique, aucune
reproduction du livre dans ce dépôt).

Le tracé est consultable à l'écran (zoom/pan, grille centimétrique, mode
construction avec points nommés) et exportable en **SVG à l'échelle 1:1** ou
en **PDF A4 tuilé** avec repères d'assemblage, plan de montage et carré de
contrôle de 5 cm. Le patron de base est produit **sans valeurs de couture**,
conformément à la méthode ; une **aisance optionnelle** (défaut 2 cm au tour,
réglable de 0 à 5) élargit le gabarit — à 0, le tracé est exactement celui du
livre.

Pour le PDF, imprimer à **100 % / taille réelle**, sans ajustement automatique.
Le contrôle physique du carré de 5 cm reste recommandé avant tout assemblage.

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
