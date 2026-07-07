/**
 * Contrôle visuel (boucle de dev §6, étape 4) : génère le SVG 1:1 du profil
 * de démonstration pour comparaison avec les planches du livre.
 * Usage : npx vite-node scripts/demo-svg.ts [sortie.svg] ['{"longueurEpaule":18}']
 * (le 2e argument surcharge des mesures du profil démo, pour reproduire un cas)
 */

import { writeFileSync } from "node:fs";
import { generate } from "../src/engine/generate";
import { DEMO_MEASUREMENTS } from "../src/engine/measurements";
import { buildExportSvg } from "../src/render/export-svg";

const out = process.argv[2] ?? "demo-buste.svg";
const overrides = process.argv[3] ? JSON.parse(process.argv[3]) : {};
const mesures = { ...DEMO_MEASUREMENTS, ...overrides };
const pattern = generate(mesures);
writeFileSync(out, buildExportSvg(pattern.pieces, mesures, new Date()), "utf8");

console.log("écrit :", out);
console.log("emmanchure totale mesurée (cm) :", pattern.interPieces.longueurEmmanchureTotale.toFixed(2));
for (const w of pattern.report.warnings) console.log("⚠", w.message);
