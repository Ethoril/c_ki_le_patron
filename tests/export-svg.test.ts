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

  it("unités physiques en cm et carré de contrôle de 5 cm", () => {
    expect(svg).toMatch(/width="[\d.]+cm" height="[\d.]+cm"/);
    expect(svg).toContain('width="5" height="5"');
    expect(svg).toContain("carré de contrôle 5 cm");
  });

  it("cartouche : mesures, date, mention sans coutures et aisance appliquée", () => {
    // le profil démo porte l'aisance produit par défaut (2 cm au tour)
    expect(svg).toContain("SANS valeurs de couture, aisance 2 cm au tour");
    expect(svg).toContain("06/07/2026");
    expect(svg).toContain("Poitrine 88 · Taille 68 · Bassin 92 · Cou 38");
  });

  it("cartouche : mention « sans aisance » quand l'aisance est nulle", () => {
    const livre = { ...DEMO_MEASUREMENTS, aisance: 0 };
    const svgLivre = buildExportSvg(generate(livre).pieces, livre, new Date(2026, 6, 6));
    expect(svgLivre).toContain("SANS valeurs de couture, sans aisance");
  });

  it("snapshot du tracé du profil démo", () => {
    expect(svg).toMatchSnapshot();
  });
});
