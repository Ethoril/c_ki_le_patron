/**
 * Contrôle visuel M3 : génère le PDF A4 tuilé du profil de démonstration.
 * Usage : npx vite-node scripts/demo-pdf.ts [chemin-sortie.pdf]
 */

import { writeFileSync } from "node:fs";
import { generate } from "../src/engine/generate";
import { DEMO_MEASUREMENTS } from "../src/engine/measurements";
import { buildExportPdf } from "../src/render/export-pdf";

const out = process.argv[2] ?? "demo-buste-A4.pdf";
const pattern = generate(DEMO_MEASUREMENTS);
const doc = buildExportPdf(pattern.pieces, DEMO_MEASUREMENTS, new Date());
writeFileSync(out, Buffer.from(doc.output("arraybuffer") as ArrayBuffer));
console.log("écrit :", out, `(${doc.getNumberOfPages()} pages)`);
