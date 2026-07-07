/**
 * Golden tests : les exemples chiffrés du livre (cahier §4.5.1, transcription
 * v2 de docs/methode/buste.md). Tour de cou 38 → largeur d'encolure 7,33,
 * profondeur dos 2,375, profondeur devant 9,33 (valeurs EXACTES, l'arrondi
 * 7,5/2,5/9,5 est d'affichage). Poitrine 88 → pince bretelle 5,4.
 * Poitrine 88 / taille 68 / bassin 92 → U = 5 en haut, 6 en bas ; répartition
 * normative p. 57 : côté 2, devant 3, demi-dos 2, milieu dos 1.
 */

import { describe, it, expect } from "vitest";
import { draftBuste, reportValue } from "../src/engine/pieces/buste";
import { DEMO_MEASUREMENTS, checkCoherence, validateBounds } from "../src/engine/measurements";
import { repartirPincesTaille, METHOD } from "../src/engine/method";
import { generate } from "../src/engine/generate";
import { dist } from "../src/engine/geometry/point";
import { curveLength, curveToPolyline } from "../src/engine/geometry/curve";
import { isClosed } from "../src/engine/geometry/path";

const demo = DEMO_MEASUREMENTS;

describe("profil de démonstration", () => {
  it("passe les bornes et la cohérence sans avertissement", () => {
    expect(validateBounds(demo)).toEqual([]);
    expect(checkCoherence(demo)).toEqual([]);
  });
});

describe("golden : encolure (tour de cou 38, p. 39-40)", () => {
  const { report } = draftBuste(demo);

  it("largeur d'encolure = cou/6 + 1 = 7,33 exact (affiché 7,5)", () => {
    expect(reportValue(report, "largeurEncolure")).toBeCloseTo(38 / 6 + 1, 6);
    expect(METHOD.ARRONDI_AFFICHAGE(reportValue(report, "largeurEncolure"))).toBe(7.5);
  });

  it("profondeur d'encolure dos = cou/16 = 2,375 exact (affiché 2,5)", () => {
    expect(reportValue(report, "profEncolureDos")).toBeCloseTo(2.375, 6);
    expect(METHOD.ARRONDI_AFFICHAGE(reportValue(report, "profEncolureDos"))).toBe(2.5);
  });

  it("profondeur d'encolure devant = largeur exacte + 2 = 9,33 (affiché 9,5)", () => {
    expect(reportValue(report, "profEncolureDevant")).toBeCloseTo(38 / 6 + 3, 6);
    expect(METHOD.ARRONDI_AFFICHAGE(reportValue(report, "profEncolureDevant"))).toBe(9.5);
  });
});

describe("golden : pince bretelle (poitrine 88, p. 52)", () => {
  const { report, devant } = draftBuste(demo);

  it("valeur = poitrine/20 + 1 = 5,4", () => {
    expect(reportValue(report, "pinceBretelle")).toBeCloseTo(5.4, 6);
  });

  it("jambes égalisées sur la première, bouche = valeur", () => {
    const pb = devant.darts.find((d) => d.id === "pince-bretelle")!;
    expect(dist(pb.legs[0], pb.apex)).toBeCloseTo(dist(pb.legs[1], pb.apex), 6);
    expect(dist(pb.legs[0], pb.legs[1])).toBeCloseTo(5.4, 3);
  });
});

describe("golden : pinces de taille (88/68/92, p. 54-58)", () => {
  const { report } = draftBuste(demo);

  it("5 cm à absorber par quart en haut, 6 cm en bas", () => {
    expect(reportValue(report, "aAbsorberHaut")).toBe(5);
    expect(reportValue(report, "aAbsorberBas")).toBe(6);
  });

  it("répartition normative (p. 57, fig. 3) : côté 2, devant 3, demi-dos 2, milieu dos 1", () => {
    expect(reportValue(report, "cote")).toBe(2);
    expect(reportValue(report, "pinceDevant")).toBe(3);
    expect(reportValue(report, "pinceDemiDos")).toBe(2);
    expect(reportValue(report, "milieuDos")).toBe(1);
  });

  it("aucun avertissement de pince supplémentaire", () => {
    expect(report.warnings).toEqual([]);
  });
});

