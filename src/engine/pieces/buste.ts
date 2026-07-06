/**
 * Construction du buste de base (demi-dos + demi-devant), transcription
 * linéaire de docs/methode/buste.md — qui fait autorité sur ce fichier.
 * Chaque bloc est numéroté comme dans la note de méthode (dos 1-8, devant D1-D9).
 *
 * ⚠ Références de pages du livre à compléter lors de la validation de la
 * transcription (marqueurs [À VALIDER] dans docs/methode/buste.md).
 */

import type { Pt } from "../geometry/point";
import { pt, polar, dist, rotateAround, scale } from "../geometry/point";
import { splineThrough, hermite, curveLength } from "../geometry/curve";
import { Draft } from "../drafting";
import { METHOD, repartirPinces } from "../method";
import type { Measurements } from "../measurements";
import type { PatternPiece, DraftReport, DraftWarning, ReportValue } from "../types";

export type BusteResult = { dos: PatternPiece; devant: PatternPiece; report: DraftReport };

/** Courbe d'encolure : tangente `t0` au départ, arrivée perpendiculaire à l'épaule. */
function neckCurve(from: Pt, t0: Pt, to: Pt, arriveDir: Pt) {
  const chord = dist(from, to);
  return hermite(from, scale(t0, chord), to, scale(arriveDir, chord));
}

