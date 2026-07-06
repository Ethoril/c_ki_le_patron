# Patrons — instructions projet

Générateur de **patrons de base de couture sur mesure** (méthode Teresa
Gilewska, *Les patrons de base sur mesure*, Eyrolles). Application 100 %
statique : aucune donnée ne quitte le navigateur. Cahier des charges complet :
`docs/cahier-des-charges.md`.

## Commandes

- `npm run dev` — serveur de développement
- `npm test` — suite Vitest (moteur pur, rapide, sans DOM)
- `npm run build` — typecheck strict + bundle production
- `npx vite-node scripts/demo-svg.ts sortie.svg` — SVG 1:1 du profil démo (contrôle visuel)

## Architecture (résumé du cahier §4)

- **`src/engine/` est un module TypeScript PUR** : zéro import React/DOM.
  Il prend des `Measurements`, il rend des `PatternPiece` (géométrie).
- `engine/geometry/` — noyau générique : `point.ts`, `curve.ts` (Catmull-Rom →
  béziers, longueur d'arc), `intersect.ts`, `path.ts`. Unité = **cm**,
  **y vers le bas**.
- `engine/method.ts` — **TOUTES les constantes de la méthode** (angles 18°/26°,
  bissectrices, plafonds de pinces, formules d'encolure, tensions de courbes).
  Jamais de valeur de méthode en dur ailleurs.
- `engine/drafting.ts` — `Draft` : chaque point/ligne/courbe est **nommé et
  enregistré comme étape** (`steps`), avec libellé et référence de page.
- `engine/pieces/buste.ts` — transcription linéaire de `docs/methode/buste.md`,
  dans l'ordre de la note, blocs numérotés comme elle.
- `engine/generate.ts` — orchestre les pièces ; les dépendances inter-pièces
  (ex. longueur d'emmanchure pour la manche) sont **mesurées sur les courbes
  tracées**, jamais recalculées par formule.
- `src/render/` et `src/ui/` consomment `PatternPiece` ; **aucun calcul
  géométrique côté rendu**.

## Règles de travail

1. **`docs/methode/<piece>.md` fait autorité sur le code.** Avant de modifier
   une construction, mettre à jour/faire valider la note de méthode. Les
   marqueurs `[À VALIDER]` signalent les transcriptions non encore confrontées
   au livre.
2. **Aucune modification du moteur sans test qui la couvre.** Golden tests =
   exemples chiffrés du livre (`tests/buste.test.ts`) ; invariants sur 200
   mensurations aléatoires (`tests/invariants.test.ts`) ; snapshot SVG
   (`tests/export-svg.test.ts`, régénérer avec `-u` uniquement si le changement
   de tracé est voulu et validé).
3. Le dépôt ne doit contenir **aucune reproduction du livre** (ni scan, ni
   texte recopié) : les notes de méthode sont des reformulations personnelles.
4. Boucle de dev par pièce (§6) : note de méthode → golden tests → construction
   → contrôle visuel (`scripts/demo-svg.ts`) → tensions/détails → invariants.

## Jalons

M0 scaffolding+Pages ✅ · M1 moteur buste+tests ✅ · M2 UI ✅ · M3 export PDF A4
tuilé (SVG 1:1 déjà fait) · M4 jupe · M5 manche · M6 pantalon · M7+ pas-à-pas.
Chaque jalon = une branche + une PR ; déploiement Pages au merge sur `main`.