describe("golden : points de construction du profil démo (v2)", () => {
  const { dos, devant } = draftBuste(demo);
  const yTaille = demo.longueurDos; // C1 : longueur dos depuis la ligne d'épaule
  const xCote = demo.tourPoitrine / 4 - 1; // C5 : largeur dos = poitrine/4 − 1

  it("dos : nuque SOUS la ligne d'épaule, point d'encolure SUR la ligne (C2)", () => {
    expect(dos.points["nuque"].x).toBeCloseTo(0);
    expect(dos.points["nuque"].y).toBeCloseTo(2.375, 6);
    expect(dos.points["snp-dos"].x).toBeCloseTo(38 / 6 + 1, 6);
    expect(dos.points["snp-dos"].y).toBeCloseTo(0);
  });

  it("dos : extrémité d'épaule à 18°, longueur épaule mesurée", () => {
    const lEnc = 38 / 6 + 1;
    expect(dos.points["epaule-dos"].x).toBeCloseTo(lEnc + 13 * Math.cos((18 * Math.PI) / 180), 3);
    expect(dos.points["epaule-dos"].y).toBeCloseTo(13 * Math.sin((18 * Math.PI) / 180), 3);
  });

  it("lignes du gabarit : emmanchure = longueur dos/2, carrure = longueur dos/3 (C3, C4)", () => {
    expect(dos.points["dessous-bras"].y).toBeCloseTo(demo.longueurDos / 2, 6);
    expect(dos.points["carrure-dos"].y).toBeCloseTo(demo.longueurDos / 3, 6);
    expect(dos.points["carrure-dos"].x).toBeCloseTo(demo.carrureDos / 2, 6);
  });

  it("lignes de côté dos et devant coïncident à poitrine/4 − 1 (C5)", () => {
    expect(dos.points["dessous-bras"].x).toBeCloseTo(xCote, 6);
    expect(devant.points["dessous-bras"].x).toBeCloseTo(xCote, 6);
    expect(devant.points["dessous-bras"].y).toBeCloseTo(dos.points["dessous-bras"].y, 6);
  });

  it("devant : saillant à écart/2 du milieu, hauteur de poitrine VERTICALE (C7)", () => {
    const saillant = devant.points["saillant"];
    const yEpauleDevant = yTaille - demo.longueurDevant;
    expect(saillant.x).toBeCloseTo(demo.tourPoitrine / 2 - demo.ecartPoitrine / 2, 6);
    expect(saillant.y).toBeCloseTo(yEpauleDevant + demo.hauteurPoitrine, 6);
  });

  it("largeur à la taille après pinces : dos = taille/4 − 1, devant = taille/4 + 1", () => {
    const dosLargeur = dos.points["taille-cote-dos"].x - dos.points["taille-milieu-dos"].x - 2; // pince demi-dos
    const devantLargeur =
      devant.points["taille-milieu-devant"].x - devant.points["taille-cote-devant"].x - 3; // pince devant
    expect(dosLargeur).toBeCloseTo(demo.tourTaille / 4 - 1, 6);
    expect(devantLargeur).toBeCloseTo(demo.tourTaille / 4 + 1, 6);
    expect(dos.points["taille-milieu-dos"].y).toBeCloseTo(yTaille);
  });

  it("épaule devant = épaule − 1 (embu de la pince d'épaule dos absorbée, C9)", () => {
    const l1 = dist(devant.points["snp-devant"], devant.points["pince-bretelle-1"]);
    const l2 = dist(devant.points["pince-bretelle-2"], devant.points["epaule-devant"]);
    expect(l1 + l2).toBeCloseTo(demo.longueurEpaule - METHOD.EMBU_EPAULE_DOS, 6);
  });

  it("contours fermés", () => {
    expect(isClosed(dos.outline, 1e-6)).toBe(true);
    expect(isClosed(devant.outline, 1e-6)).toBe(true);
  });
});

