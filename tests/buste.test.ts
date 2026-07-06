/**
 * Golden tests : les exemples chiffrés du livre (cahier §4.5.1).
 * Tour de cou 38 → largeur d'encolure 7,33 (arrondie 7,5), profondeur dos 2,38
 * (arrondie 2,5), profondeur devant 9,5. Poitrine 88 / taille 68 / bassin 92 →
 * 5 cm à absorber par quart en haut, 6 cm en bas.
 */

import { describe, it, expect } from "vitest";
import { draftBuste, reportValue } from "../src/engine/pieces/buste";
import { DEMO_MEASUREMENTS, checkCoherence, validateBounds } from "../src/engine/measurements";
import { repartirPinces, METHOD } from "../src/engine/method";
import { generate } from "../src/engine/generate";
import { dist } from "../src/engine/geometry/point";
import { curveLength } from "../src/engine/geometry/curve";
import { isClosed } from "../src/engine/geometry/path";

const demo = DEMO_MEASUREMENTS;

describe("profil de démonstration", () => {
  it("passe les bornes et la cohérence sans avertissement", () => {
    expect(validateBounds(demo)).toEqual([]);
    expect(checkCoherence(demo)).toEqual([]);
  });
});

describe("golden : encolure (tour de cou 38)", () => {
  const { report } = draftBuste(demo);

  it("largeur d'encolure = cou/6 + 1 = 7,33, arrondie 7,5", () => {
    expect(reportValue(report, "largeurEncolure")).toBeCloseTo(7.33, 2);
    expect(reportValue(report, "largeurEncolureArrondie")).toBe(7.5);
  });

  it("profondeur d'encolure dos = cou/16 = 2,38, arrondie 2,5", () => {
    expect(reportValue(report, "profEncolureDos")).toBeCloseTo(2.38, 2);
    expect(reportValue(report, "profEncolureDosArrondie")).toBe(2.5);
  });

  it("profondeur d'encolure devant = 9,5", () => {
    expect(reportValue(report, "profEncolureDevant")).toBe(9.5);
  });
});

describe("golden : pinces de taille (poitrine 88 / taille 68 / bassin 92)", () => {
  const { report } = draftBuste(demo);

  it("5 cm à absorber par quart en haut, 6 cm en bas", () => {
    expect(reportValue(report, "aAbsorberHaut")).toBe(5);
    expect(reportValue(report, "aAbsorberBas")).toBe(6);
  });

  it("répartition dos : côté 2 + pince demi-dos 2 + milieu dos 1 (plafonds respectés)", () => {
    expect(reportValue(report, "coteDos")).toBe(2);
    expect(reportValue(report, "pinceDos")).toBe(2);
    expect(reportValue(report, "milieuDos")).toBe(1);
  });

  it("répartition devant : côté 2 + pince devant 3", () => {
    expect(reportValue(report, "coteDevant")).toBe(2);
    expect(reportValue(report, "pinceDevant")).toBe(3);
  });

  it("aucun excédent : pas d'avertissement de pince supplémentaire", () => {
    expect(report.warnings).toEqual([]);
  });
});

