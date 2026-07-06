/**
 * Invariants vrais pour TOUTE mensuration valide (cahier §4.5.2).
 * Property-based léger : 200 jeux de mesures plausibles tirés au hasard
 * (générateur déterministe, graine fixe → reproductible).
 */

import { describe, it, expect } from "vitest";
import { draftBuste } from "../src/engine/pieces/buste";
import type { Measurements } from "../src/engine/measurements";
import { validateBounds } from "../src/engine/measurements";
import { METHOD } from "../src/engine/method";
import { dist, sub } from "../src/engine/geometry/point";
import { endTangent } from "../src/engine/geometry/curve";
import { isClosed, outlineArea, selfIntersects, segmentLength } from "../src/engine/geometry/path";

/** PRNG déterministe (mulberry32) : les 200 cas sont les mêmes à chaque run. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Corps plausible : bornes physiques ET contrôles de cohérence respectés. */
function randomBody(rnd: () => number): Measurements {
  const range = (lo: number, hi: number) => lo + rnd() * (hi - lo);
  const half = (v: number) => Math.round(v * 2) / 2; // pas de 0,5 comme le formulaire
  const tourPoitrine = half(range(78, 125));
  const m: Measurements = {
    tourPoitrine,
    tourTaille: half(tourPoitrine - range(6, 24)),
    tourBassin: half(tourPoitrine + range(-3, 12)),
    tourCou: half(30 + (tourPoitrine - 78) * 0.15 + range(0, 4)),
    carrureDos: half(tourPoitrine * 0.36 + range(1, 4)),
    carrureDevant: half(tourPoitrine * 0.36 - range(0.5, 3)),
    longueurDos: half(range(38, 46)),
    longueurDevant: 0, // rempli ci-dessous
    hauteurPoitrine: half(24 + (tourPoitrine - 78) * 0.1 + range(-1, 3)),
    ecartPoitrine: half(16 + (tourPoitrine - 78) * 0.12 + range(-1, 2)),
    longueurEpaule: half(range(11.5, 15)),
  };
  m.longueurDevant = half(m.longueurDos + range(1.5, 5));
  return m;
}

const rnd = mulberry32(2026);
const bodies: Measurements[] = [];
while (bodies.length < 200) {
  const m = randomBody(rnd);
  if (validateBounds(m).length === 0) bodies.push(m);
}

