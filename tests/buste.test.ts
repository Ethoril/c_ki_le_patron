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
import { dartOutline } from "../src/engine/drafting";
import { dist } from "../src/engine/geometry/point";
import { curveLength, curveToPolyline, endTangent, startTangent } from "../src/engine/geometry/curve";
import { isClosed } from "../src/engine/geometry/path";

// Les exemples chiffrés du livre supposent le patron de base SANS aisance ;
// le profil de démonstration porte l'aisance produit par défaut (2 cm).
const demo = { ...DEMO_MEASUREMENTS, aisance: 0 };

describe("profil de démonstration", () => {
  it("passe les bornes et la cohérence sans avertissement", () => {
    expect(validateBounds(DEMO_MEASUREMENTS)).toEqual([]);
    expect(checkCoherence(DEMO_MEASUREMENTS)).toEqual([]);
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
    // le rapport peut porter d'autres avertissements (ex. différence
    // d'emmanchure, C17) : seul celui des pinces est exclu ici
    expect(report.warnings.some((w) => w.code === "pince-supplementaire")).toBe(false);
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

  it("rétablissement post-bretelle (C11) : carrure et bissectrice devant aux positions d'origine, pince ouverte", () => {
    const largeurPlanche = demo.tourPoitrine / 2;
    expect(devant.points["carrure-devant"].x).toBeCloseTo(largeurPlanche - demo.carrureDevant / 2, 6);
    expect(devant.points["carrure-devant"].y).toBeCloseTo(demo.longueurDos / 3, 6);
    const coin = { x: largeurPlanche - demo.carrureDevant / 2, y: demo.longueurDos / 2 };
    expect(devant.points["bissectrice-devant"].x).toBeCloseTo(coin.x - METHOD.BISSECTRICE_EMMANCHURE_DEVANT * Math.SQRT1_2, 6);
    expect(devant.points["bissectrice-devant"].y).toBeCloseTo(coin.y - METHOD.BISSECTRICE_EMMANCHURE_DEVANT * Math.SQRT1_2, 6);
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

describe("golden : bas du buste jusqu'au bassin (92/68, p. 55-62 ; ét. 5 p. 33, ét. 11 p. 35)", () => {
  const { dos, devant, report } = draftBuste(demo);
  const yTaille = demo.longueurDos; // 41
  const yBassin = yTaille + METHOD.HAUTEUR_BASSIN_STANDARD; // hauteurBassin absente = 20
  const yPetitesHanches = yTaille + METHOD.HAUTEUR_BASSIN_STANDARD / 2;
  const largeurPlanche = demo.tourPoitrine / 2; // 44

  it("hauteur de bassin absente = standard 20 cm ; petites hanches à mi-distance (generalites §6, p. 24)", () => {
    expect(METHOD.HAUTEUR_BASSIN_STANDARD).toBe(20);
    expect(dos.points["bassin-cote"].y).toBeCloseTo(61, 6);
    expect(devant.points["bassin-cote"].y).toBeCloseTo(61, 6);
    // mesurée → elle remplace le standard
    const mesuree = draftBuste({ ...demo, hauteurBassin: 18 });
    expect(mesuree.dos.points["bassin-cote"].y).toBeCloseTo(41 + 18, 6);
    expect(reportValue(mesuree.report, "hauteurBassin")).toBe(18);
  });

  it("largeur au bassin : dos = bassin/4 − 1 sur la ligne de bassin (ét. 5), devant = bassin/4 + 1 (ét. 11)", () => {
    expect(dos.points["bassin-cote"].x).toBeCloseTo(92 / 4 - 1, 6); // 22
    expect(dos.points["bassin-milieu"].x).toBeCloseTo(0, 6);
    expect(dos.points["bassin-milieu"].y).toBeCloseTo(yBassin, 6);
    expect(largeurPlanche - devant.points["bassin-cote"].x).toBeCloseTo(92 / 4 + 1, 6); // 24
    expect(devant.points["bassin-milieu"].x).toBeCloseTo(largeurPlanche, 6);
  });

  it("répartition basse normative (p. 57, fig. 4) : U bas = 6 → côté 3, devant 3, demi-dos 2, milieu dos 1", () => {
    const r = repartirPincesTaille(6);
    expect(r.cote).toBe(3);
    expect(r.pinceDevant).toBe(3);
    expect(r.pinceDemiDos).toBe(2);
    expect(r.milieuDos).toBe(1);
    expect(r.pinceSupplementaire).toBe(false);
    // côté bas émergent du tracé = (bassin − poitrine)/4 + côté haut = 3 :
    // les deux calculs de la p. 57 aboutissent au même point de taille cintré
    expect(reportValue(report, "coteBas")).toBeCloseTo(3, 6);
    expect(dos.points["bassin-cote"].x - reportValue(report, "coteBas")).toBeCloseTo(
      dos.points["taille-cote-dos"].x,
      6,
    );
  });

  it("pinces prolongées en losange : devant 9 cm, demi-dos 11 cm sous la taille (p. 55)", () => {
    expect(METHOD.LONGUEUR_PINCE_DEVANT_SOUS_TAILLE).toBe(9);
    expect(METHOD.LONGUEUR_PINCE_DEMI_DOS_SOUS_TAILLE).toBe(11);
    const pDevant = devant.darts.find((d) => d.id === "pince-taille-devant")!;
    const pDemiDos = dos.darts.find((d) => d.id === "pince-demi-dos")!;
    expect(pDevant.apexBas!.x).toBeCloseTo(devant.points["saillant"].x, 6);
    expect(pDevant.apexBas!.y).toBeCloseTo(yTaille + 9, 6);
    expect(pDemiDos.apexBas!.x).toBeCloseTo(pDemiDos.apex.x, 6);
    expect(pDemiDos.apexBas!.y).toBeCloseTo(yTaille + 11, 6);
  });

  it("platitude des pinces à parts égales de part et d'autre de la taille (p. 59) — tracé en losange fermé", () => {
    const pince = dos.darts.find((d) => d.id === "pince-demi-dos")!;
    const demi = pince.platitude! / 2;
    const poly = dartOutline(pince);
    for (const leg of pince.legs) {
      expect(poly.some((p) => Math.abs(p.x - leg.x) < 1e-9 && Math.abs(p.y - (leg.y - demi)) < 1e-9)).toBe(true);
      expect(poly.some((p) => Math.abs(p.x - leg.x) < 1e-9 && Math.abs(p.y - (leg.y + demi)) < 1e-9)).toBe(true);
    }
    expect(poly[0]).toEqual(poly[poly.length - 1]); // losange fermé
  });

  it("couture de côté basse : verticale à la taille, jonction SOUS les petites hanches, tangente à la ligne (p. 61-62)", () => {
    for (const piece of [dos, devant]) {
      const c = piece.curves["cote-bas"];
      expect(Math.abs(startTangent(c).x), `${piece.id} presque droite à la taille`).toBeLessThan(1e-9);
      expect(Math.abs(endTangent(c).x), `${piece.id} arrivée tangente à la ligne de côté basse`).toBeLessThan(1e-9);
      const j = piece.points["jonction-cote-bas"];
      expect(j.y, `${piece.id} jonction sous les petites hanches`).toBeGreaterThan(yPetitesHanches);
      expect(j.x).toBeCloseTo(piece.points["bassin-cote"].x, 6);
    }
    // jonction à mi-distance petites hanches ↔ bassin [transcription]
    expect(dos.points["jonction-cote-bas"].y).toBeCloseTo(yTaille + 0.75 * METHOD.HAUTEUR_BASSIN_STANDARD, 6);
    // platitude de côté à cheval sur la taille (valeur 2 → platitude 3, p. 59)
    const demi = METHOD.PLATITUDE_PINCE(2) / 2;
    expect(dos.points["cote-platitude-haut"].y).toBeCloseTo(yTaille - demi, 6);
    expect(dos.points["cote-platitude-bas"].y).toBeCloseTo(yTaille + demi, 6);
    expect(dos.points["cote-platitude-haut"].x).toBeCloseTo(dos.points["taille-cote-dos"].x, 6);
  });

  it("cintrage milieu dos : rejoint x = 0 au niveau des petites hanches (p. 55)", () => {
    expect(dos.points["milieu-dos-petites-hanches"].x).toBeCloseTo(0, 6);
    expect(dos.points["milieu-dos-petites-hanches"].y).toBeCloseTo(yPetitesHanches, 6);
  });

  it("la ligne de taille n'est plus un bord de contour : c'est une référence (rouge)", () => {
    for (const piece of [dos, devant]) {
      for (const s of piece.outline) {
        if (s.kind === "line") {
          const horizontaleTaille =
            Math.abs(s.a.y - yTaille) < 1e-9 && Math.abs(s.b.y - yTaille) < 1e-9 && Math.abs(s.a.x - s.b.x) > 1e-9;
          expect(horizontaleTaille, `${piece.id} : segment de contour sur la ligne de taille`).toBe(false);
        }
      }
      const ref = piece.refLines.some(
        (r) => r.kind === "line" && Math.abs(r.a.y - yTaille) < 1e-9 && Math.abs(r.b.y - yTaille) < 1e-9,
      );
      expect(ref, `${piece.id} : ligne de taille en référence`).toBe(true);
    }
  });

  it("contours fermés jusqu'au bassin, aisance ajoutée au tour de bassin comme aux autres tours", () => {
    expect(isClosed(dos.outline, 1e-6)).toBe(true);
    expect(isClosed(devant.outline, 1e-6)).toBe(true);
    const avec = draftBuste({ ...demo, aisance: 2 });
    expect(avec.dos.points["bassin-cote"].x).toBeCloseTo((92 + 2) / 4 - 1, 6);
    expect((88 + 2) / 2 - avec.devant.points["bassin-cote"].x).toBeCloseTo((92 + 2) / 4 + 1, 6);
    // U bas reste sur les mesures du corps
    expect(reportValue(avec.report, "aAbsorberBas")).toBe(6);
    expect(reportValue(avec.report, "coteBas")).toBeCloseTo(3, 6);
  });
});

describe("golden : pointe de la pince devant — platitude de poitrine (C15, p. 75)", () => {
  it("sommet à 2 cm sous le saillant (valeur du livre, décision 2026-07-15) — jamais sur le saillant", () => {
    expect(METHOD.PLATITUDE_POITRINE).toBe(2);
    const { devant } = draftBuste(demo);
    const pince = devant.darts.find((d) => d.id === "pince-taille-devant")!;
    expect(pince.apex.x).toBeCloseTo(devant.points["saillant"].x, 6);
    expect(pince.apex.y - devant.points["saillant"].y).toBeCloseTo(METHOD.PLATITUDE_POITRINE, 6);
  });
});

describe("golden : haut de la pince demi-dos (C20, planches p. 55)", () => {
  it("sommet posé SUR la ligne d'emmanchure — borne haute, jamais au-dessus (décision 2026-07-15)", () => {
    expect(METHOD.SOMMET_PINCE_DEMI_DOS_SOUS_EMMANCHURE).toBe(0);
    const { dos } = draftBuste(demo);
    const pince = dos.darts.find((d) => d.id === "pince-demi-dos")!;
    expect(pince.apex.y).toBeCloseTo(demo.longueurDos / 2 + METHOD.SOMMET_PINCE_DEMI_DOS_SOUS_EMMANCHURE, 6);
  });
});

describe("golden : contrôle des longueurs d'emmanchure (C17, p. 65)", () => {
  it("la plage normale de la méthode est [1, 2] cm", () => {
    expect(METHOD.DIFFERENCE_EMMANCHURE_MIN).toBe(1);
    expect(METHOD.DIFFERENCE_EMMANCHURE_MAX).toBe(2);
  });

  it("profil démo : différence ≈ 2,9 cm hors plage → avertissement NON bloquant", () => {
    // constat documenté à l'audit du 2026-07-14 : le tracé v1 (pince d'épaule
    // dos absorbée, tensions actuelles) produit un écart au-delà des 2 cm du
    // livre — le contrôle sert précisément à le signaler, sans bloquer
    const { report } = draftBuste(demo);
    const diff = Math.abs(reportValue(report, "emmanchureDos") - reportValue(report, "emmanchureDevant"));
    expect(diff).toBeGreaterThan(METHOD.DIFFERENCE_EMMANCHURE_MAX);
    expect(report.warnings.some((w) => w.code === "difference-emmanchure")).toBe(true);
  });
});

describe("golden : forme de l'encolure devant (C16 + continuité, p. 63-64)", () => {
  const { dos, devant } = draftBuste(demo);
  const snp = devant.points["snp-devant"];
  const gorge = devant.points["gorge"];
  const prof = gorge.y - snp.y;
  const larg = gorge.x - snp.x;

  it("arrive PERPENDICULAIRE à la ligne d'épaule devant (continuité à travers la couture)", () => {
    const t = endTangent(devant.curves["encolure-devant"]);
    expect((Math.atan2(t.y, t.x) * 180) / Math.PI).toBeCloseTo(-(90 + 26), 6);
    // le dos arrive lui aussi ⊥ à sa propre épaule : assemblés, les deux
    // courbes traversent la couture sans cassure (critère p. 63-64)
    const tDos = endTangent(dos.curves["encolure-dos"]);
    expect((Math.atan2(tDos.y, tDos.x) * 180) / Math.PI).toBeCloseTo(-(90 - 18), 6);
  });

  it("suit la verticale d'encolure sur ≈ profondeur/3 sous le point d'épaule (écart ≤ 2 mm, jamais au-delà)", () => {
    const poly = curveToPolyline(devant.curves["encolure-devant"], 256);
    const yV = snp.y + prof * METHOD.PLATITUDE_ENCOLURE_DEVANT;
    const zone = poly.filter((p) => p.y <= yV + 1e-9);
    expect(zone.length).toBeGreaterThan(4);
    for (const p of zone) {
      expect(p.x - snp.x).toBeGreaterThanOrEqual(-1e-6); // ne jamais échancrer au-delà de la verticale
      expect(p.x - snp.x).toBeLessThanOrEqual(0.2);
    }
  });

  it("platitude ≈ largeur/3 sur la ligne de gorge, et ne descend jamais sous la gorge", () => {
    const poly = curveToPolyline(devant.curves["encolure-devant"], 256);
    const xH = gorge.x - larg * METHOD.PLATITUDE_ENCOLURE_DEVANT;
    for (const p of poly.filter((p) => p.x >= xH - 1e-9)) {
      expect(Math.abs(p.y - gorge.y)).toBeLessThanOrEqual(0.01);
    }
    for (const p of poly) expect(p.y).toBeLessThanOrEqual(gorge.y + 1e-9);
  });
});

describe("extension : aisance globale (buste.md §Extensions hors livre)", () => {
  const avec = draftBuste({ ...demo, aisance: 2 });

  it("élargit les tours : côté à (poitrine + aisance)/4 − 1, milieu devant à (poitrine + aisance)/2", () => {
    expect(avec.dos.points["dessous-bras"].x).toBeCloseTo((88 + 2) / 4 - 1, 6);
    expect(avec.devant.points["taille-milieu-devant"].x).toBeCloseTo((88 + 2) / 2, 6);
  });

  it("U et la répartition des pinces ne bougent pas (même aisance aux deux tours)", () => {
    expect(reportValue(avec.report, "aAbsorberHaut")).toBe(5);
    expect(reportValue(avec.report, "cote")).toBe(2);
    expect(reportValue(avec.report, "pinceDevant")).toBe(3);
  });

  it("largeur à la taille après pinces = (taille + aisance)/4 ∓ 1", () => {
    const dosLargeur = avec.dos.points["taille-cote-dos"].x - avec.dos.points["taille-milieu-dos"].x - 2;
    const devantLargeur =
      avec.devant.points["taille-milieu-devant"].x - avec.devant.points["taille-cote-devant"].x - 3;
    expect(dosLargeur).toBeCloseTo((68 + 2) / 4 - 1, 6);
    expect(devantLargeur).toBeCloseTo((68 + 2) / 4 + 1, 6);
  });

  it("les mesures du corps ne sont jamais élargies : encolure, carrure, pince bretelle", () => {
    expect(reportValue(avec.report, "largeurEncolure")).toBeCloseTo(38 / 6 + 1, 6);
    expect(avec.dos.points["carrure-dos"].x).toBeCloseTo(35 / 2, 6);
    expect(reportValue(avec.report, "pinceBretelle")).toBeCloseTo(5.4, 6);
  });

  it("aisance absente (ancien profil) = aisance 0 = tracé du livre au point près", () => {
    const reference = draftBuste(demo);
    const absente = draftBuste({ ...demo, aisance: undefined });
    for (const [id, p] of Object.entries(reference.dos.points)) {
      expect(absente.dos.points[id]).toEqual(p);
    }
    for (const [id, p] of Object.entries(reference.devant.points)) {
      expect(absente.devant.points[id]).toEqual(p);
    }
  });
});

describe("extension : pente d'épaule mesurée (buste.md §Extensions hors livre)", () => {
  it("non renseignée : angles du livre 18°/26° au rapport", () => {
    const { report } = draftBuste(demo);
    expect(reportValue(report, "angleEpauleDos")).toBe(18);
    expect(reportValue(report, "angleEpauleDevant")).toBe(26);
  });

  it("pente = épaule × sin(18°) → tracé identique au défaut", () => {
    const reference = draftBuste(demo);
    const avec = draftBuste({ ...demo, penteEpaule: 13 * Math.sin((18 * Math.PI) / 180) });
    expect(avec.dos.points["epaule-dos"].x).toBeCloseTo(reference.dos.points["epaule-dos"].x, 9);
    expect(avec.dos.points["epaule-dos"].y).toBeCloseTo(reference.dos.points["epaule-dos"].y, 9);
    expect(avec.devant.points["epaule-devant"].x).toBeCloseTo(reference.devant.points["epaule-devant"].x, 9);
    expect(avec.devant.points["epaule-devant"].y).toBeCloseTo(reference.devant.points["epaule-devant"].y, 9);
  });

  it("pente 5 : dénivelé d'épaule dos = 5 cm exactement, devant = angle dos + 8°", () => {
    const avec = draftBuste({ ...demo, penteEpaule: 5 });
    expect(avec.dos.points["epaule-dos"].y).toBeCloseTo(5, 6);
    const angleDos = (Math.asin(5 / 13) * 180) / Math.PI;
    expect(reportValue(avec.report, "angleEpauleDos")).toBeCloseTo(angleDos, 6);
    expect(reportValue(avec.report, "angleEpauleDevant")).toBeCloseTo(angleDos + 8, 6);
    // l'angle devant se lit sur la première moitié d'épaule (non pivotée)
    const snp = avec.devant.points["snp-devant"];
    const pb1 = avec.devant.points["pince-bretelle-1"];
    const mesure = (Math.atan2(pb1.y - snp.y, snp.x - pb1.x) * 180) / Math.PI;
    expect(mesure).toBeCloseTo(angleDos + 8, 6);
  });

  it("pente incohérente avec la longueur d'épaule : plafonnée à 45°, avertissement émis", () => {
    const avec = draftBuste({ ...demo, penteEpaule: 12 });
    expect(reportValue(avec.report, "angleEpauleDos")).toBeCloseTo(45, 6);
    expect(avec.report.warnings.some((w) => w.code === "pente-epaule-plafonnee")).toBe(true);
  });
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
