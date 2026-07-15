/**
 * Mise en planche : les pièces ne doivent JAMAIS se chevaucher, quelles que
 * soient les mesures (épaules longues, pince bretelle large…).
 */

import { describe, it, expect } from "vitest";
import { generate } from "../src/engine/generate";
import { draftBuste } from "../src/engine/pieces/buste";
import { translatePiece, ECART_PIECES } from "../src/engine/layout";
import { DEMO_MEASUREMENTS } from "../src/engine/measurements";
import { boundingBox } from "../src/engine/geometry/path";
import { curveLength } from "../src/engine/geometry/curve";

const demo = DEMO_MEASUREMENTS;

describe("translatePiece", () => {
  it("translate toute la géométrie sans la déformer", () => {
    const { dos } = draftBuste(demo);
    const moved = translatePiece(dos, 10, 2);
    const bb = boundingBox(dos.outline);
    const mb = boundingBox(moved.outline);
    expect(mb.min.x).toBeCloseTo(bb.min.x + 10, 6);
    expect(mb.min.y).toBeCloseTo(bb.min.y + 2, 6);
    expect(moved.points["snp-dos"].x).toBeCloseTo(dos.points["snp-dos"].x + 10, 6);
    expect(curveLength(moved.curves["emmanchure"])).toBeCloseTo(curveLength(dos.curves["emmanchure"]), 6);
  });

  it("translate AUSSI le sommet bas des pinces en losange (régression : losange déformé à l'export)", () => {
    const { dos } = draftBuste(demo);
    const pince = dos.darts.find((d) => d.id === "pince-demi-dos")!;
    const moved = translatePiece(dos, 10, 2).darts.find((d) => d.id === "pince-demi-dos")!;
    expect(moved.apexBas!.x).toBeCloseTo(pince.apexBas!.x + 10, 6);
    expect(moved.apexBas!.y).toBeCloseTo(pince.apexBas!.y + 2, 6);
  });
});

describe("layoutPieces : jamais de chevauchement", () => {
  it("profil démo : blanc d'exactement ECART_PIECES entre les boîtes englobantes", () => {
    const [dos, devant] = generate(demo).pieces;
    const bbDos = boundingBox(dos.outline);
    const bbDevant = boundingBox(devant.outline);
    expect(bbDevant.min.x - bbDos.max.x).toBeCloseTo(ECART_PIECES, 6);
  });

  it("épaule longue (le cas du chevauchement constaté) : pièces disjointes", () => {
    const m = { ...demo, longueurEpaule: 18 };
    const [dos, devant] = generate(m).pieces;
    const bbDos = boundingBox(dos.outline);
    const bbDevant = boundingBox(devant.outline);
    expect(bbDevant.min.x - bbDos.max.x).toBeGreaterThanOrEqual(ECART_PIECES - 1e-6);
  });

  it("mesures extrêmes : poitrine étroite + épaules longues + grosse pince bretelle", () => {
    const m = { ...demo, tourPoitrine: 78, tourTaille: 62, tourCou: 42, longueurEpaule: 19 };
    const [dos, devant] = generate(m).pieces;
    const bbDos = boundingBox(dos.outline);
    const bbDevant = boundingBox(devant.outline);
    expect(bbDevant.min.x - bbDos.max.x).toBeGreaterThanOrEqual(ECART_PIECES - 1e-6);
  });

  it("la mise en planche ne change pas les longueurs mesurées (emmanchure pour la manche)", () => {
    const brut = draftBuste(demo);
    const attendu =
      curveLength(brut.dos.curves["emmanchure"]) + curveLength(brut.devant.curves["emmanchure"]);
    expect(generate(demo).interPieces.longueurEmmanchureTotale).toBeCloseTo(attendu, 6);
  });
});