describe("invariants sur 200 mensurations plausibles", () => {
  it("contours fermés, aire non nulle, aucune auto-intersection", () => {
    for (const m of bodies) {
      const { dos, devant } = draftBuste(m);
      for (const piece of [dos, devant]) {
        expect(isClosed(piece.outline, 1e-6), `${piece.id} fermé (${JSON.stringify(m)})`).toBe(true);
        expect(Math.abs(outlineArea(piece.outline)), `${piece.id} aire`).toBeGreaterThan(100);
        expect(selfIntersects(piece.outline), `${piece.id} auto-intersection (${JSON.stringify(m)})`).toBe(false);
      }
    }
  });

  it("longueur d'épaule dos = longueur d'épaule devant (hors pince bretelle)", () => {
    for (const m of bodies) {
      const { dos, devant } = draftBuste(m);
      const epauleDos = dist(dos.points["snp-dos"], dos.points["epaule-dos"]);
      const epauleDevant =
        dist(devant.points["snp-devant"], devant.points["pince-bretelle-1"]) +
        dist(devant.points["pince-bretelle-2"], devant.points["epaule-devant"]);
      expect(epauleDos).toBeCloseTo(m.longueurEpaule, 6);
      expect(epauleDevant).toBeCloseTo(m.longueurEpaule, 6);
    }
  });

  it("jambes de pince égalisées et symétriques autour de l'axe", () => {
    for (const m of bodies) {
      const { dos, devant } = draftBuste(m);
      for (const piece of [dos, devant]) {
        for (const dart of piece.darts) {
          expect(dist(dart.legs[0], dart.apex)).toBeCloseTo(dist(dart.legs[1], dart.apex), 6);
          expect(dist(dart.legs[0], dart.legs[1])).toBeCloseTo(dart.value, 3);
        }
      }
    }
  });

  it("largeur à la taille = tour de taille / 4 + excédent non absorbé", () => {
    for (const m of bodies) {
      const { dos, devant, report } = draftBuste(m);
      const pinceDos = report.values.find((v) => v.key === "pinceDos")!.value;
      const pinceDevant = report.values.find((v) => v.key === "pinceDevant")!.value;
      const excedent = (m.tourPoitrine - m.tourTaille) / 4 -
        (report.values.find((v) => v.key === "coteDos")!.value +
          pinceDos +
          report.values.find((v) => v.key === "milieuDos")!.value);
      const dosLargeur = dos.points["taille-cote-dos"].x - dos.points["taille-milieu-dos"].x - pinceDos;
      expect(dosLargeur).toBeCloseTo(m.tourTaille / 4 + Math.max(0, excedent), 6);
      const excedentDevant = (m.tourPoitrine - m.tourTaille) / 4 -
        (report.values.find((v) => v.key === "coteDevant")!.value + pinceDevant);
      const devantLargeur =
        devant.points["taille-milieu-devant"].x - devant.points["taille-cote-devant"].x - pinceDevant;
      expect(devantLargeur).toBeCloseTo(m.tourTaille / 4 + Math.max(0, excedentDevant), 6);
    }
  });

  it("coutures de côté dos et devant de même longueur (raccord au montage)", () => {
    for (const m of bodies) {
      const { dos, devant } = draftBuste(m);
      const coteDos = segmentLength(dos.outline.find((s) => s.kind === "line" && s.a === dos.points["dessous-bras"])!);
      const coteDevant = segmentLength(
        devant.outline.find((s) => s.kind === "line" && s.a === devant.points["dessous-bras"])!,
      );
      expect(coteDos).toBeCloseTo(coteDevant, 6);
    }
  });

  it("encolures perpendiculaires aux épaules au raccord (pas de bec)", () => {
    for (const m of bodies.slice(0, 50)) {
      const { dos, devant } = draftBuste(m);
      // dos : tangente d'arrivée de l'encolure ⊥ direction d'épaule
      const tDos = endTangent(dos.curves["encolure-dos"]);
      const epDos = sub(dos.points["epaule-dos"], dos.points["snp-dos"]);
      const nDos = Math.hypot(epDos.x, epDos.y);
      expect(Math.abs((tDos.x * epDos.x + tDos.y * epDos.y) / nDos)).toBeLessThan(1e-6);
      // devant : idem sur la première moitié d'épaule
      const tDev = endTangent(devant.curves["encolure-devant"]);
      const epDev = sub(devant.points["pince-bretelle-1"], devant.points["snp-devant"]);
      const nDev = Math.hypot(epDev.x, epDev.y);
      expect(Math.abs((tDev.x * epDev.x + tDev.y * epDev.y) / nDev)).toBeLessThan(1e-6);
    }
  });

  it("les plafonds de pinces de la méthode ne sont jamais dépassés", () => {
    for (const m of bodies) {
      const { report } = draftBuste(m);
      const get = (k: string) => report.values.find((v) => v.key === k)!.value;
      expect(get("pinceDevant")).toBeLessThanOrEqual(METHOD.PLAFOND_PINCE_DEVANT);
      expect(get("pinceDos")).toBeLessThanOrEqual(METHOD.PLAFOND_PINCE_DEMI_DOS);
      expect(get("milieuDos")).toBeLessThanOrEqual(METHOD.PLAFOND_MILIEU_DOS);
      expect(get("coteDos")).toBeLessThanOrEqual(METHOD.PLAFOND_COTE_PAR_PIECE);
      expect(get("coteDevant")).toBeLessThanOrEqual(METHOD.PLAFOND_COTE_PAR_PIECE);
    }
  });
});