export function draftBuste(m: Measurements): BusteResult {
  const warnings: DraftWarning[] = [];
  const values: ReportValue[] = [];

  // ——— Valeurs dérivées d'encolure (méthode : cou/6+1, cou/16, arrondi au 1/2 cm)
  const largeurEncolureBrute = METHOD.ENCOLURE_LARGEUR(m.tourCou);
  const largeurEncolure = METHOD.ARRONDI(largeurEncolureBrute);
  const profEncolureDosBrute = METHOD.ENCOLURE_PROFONDEUR_DOS(m.tourCou);
  const profEncolureDos = METHOD.ARRONDI(profEncolureDosBrute);
  const profEncolureDevant = METHOD.ENCOLURE_PROFONDEUR_DEVANT(largeurEncolure);

  // ——— Cadre commun (méthode : conventions)
  const largeurPlanche = m.tourPoitrine / 2; // milieu dos x=0, milieu devant x=largeurPlanche
  const xCote = m.tourPoitrine / 4; // couture de côté commune
  const yTaille = profEncolureDos + m.longueurDos;

  // ——— Répartition des pinces de taille (méthode : dos 7 / devant D8)
  const aAbsorberHaut = Math.max(0, (m.tourPoitrine - m.tourTaille) / 4);
  const aAbsorberBas = Math.max(0, (m.tourBassin - m.tourTaille) / 4);
  const repDos = repartirPinces(aAbsorberHaut, "dos");
  const repDevant = repartirPinces(aAbsorberHaut, "devant");
  const excedent = repDos.excedent + repDevant.excedent;
  if (excedent > 0) {
    warnings.push({
      code: "pince-supplementaire",
      message: `${excedent.toFixed(1)} cm à absorber au-delà des plafonds de pinces : la méthode prévoit une pince supplémentaire (non tracée en v1).`,
    });
  }

  // ═══════════════════ DEMI-DEVANT (D1-D9) — tracé d'abord car il fixe la ligne de poitrine
  const devant = new Draft("buste-devant", "Demi-devant");

  // D1 — Cadre devant : la longueur devant remonte depuis la taille
  const snpDevant = devant.point(
    "snp-devant",
    pt(largeurPlanche - largeurEncolure, yTaille - m.longueurDevant),
    "Point d'encolure côté cou devant",
  );
  const gorge = devant.point(
    "gorge",
    pt(largeurPlanche, snpDevant.y + profEncolureDevant),
    "Point de gorge : profondeur d'encolure devant sous le point d'épaule",
  );

  // D3 — Saillant : arc de rayon hauteur de poitrine depuis snp-devant
  const xSaillant = largeurPlanche - m.ecartPoitrine / 2;
  const dxS = snpDevant.x - xSaillant;
  const dyS = Math.sqrt(Math.max(0, m.hauteurPoitrine ** 2 - dxS ** 2));
  const saillant = devant.point("saillant", pt(xSaillant, snpDevant.y + dyS), "Saillant (pointe de poitrine)");

  // D4 — Ligne de poitrine : horizontale par le saillant, commune aux deux pièces
  const yPoitrine = saillant.y;
  const dessousBras = devant.point("dessous-bras", pt(xCote, yPoitrine), "Coin côté / ligne de poitrine");
  devant.helper("ligne-poitrine", pt(xCote, yPoitrine), pt(largeurPlanche, yPoitrine), "Ligne de poitrine");

  // D5 — Épaule provisoire à 26° + pince bretelle ouverte par pivot autour du saillant
  const dirEpauleDevant = 180 - METHOD.ANGLE_EPAULE_DEVANT; // vers le côté, en descendant
  const epauleProvisoire = polar(snpDevant, dirEpauleDevant, m.longueurEpaule);
  const pb1 = devant.point(
    "pince-bretelle-1",
    polar(snpDevant, dirEpauleDevant, m.longueurEpaule / 2),
    "Première jambe de la pince bretelle, au milieu de l'épaule",
  );
  const jambe = dist(pb1, saillant);
  const valeurBretelle = METHOD.PINCE_BRETELLE;
  // Ouverture par pivot : égalise les jambes et entraîne la seconde moitié d'épaule (cahier §4.4)
  const theta = -2 * (Math.asin(valeurBretelle / 2 / jambe) * 180) / Math.PI;
  const pb2 = devant.point("pince-bretelle-2", rotateAround(pb1, saillant, theta), "Seconde jambe, égalisée par le pivot");
  const epauleDevant = devant.point(
    "epaule-devant",
    rotateAround(epauleProvisoire, saillant, theta),
    "Extrémité d'épaule devant, pince ouverte",
  );

  // D6 — Carrure devant : point pivoté avec la pince
  const carrureDevant0 = pt(largeurPlanche - m.carrureDevant / 2, (epauleProvisoire.y + yPoitrine) / 2);
  const carrureDevantPt = devant.point(
    "carrure-devant",
    rotateAround(carrureDevant0, saillant, theta),
    "Point de carrure devant (pivoté avec la pince bretelle)",
  );
  devant.helper("ligne-carrure-devant", pt(largeurPlanche, carrureDevant0.y), carrureDevantPt, "Carrure devant");

  // D7 — Bissectrice devant : la courbe passe à 2,5 cm du coin
  const bisDevant = devant.point(
    "bissectrice-devant",
    pt(
      dessousBras.x + METHOD.BISSECTRICE_EMMANCHURE_DEVANT * Math.SQRT1_2,
      dessousBras.y - METHOD.BISSECTRICE_EMMANCHURE_DEVANT * Math.SQRT1_2,
    ),
    "Point de bissectrice d'emmanchure devant (2,5 cm du coin)",
  );

  // D8 — Pince de taille devant : axe par le saillant, sommet 2 cm dessous
  const apexDevant = pt(xSaillant, saillant.y + METHOD.RETRAIT_SOMMET_PINCE_DEVANT);
  if (repDevant.pince > 0) {
    devant.dart({
      id: "pince-taille-devant",
      legs: [pt(xSaillant - repDevant.pince / 2, yTaille), pt(xSaillant + repDevant.pince / 2, yTaille)],
      apex: apexDevant,
      axis: [pt(xSaillant, yTaille), apexDevant],
      value: repDevant.pince,
      label: `Pince devant ${repDevant.pince.toFixed(1)} cm`,
    });
  }

  // D9 — Côté devant : cintrage de la reprise de côté
  const tailleCoteDevant = devant.point("taille-cote-devant", pt(xCote + repDevant.cote, yTaille));
  const tailleMilieuDevant = devant.point("taille-milieu-devant", pt(largeurPlanche, yTaille));

  // Contour devant, ordonné et fermé : dessous-bras → côté → taille → milieu →
  // encolure → épaule → bouche de pince → épaule → emmanchure → dessous-bras
  devant.line("cote-devant", dessousBras, tailleCoteDevant, "Couture de côté devant");
  devant.line("taille-devant", tailleCoteDevant, tailleMilieuDevant, "Ligne de taille devant");
  devant.line("milieu-devant", tailleMilieuDevant, gorge, "Milieu devant");
  devant.curve(
    "encolure-devant",
    neckCurve(
      gorge,
      pt(0, -1),
      snpDevant,
      pt(-Math.sin((METHOD.ANGLE_EPAULE_DEVANT * Math.PI) / 180), -Math.cos((METHOD.ANGLE_EPAULE_DEVANT * Math.PI) / 180)),
    ),
    "Encolure devant, perpendiculaire à l'épaule au raccord",
  );
  devant.line("epaule-devant-1", snpDevant, pb1, "Première moitié d'épaule devant (26°)");
  devant.line("bouche-pince-bretelle", pb1, pb2, "Ouverture de la pince bretelle");
  devant.line("epaule-devant-2", pb2, epauleDevant, "Seconde moitié d'épaule, pivotée");
  devant.curve(
    "emmanchure",
    splineThrough([epauleDevant, carrureDevantPt, bisDevant, dessousBras], METHOD.TENSION.emmanchureDevant),
    "Emmanchure devant : épaule → carrure → bissectrice → dessous de bras",
  );

  devant.dart({
    id: "pince-bretelle",
    legs: [pb1, pb2],
    apex: saillant,
    axis: [pt((pb1.x + pb2.x) / 2, (pb1.y + pb2.y) / 2), saillant],
    value: valeurBretelle,
    label: `Pince bretelle ${valeurBretelle.toFixed(1)} cm`,
  });
  devant.mark({ id: "saillant", at: saillant, kind: "point", label: "Saillant" });
  devant.mark({
    id: "droit-fil-devant",
    at: pt(largeurPlanche - 4, yPoitrine + 3),
    to: pt(largeurPlanche - 4, yTaille - 3),
    kind: "droit-fil",
    label: "DL",
  });
  devant.lineRef("ref-milieu-devant", pt(largeurPlanche, snpDevant.y), pt(largeurPlanche, yTaille), "Milieu devant");
  devant.lineRef("ref-taille-devant", pt(xCote, yTaille), pt(largeurPlanche, yTaille), "Ligne de taille");
  devant.label({ at: pt(largeurPlanche - 8, yTaille - 8), text: "DEVANT", anchor: "middle" });

  // ═══════════════════ DEMI-DOS (1-8)
  const dos = new Draft("buste-dos", "Demi-dos");

  // 1 — Cadre dos
  const nuque = dos.point("nuque", pt(0, profEncolureDos), "Base de l'encolure au milieu dos");
  const snpDos = dos.point("snp-dos", pt(largeurEncolure, 0), "Point d'encolure côté cou dos");

  // 3 — Épaule dos à 18°
  const epauleDos = dos.point(
    "epaule-dos",
    polar(snpDos, METHOD.ANGLE_EPAULE_DOS, m.longueurEpaule),
    "Extrémité d'épaule dos (18°)",
  );

  // 4 — Ligne de poitrine (fixée par le devant) et dessous de bras
  const dessousBrasDos = dos.point("dessous-bras", pt(xCote, yPoitrine), "Coin côté / ligne de poitrine");
  dos.helper("ligne-poitrine", pt(0, yPoitrine), pt(xCote, yPoitrine), "Ligne de poitrine");

  // 5 — Carrure dos
  const carrureDosPt = dos.point(
    "carrure-dos",
    pt(m.carrureDos / 2, (epauleDos.y + yPoitrine) / 2),
    "Point de carrure dos",
  );
  dos.helper("ligne-carrure-dos", pt(0, carrureDosPt.y), carrureDosPt, "Carrure dos");

  // 6 — Bissectrice dos (1,5 cm du coin)
  const bisDos = dos.point(
    "bissectrice-dos",
    pt(
      dessousBrasDos.x - METHOD.BISSECTRICE_EMMANCHURE_DOS * Math.SQRT1_2,
      dessousBrasDos.y - METHOD.BISSECTRICE_EMMANCHURE_DOS * Math.SQRT1_2,
    ),
    "Point de bissectrice d'emmanchure dos (1,5 cm du coin)",
  );

  // 7 — Pinces de taille dos : milieu dos cintré + pince demi-dos
  const tailleMilieuDos = dos.point("taille-milieu-dos", pt(repDos.milieuDos, yTaille), "Milieu dos cintré à la taille");
  const tailleCoteDos = dos.point("taille-cote-dos", pt(xCote - repDos.cote, yTaille));
  const xAxePinceDos = (tailleMilieuDos.x + tailleCoteDos.x) / 2;
  const apexDos = pt(xAxePinceDos, yPoitrine - METHOD.RETRAIT_SOMMET_PINCE_DOS);
  if (repDos.pince > 0) {
    dos.dart({
      id: "pince-taille-dos",
      legs: [pt(xAxePinceDos - repDos.pince / 2, yTaille), pt(xAxePinceDos + repDos.pince / 2, yTaille)],
      apex: apexDos,
      axis: [pt(xAxePinceDos, yTaille), apexDos],
      value: repDos.pince,
      label: `Pince dos ${repDos.pince.toFixed(1)} cm`,
    });
  }

  // Contour dos : nuque → encolure → épaule → emmanchure → côté → taille → milieu dos
  dos.curve(
    "encolure-dos",
    neckCurve(
      nuque,
      pt(1, 0),
      snpDos,
      pt(Math.sin((METHOD.ANGLE_EPAULE_DOS * Math.PI) / 180), -Math.cos((METHOD.ANGLE_EPAULE_DOS * Math.PI) / 180)),
    ),
    "Encolure dos, tangente horizontale au milieu",
  );
  dos.line("epaule-dos", snpDos, epauleDos, "Épaule dos à 18°");
  dos.curve(
    "emmanchure",
    splineThrough([epauleDos, carrureDosPt, bisDos, dessousBrasDos], METHOD.TENSION.emmanchureDos),
    "Emmanchure dos : épaule → carrure → bissectrice → dessous de bras",
  );
  dos.line("cote-dos", dessousBrasDos, tailleCoteDos, "Couture de côté dos");
  dos.line("taille-dos", tailleCoteDos, tailleMilieuDos, "Ligne de taille dos");
  dos.line("milieu-dos-bas", tailleMilieuDos, pt(0, yPoitrine), "Milieu dos cintré sous la poitrine");
  dos.line("milieu-dos-haut", pt(0, yPoitrine), nuque, "Milieu dos");

  dos.mark({
    id: "droit-fil-dos",
    at: pt(4, yPoitrine + 3),
    to: pt(4, yTaille - 3),
    kind: "droit-fil",
    label: "DL",
  });
  dos.lineRef("ref-milieu-dos", pt(0, 0), pt(0, yTaille), "Milieu dos");
  dos.lineRef("ref-taille-dos", pt(0, yTaille), pt(xCote, yTaille), "Ligne de taille");
  dos.label({ at: pt(8, yTaille - 8), text: "DOS", anchor: "middle" });

  // ═══════════════════ Rapport de valeurs calculées
  const dosPiece = dos.toPiece();
  const devantPiece = devant.toPiece();
  const emmanchureDos = curveLength(dosPiece.curves["emmanchure"]);
  const emmanchureDevant = curveLength(devantPiece.curves["emmanchure"]);

  values.push(
    { key: "largeurEncolure", label: "Largeur d'encolure (cou/6 + 1)", value: largeurEncolureBrute, unit: "cm" },
    { key: "largeurEncolureArrondie", label: "Largeur d'encolure arrondie", value: largeurEncolure, unit: "cm" },
    { key: "profEncolureDos", label: "Profondeur d'encolure dos (cou/16)", value: profEncolureDosBrute, unit: "cm" },
    { key: "profEncolureDosArrondie", label: "Profondeur d'encolure dos arrondie", value: profEncolureDos, unit: "cm" },
    { key: "profEncolureDevant", label: "Profondeur d'encolure devant", value: profEncolureDevant, unit: "cm" },
    { key: "pinceBretelle", label: "Valeur de pince bretelle", value: valeurBretelle, unit: "cm" },
    { key: "aAbsorberHaut", label: "À absorber à la taille (haut, par quart)", value: aAbsorberHaut, unit: "cm" },
    { key: "aAbsorberBas", label: "À absorber à la taille (bas, par quart)", value: aAbsorberBas, unit: "cm" },
    { key: "coteDos", label: "Reprise côté dos", value: repDos.cote, unit: "cm" },
    { key: "pinceDos", label: "Pince demi-dos", value: repDos.pince, unit: "cm" },
    { key: "milieuDos", label: "Reprise milieu dos", value: repDos.milieuDos, unit: "cm" },
    { key: "coteDevant", label: "Reprise côté devant", value: repDevant.cote, unit: "cm" },
    { key: "pinceDevant", label: "Pince devant", value: repDevant.pince, unit: "cm" },
    { key: "emmanchureDos", label: "Longueur d'emmanchure dos (mesurée)", value: emmanchureDos, unit: "cm" },
    { key: "emmanchureDevant", label: "Longueur d'emmanchure devant (mesurée)", value: emmanchureDevant, unit: "cm" },
  );

  return { dos: dosPiece, devant: devantPiece, report: { values, warnings } };
}

/** Utilitaire de rapport : valeur par clé (tests, panneau). */
export function reportValue(report: DraftReport, key: string): number {
  const v = report.values.find((x) => x.key === key);
  if (!v) throw new Error(`Valeur de rapport inconnue : ${key}`);
  return v.value;
}