describe("golden : allure du bas d'emmanchure (p. 42-44, note §6/D7)", () => {
  const { dos, devant } = draftBuste(demo);
  // spline épaule → carrure → bissectrice, puis UNE cubique bissectrice →
  // dessous-bras : beziers[2] est tout le virage, sans jonction intermédiaire
  const cas = [
    { nom: "dos", piece: dos, sens: 1 },
    { nom: "devant", piece: devant, sens: -1 },
  ] as const;

  for (const { nom, piece, sens } of cas) {
    const c = piece.curves["emmanchure"];

    it(`${nom} : la courbe coupe la bissectrice à angle droit (tangente à 45°)`, () => {
      const b = c.beziers[2];
      expect(b.p0).toEqual(piece.points[`bissectrice-${nom}`]);
      const t = { x: b.c1.x - b.p0.x, y: b.c1.y - b.p0.y };
      const attendu = (METHOD.TANGENTE_BISSECTRICE_DEG * Math.PI) / 180;
      expect(Math.atan2(t.y, sens * t.x)).toBeCloseTo(attendu, 9);
    });

    it(`${nom} : un seul balayage bissectrice → côté, arrivée exactement horizontale`, () => {
      const b = c.beziers[c.beziers.length - 1];
      expect(b.p0).toEqual(piece.points[`bissectrice-${nom}`]);
      expect(b.p1).toEqual(piece.points["dessous-bras"]);
      expect(b.c2.y).toBeCloseTo(piece.points["dessous-bras"].y, 9); // tangente d'arrivée horizontale
    });

    it(`${nom} : raccord C1 à la bissectrice (même poignée de part et d'autre)`, () => {
      // pas de saut de courbure perceptible : direction ET vitesse continues
      const avant = c.beziers[1];
      const apres = c.beziers[2];
      expect(apres.p0.x - avant.c2.x).toBeCloseTo(apres.c1.x - apres.p0.x, 9);
      expect(apres.p0.y - avant.c2.y).toBeCloseTo(apres.c1.y - apres.p0.y, 9);
    });

    it(`${nom} : la queue du virage lèche la ligne au repère de platitude (≤ 1,2 mm)`, () => {
      const repere = piece.points[`platitude-${nom}`];
      const poly = curveToPolyline(c, 256);
      const ecart = Math.min(...poly.map((p) => dist(p, repere)));
      expect(ecart).toBeLessThan(0.12);
    });

    it(`${nom} : le virage tient sa hauteur (≥ 0,35 cm au-dessus de la ligne à mi-chemin)`, () => {
      // anti-affaissement : la courbe ne doit pas retomber sur la ligne dès la
      // bissectrice (l'effet « écrasé » des premières versions)
      const bis = piece.points[`bissectrice-${nom}`];
      const repere = piece.points[`platitude-${nom}`];
      const yLigne = piece.points["dessous-bras"].y;
      const xMi = (bis.x + repere.x) / 2;
      const poly = curveToPolyline(c, 256);
      for (let i = 1; i < poly.length; i++) {
        if ((poly[i - 1].x - xMi) * (poly[i].x - xMi) <= 0 && poly[i].y > bis.y) {
          expect(yLigne - (poly[i - 1].y + poly[i].y) / 2).toBeGreaterThan(0.35);
        }
      }
    });

    it(`${nom} : la courbe ne plonge jamais sous la ligne d'emmanchure (pas de ventre avant le coin)`, () => {
      // régression : l'ancienne tangente Catmull-Rom (trop raide au point de
      // bissectrice) faisait passer le dos SOUS la ligne, d'où l'arrivée écrasée
      const yLigne = piece.points["dessous-bras"].y;
      for (const p of curveToPolyline(c, 128)) expect(p.y).toBeLessThanOrEqual(yLigne + 1e-9);
    });
  }
});

describe("répartition des pinces de taille : cas extrêmes (fonction pure)", () => {
  it("rien à absorber → tout à zéro, pas de pince supplémentaire", () => {
    const r = repartirPincesTaille(0);
    expect(r).toMatchObject({ cote: 0, pinceDevant: 0, pinceDemiDos: 0, milieuDos: 0 });
    expect(r.pinceSupplementaire).toBe(false);
  });

  it("U = 5 : exemple normatif du livre (p. 57)", () => {
    const r = repartirPincesTaille(5);
    expect(r.cote).toBe(2);
    expect(r.pinceDevant).toBe(3);
    expect(r.pinceDemiDos).toBe(2);
    expect(r.milieuDos).toBe(1);
    expect(r.pinceSupplementaire).toBe(false);
  });

  it("U = 8 : côté saturé à 4, pince supplémentaire demandée", () => {
    const r = repartirPincesTaille(8);
    expect(r.cote).toBe(METHOD.PLAFOND_COTE);
    expect(r.pinceDevant).toBe(METHOD.PLAFOND_PINCE_DEVANT);
    expect(r.excedentDevant).toBeCloseTo(1);
    expect(r.pinceSupplementaire).toBe(true);
  });

  it("la somme répartie + excédents = U de chaque côté de la planche", () => {
    for (const U of [0, 1.5, 3, 5, 6.5, 8, 12]) {
      const r = repartirPincesTaille(U);
      expect(r.cote + r.pinceDevant + r.excedentDevant).toBeCloseTo(U, 9);
      expect(r.cote + r.pinceDemiDos + r.milieuDos + r.excedentDos).toBeCloseTo(U, 9);
    }
  });

  it("profil serré : avertissement structuré émis par le moteur", () => {
    const { report } = draftBuste({ ...demo, tourTaille: 56 });
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
    // ordre de grandeur anatomique pour une poitrine 88
    expect(attendu).toBeGreaterThan(30);
    expect(attendu).toBeLessThan(50);
  });
});
