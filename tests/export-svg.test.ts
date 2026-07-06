/**
 * Snapshot SVG du profil de démonstration (cahier §4.5.3) : détecte les
 * régressions visuelles involontaires lors des refactors. Si le changement de
 * tracé est VOULU (correction validée livre en main), régénérer avec
 * `npx vitest run -u` et relire le diff.
 */

import { describe, it, expect } from "vitest";
import { generate } from "../src/engine/generate";
import { DEMO_MEASUREMENTS } from "../src/engine/measurements";
import { buildExportSvg } from "../src/render/export-svg";

describe("export SVG 1:1", () => {
  const pattern = generate(DEMO_MEASUREMENTS);
  const svg = buildExportSvg(pattern.pieces, DEMO_MEASUREMENTS, new Date(2026, 6, 6));

  it("unités physiques en cm et carré de contrôle de 10 cm", () => {
    expect(svg).toMatch(/width="[\d.]+cm" height="[\d.]+cm"/);
    expect(svg).toContain('width="10" height="10"');
    expect(svg).toContain("carré de contrôle 10 cm");
  });

  it("cartouche : mesures, date, mention sans coutures", () => {
    expect(svg).toContain("SANS valeurs de couture ni aisance");
    expect(svg).toContain("06/07/2026");
    expect(svg).toContain("Poitrine 88 · Taille 68 · Bassin 92 · Cou 38");
  });

  it("snapshot du tracé du profil démo", () => {
    expect(svg).toMatchSnapshot();
  });
});