describe("golden : points de construction du profil démo", () => {
  const { dos, devant } = draftBuste(demo);
  const yTaille = 2.5 + demo.longueurDos; // profondeur encolure dos arrondie + longueur dos

  it("dos : nuque, point d'encolure, extrémité d'épaule à 18°", () => {
    expect(dos.points["nuque"].x).toBeCloseTo(0);
    expect(dos.points["nuque"].y).toBeCloseTo(2.5);
    expect(dos.points["snp-dos"].x).toBeCloseTo(7.5);
    expect(dos.points["snp-dos"].y).toBeCloseTo(0);
    // épaule 13 cm à 18° : (7,5 + 13·cos18, 13·sin18)
    expect(dos.points["epaule-dos"].x).toBeCloseTo(7.5 + 13 * Math.cos((18 * Math.PI) / 180), 3);
    expect(dos.points["epaule-dos"].y).toBeCloseTo(13 * Math.sin((18 * Math.PI) / 180), 3);
  });

  it("devant : saillant à écart/2 du milieu, à hauteur de poitrine du point d'encolure", () => {
    const saillant = devant.points["saillant"];
    expect(saillant.x).toBeCloseTo(demo.tourPoitrine / 2 - demo.ecartPoitrine / 2);
    expect(dist(devant.points["snp-devant"], saillant)).toBeCloseTo(demo.hauteurPoitrine, 3);
  });

  it("la ligne de poitrine est commune aux deux pièces", () => {
    expect(dos.points["dessous-bras"].y).toBeCloseTo(devant.points["dessous-bras"].y, 6);
    expect(dos.points["dessous-bras"].x).toBeCloseTo(demo.tourPoitrine / 4);
  });

  it("largeur à la taille après pinces = tour de taille / 4 (17 cm) sur chaque pièce", () => {
    const dosLargeur =
      dos.points["taille-cote-dos"].x - dos.points["taille-milieu-dos"].x - 2; // pince demi-dos 2
    const devantLargeur =
      devant.points["taille-milieu-devant"].x - devant.points["taille-cote-devant"].x - 3; // pince devant 3
    expect(dosLargeur).toBeCloseTo(demo.tourTaille / 4, 6);
    expect(devantLargeur).toBeCloseTo(demo.tourTaille / 4, 6);
    expect(dos.points["taille-milieu-dos"].y).toBeCloseTo(yTaille);
  });

  it("pince bretelle : jambes égalisées, valeur de la méthode", () => {
    const pb = devant.darts.find((d) => d.id === "pince-bretelle")!;
    expect(pb.value).toBe(METHOD.PINCE_BRETELLE);
    expect(dist(pb.legs[0], pb.apex)).toBeCloseTo(dist(pb.legs[1], pb.apex), 6);
    expect(dist(pb.legs[0], pb.legs[1])).toBeCloseTo(METHOD.PINCE_BRETELLE, 3);
  });

  it("contours fermés", () => {
    expect(isClosed(dos.outline, 1e-6)).toBe(true);
    expect(isClosed(devant.outline, 1e-6)).toBe(true);
  });
});

describe("répartition des pinces : cas extrêmes (fonction pure)", () => {
  it("rien à absorber → tout à zéro", () => {
    expect(repartirPinces(0, "dos")).toEqual({ cote: 0, pince: 0, milieuDos: 0, excedent: 0 });
    expect(repartirPinces(0, "devant")).toEqual({ cote: 0, pince: 0, milieuDos: 0, excedent: 0 });
  });

  it("forte différence poitrine/taille : plafonds saturés, excédent signalé", () => {
    const dos = repartirPinces(10, "dos");
    expect(dos.cote).toBe(METHOD.PLAFOND_COTE_PAR_PIECE);
    expect(dos.pince).toBe(METHOD.PLAFOND_PINCE_DEMI_DOS);
    expect(dos.milieuDos).toBe(METHOD.PLAFOND_MILIEU_DOS);
    expect(dos.excedent).toBeCloseTo(4);

    const devant = repartirPinces(10, "devant");
    expect(devant.cote).toBe(METHOD.PLAFOND_COTE_PAR_PIECE);
    expect(devant.pince).toBe(METHOD.PLAFOND_PINCE_DEVANT);
    expect(devant.milieuDos).toBe(0);
    expect(devant.excedent).toBeCloseTo(5);
  });

  it("la somme répartie + excédent = valeur à absorber", () => {
    for (const v of [0, 1.5, 3, 5, 6.5, 9, 12]) {
      for (const piece of ["dos", "devant"] as const) {
        const r = repartirPinces(v, piece);
        expect(r.cote + r.pince + r.milieuDos + r.excedent).toBeCloseTo(v, 9);
      }
    }
  });

  it("excédent du profil démo poussé : avertissement structuré émis", () => {
    const { report } = draftBuste({ ...demo, tourTaille: 46 });
    expect(report.warnings.some((w) => w.code === "pince-supplementaire")).toBe(true);
  });
});

describe("dépendance inter-pièces : emmanchure mesurée sur le tracé", () => {
  it("generate() expose la longueur d'emmanchure totale = dos + devant mesurées", () => {
    const pattern = generate(demo);
    const dos = pattern.pieces.find((p) => p.id === "buste-dos")!;
    const devant = pattern.pieces.find((p) => p.id === "buste-devant")!;
    const attendu = curveLength(dos.curves["emmanchure"]) + curveLength(devant.curves["emmanchure"]);
    expect(pattern.interPieces.longueurEmmanchureTotale).toBeCloseTo(attendu, 6);
    // ordre de grandeur anatomique : une emmanchure de buste 88 fait 38-48 cm
    expect(attendu).toBeGreaterThan(30);
    expect(attendu).toBeLessThan(55);
  });
});
