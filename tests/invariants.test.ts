/**
 * Invariants vrais pour TOUTE mensuration valide (cahier §4.5.2, liste de
 * docs/methode/buste.md §Invariants). Property-based léger : 200 jeux de
 * mesures plausibles tirés au hasard (générateur déterministe, graine fixe).
 */

import { describe, it, expect } from "vitest";
import { draftBuste } from "../src/engine/pieces/buste";
import type { Measurements } from "../src/engine/measurements";
import { validateBounds } from "../src/engine/measurements";
import { METHOD } from "../src/engine/method";
import { dist } from "../src/engine/geometry/point";
import { startTangent, endTangent, curveToPolyline } from "../src/engine/geometry/curve";
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
  // extensions optionnelles (buste.md §Extensions hors livre) : présentes une
  // fois sur deux — les invariants doivent tenir avec ET sans
  if (rnd() < 0.5) m.aisance = half(range(0, 5));
  if (rnd() < 0.5) {
    // pente plausible : angle entre 12° et 32°, jamais au plafond de 45°
    m.penteEpaule = half(m.longueurEpaule * Math.sin((range(12, 32) * Math.PI) / 180));
  }
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

  it("épaule dos = mesure ; épaule devant (hors pince) = mesure − 1 (embu, p. 47)", () => {
    for (const m of bodies) {
      const { dos, devant } = draftBuste(m);
      const epauleDos = dist(dos.points["snp-dos"], dos.points["epaule-dos"]);
      const epauleDevant =
        dist(devant.points["snp-devant"], devant.points["pince-bretelle-1"]) +
        dist(devant.points["pince-bretelle-2"], devant.points["epaule-devant"]);
      expect(epauleDos).toBeCloseTo(m.longueurEpaule, 6);
      expect(epauleDevant).toBeCloseTo(m.longueurEpaule - METHOD.EMBU_EPAULE_DOS, 6);
      // pente mesurée → le dénivelé vertical de l'épaule dos est la mesure
      if (m.penteEpaule !== undefined) {
        expect(dos.points["epaule-dos"].y - dos.points["snp-dos"].y).toBeCloseTo(m.penteEpaule, 6);
      }
    }
  });

  it("jambes de pince égalisées et bouche = valeur", () => {
    for (const m of bodies) {
      const { dos, devant } = draftBuste(m);
      for (const piece of [dos, devant]) {
        for (const dart of piece.darts) {
          expect(dist(dart.legs[0], dart.apex)).toBeCloseTo(dist(dart.legs[1], dart.apex), 2);
          expect(dist(dart.legs[0], dart.legs[1])).toBeCloseTo(dart.value, 3);
        }
      }
    }
  });

  it("largeur à la taille = (taille + aisance)/4 ∓ 1, aux excédents signalés près", () => {
    for (const m of bodies) {
      const { dos, devant, report } = draftBuste(m);
      const get = (k: string) => report.values.find((v) => v.key === k)!.value;
      const tailleAisee = m.tourTaille + (m.aisance ?? 0);
      const U = Math.max(0, (m.tourPoitrine - m.tourTaille) / 4);
      const excedentDos = U - get("cote") - get("pinceDemiDos") - get("milieuDos");
      const excedentDevant = U - get("cote") - get("pinceDevant");
      const dosLargeur = dos.points["taille-cote-dos"].x - dos.points["taille-milieu-dos"].x - get("pinceDemiDos");
      const devantLargeur =
        devant.points["taille-milieu-devant"].x - devant.points["taille-cote-devant"].x - get("pinceDevant");
      expect(dosLargeur).toBeCloseTo(tailleAisee / 4 - 1 + Math.max(0, excedentDos), 6);
      expect(devantLargeur).toBeCloseTo(tailleAisee / 4 + 1 + Math.max(0, excedentDevant), 6);
    }
  });

  it("pinces de côté de même valeur → coutures de côté dos et devant de même longueur", () => {
    for (const m of bodies) {
      const { dos, devant } = draftBuste(m);
      const coteDos = segmentLength(dos.outline.find((s) => s.kind === "line" && s.a === dos.points["dessous-bras"])!);
      const coteDevant = segmentLength(
        devant.outline.find((s) => s.kind === "line" && s.a === devant.points["dessous-bras"])!,
      );
      expect(coteDos).toBeCloseTo(coteDevant, 6);
    }
  });

  it("nuque SOUS la ligne d'épaule ; encolures plates au milieu (nuque et gorge)", () => {
    for (const m of bodies.slice(0, 50)) {
      const { dos, devant } = draftBuste(m);
      expect(dos.points["nuque"].y).toBeGreaterThan(0);
      // tangente horizontale à la nuque (départ de l'encolure dos)
      const tDos = startTangent(dos.curves["encolure-dos"]);
      expect(Math.abs(tDos.y)).toBeLessThan(1e-6);
      // tangente horizontale à la gorge (départ de l'encolure devant)
      const tDev = startTangent(devant.curves["encolure-devant"]);
      expect(Math.abs(tDev.y)).toBeLessThan(1e-6);
    }
  });

  it("emmanchures : points imposés, queue léchant le repère de platitude, arrivée plate", () => {
    for (const m of bodies.slice(0, 50)) {
      const { dos, devant } = draftBuste(m);
      for (const [piece, ids, repereId] of [
        [dos, ["carrure-dos", "bissectrice-dos"], "platitude-dos"],
        [devant, ["carrure-devant", "bissectrice-devant"], "platitude-devant"],
      ] as const) {
        const junctions = piece.curves["emmanchure"].beziers.map((b) => b.p1);
        for (const id of ids) {
          const target = piece.points[id];
          const ok = junctions.some((j) => dist(j, target) < 1e-6);
          expect(ok, `${piece.id} passe par ${id}`).toBe(true);
        }
        const poly = curveToPolyline(piece.curves["emmanchure"], 64);
        // le repère de platitude n'est pas un point de passage exact : la
        // queue du balayage vient lécher la ligne à son niveau (≤ 3,5 mm sur
        // les mensurations extrêmes, l'aisance pouvant élargir le coin ; le
        // profil démo est testé à ≤ 1,2 mm — la priorité est la tenue du
        // virage, cf. golden anti-affaissement)
        const repere = piece.points[repereId];
        const ecart = Math.min(...poly.map((p) => dist(p, repere)));
        expect(ecart, `${piece.id} queue au repère de platitude`).toBeLessThan(0.35);
        const t = endTangent(piece.curves["emmanchure"]);
        expect(Math.abs(t.y), `${piece.id} arrivée plate`).toBeLessThan(1e-6);
        // jamais de ventre sous la ligne d'emmanchure (note buste.md §6/D7) ;
        // tolérance = précision de traçage (0,5 mm), les résidus flottants du
        // raccord tangent 45°/horizontale restant à l'échelle du micron
        const yLigne = piece.points["dessous-bras"].y;
        for (const p of poly) {
          expect(p.y, `${piece.id} au-dessus de la ligne d'emmanchure`).toBeLessThanOrEqual(yLigne + 0.05);
        }
      }
    }
  });

  it("les plafonds de pinces de la méthode ne sont jamais dépassés", () => {
    for (const m of bodies) {
      const { report } = draftBuste(m);
      const get = (k: string) => report.values.find((v) => v.key === k)!.value;
      expect(get("pinceDevant")).toBeLessThanOrEqual(METHOD.PLAFOND_PINCE_DEVANT);
      expect(get("pinceDemiDos")).toBeLessThanOrEqual(METHOD.PLAFOND_PINCE_DEMI_DOS);
      expect(get("milieuDos")).toBeLessThanOrEqual(METHOD.PLAFOND_MILIEU_DOS);
      expect(get("cote")).toBeLessThanOrEqual(METHOD.PLAFOND_COTE);
    }
  });
});
