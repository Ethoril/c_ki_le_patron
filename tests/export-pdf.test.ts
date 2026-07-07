/**
 * Export PDF A4 tuilé (M3) : math de tuilage pure + génération du document.
 * Le critère de sortie physique (« un patron imprimé et scotché a le bon carré
 * test ») se vérifie au réglet ; ici on borne ce qui est testable en machine.
 */

import { describe, it, expect } from "vitest";
import { generate } from "../src/engine/generate";
import { DEMO_MEASUREMENTS } from "../src/engine/measurements";
import { computeTiling, tuileLabel, buildExportPdf, TUILE } from "../src/render/export-pdf";

describe("tuilage A4 (math pure)", () => {
  it("zone utile d'une tuile = A4 moins 1 cm de marge de chaque côté", () => {
    expect(TUILE.w).toBeCloseTo(19, 6);
    expect(TUILE.h).toBeCloseTo(27.7, 6);
  });

  it("un patron plus petit qu'une tuile tient sur 1 page", () => {
    const t = computeTiling({ x: 0, y: 0 }, { x: 10, y: 20 });
    expect(t.cols).toBe(1);
    expect(t.rows).toBe(1);
  });

  it("le blanc d'1 cm autour du patron est compté dans la planche", () => {
    // 18 cm de large + 2×1 cm de blanc = 20 > 19 → 2 colonnes
    const t = computeTiling({ x: 0, y: 0 }, { x: 18, y: 10 });
    expect(t.cols).toBe(2);
    expect(t.origin).toEqual({ x: -1, y: -1 });
  });

  it("la planche du profil démo (≈ 46 × 46 cm) tient sur 3 colonnes × 2 lignes", () => {
    const t = computeTiling({ x: 0, y: -3 }, { x: 44, y: 41 });
    expect(t.cols).toBe(3);
    expect(t.rows).toBe(2);
  });

  it("les tuiles couvrent toute la planche", () => {
    for (const [w, h] of [
      [10, 20],
      [44, 46],
      [100, 3],
      [19, 27.7],
    ]) {
      const t = computeTiling({ x: 0, y: 0 }, { x: w, y: h });
      expect(t.cols * TUILE.w).toBeGreaterThanOrEqual(t.w);
      expect(t.rows * TUILE.h).toBeGreaterThanOrEqual(t.h);
      expect((t.cols - 1) * TUILE.w, `pas de colonne vide (${w}×${h})`).toBeLessThan(t.w);
      expect((t.rows - 1) * TUILE.h, `pas de ligne vide (${w}×${h})`).toBeLessThan(t.h);
    }
  });

  it("numérotation ligne/colonne lisible", () => {
    expect(tuileLabel(0, 0)).toBe("L1·C1");
    expect(tuileLabel(1, 2)).toBe("L2·C3");
  });
});

describe("génération du document (profil démo)", () => {
  const pattern = generate(DEMO_MEASUREMENTS);
  const doc = buildExportPdf(pattern.pieces, DEMO_MEASUREMENTS, new Date(2026, 6, 6));

  it("1 page de garde + une page par tuile", () => {
    expect(doc.getNumberOfPages()).toBe(1 + 3 * 2);
  });

  it("pages au format A4 en cm", () => {
    const info = doc.internal.pageSize;
    expect(info.getWidth()).toBeCloseTo(21, 1);
    expect(info.getHeight()).toBeCloseTo(29.7, 1);
  });

  it("le PDF généré est un document valide non trivial", () => {
    const bytes = new Uint8Array(doc.output("arraybuffer") as ArrayBuffer);
    const head = String.fromCharCode(...bytes.slice(0, 5));
    expect(head).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(10_000);
  });
});
