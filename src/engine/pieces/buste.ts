/**
 * Construction du buste de base (demi-dos + demi-devant), transcription
 * linéaire de docs/methode/buste.md (v3, chapitre complet relu page à page) —
 * qui fait autorité sur ce fichier. Blocs numérotés comme la note (dos 1-8,
 * devant D1-D9). Références de pages : Gilewska, « Les patrons de base sur
 * mesure ».
 *
 * Repère : cm, y vers le bas, y = 0 sur la ligne d'épaule dos, milieu dos en
 * x = 0, milieu devant en x = poitrine/2. Les lignes de côté dos et devant
 * coïncident à x = poitrine/4 − 1 (largeurs ∓ 1, C5).
 */

import type { Pt } from "../geometry/point";
import { pt, polar, dist, rotateAround, scale, sub } from "../geometry/point";
import type { Curve } from "../geometry/curve";
import { splineThrough, hermite, concatCurves, curveLength } from "../geometry/curve";
import { Draft } from "../drafting";
import { METHOD, anglesEpaule, repartirPincesTaille } from "../method";
import type { Measurements } from "../measurements";
import type { PatternPiece, DraftReport, DraftWarning, ReportValue } from "../types";

export type BusteResult = { dos: PatternPiece; devant: PatternPiece; report: DraftReport };

/** Courbe d'encolure dos : tangente `t0` au départ, tangente `t1` à l'arrivée (échelle = corde). */
function neckCurve(from: Pt, t0: Pt, to: Pt, t1: Pt) {
  const chord = dist(from, to);
  return hermite(from, scale(t0, chord), to, scale(t1, chord));
}

/**
 * Encolure devant (p. 63-64, C16) : la courbe suit la ligne de gorge sur
 * ≈ largeur/3 (platitude horizontale, repère `H`), tourne, vient suivre la
 * verticale d'encolure sur ≈ profondeur/3 sous le point d'épaule (platitude
 * verticale, tangence au repère `V` — les points de contrôle restent du côté
 * intérieur : jamais d'échancrure au-delà de la verticale), et arrive sur
 * `snp` PERPENDICULAIRE à la ligne d'épaule devant. Le dos arrivant lui
 * aussi ⊥ à sa propre épaule, la courbe traverse la couture d'épaule sans
 * cassure quand les pièces sont assemblées — le critère du livre (p. 63-64).
 * Parcourue de la gorge vers l'épaule (ordre du contour).
 */
function courbeEncolureDevant(
  gorge: Pt,
  snp: Pt,
  angleEpauleDeg: number,
  tension: number,
): { curve: Curve; platitudeGorge: Pt; platitudeVerticale: Pt } {
  const f = METHOD.PLATITUDE_ENCOLURE_DEVANT;
  const platitudeGorge = pt(gorge.x - (gorge.x - snp.x) * f, gorge.y);
  const platitudeVerticale = pt(snp.x, snp.y + (gorge.y - snp.y) * f);
  const a = (angleEpauleDeg * Math.PI) / 180;
  const perp = pt(-Math.sin(a), -Math.cos(a)); // ⊥ à l'épaule, en montant vers le point d'encolure
  return {
    curve: splineThrough(
      [gorge, platitudeGorge, platitudeVerticale, snp],
      tension,
      [pt(-1, 0), pt(-1, 0), pt(0, -1), perp],
    ),
    platitudeGorge,
    platitudeVerticale,
  };
}

/**
 * Emmanchure tracée comme au perroquet (p. 42-44, note §6/D7) : spline
 * épaule → carrure → bissectrice où la courbe coupe la bissectrice à angle
 * droit (tangente imposée à 45°, `sens` = +1 dos, −1 devant), puis UNE SEULE
 * cubique bissectrice → dessous-bras — courbure continue sur tout le virage,
 * aucune jonction avant le coin du côté. Raccord C1 à la bissectrice : même
 * poignée `m1` des deux côtés, bornée par la valeur de bissectrice pour ne
 * jamais passer sous la ligne d'emmanchure. L'arrivée est exactement
 * horizontale au point de côté et la queue du virage vient lécher la ligne
 * au repère de platitude (poignée `m2 = corde − m1`, sans inflexion). Le
 * dernier centimètre n'est pas un segment à la règle : comme la queue du
 * perroquet, il est quasi droit (écart au repère ≲ 1 mm, un trait de crayon).
 */
function courbeEmmanchure(
  epaule: Pt,
  carrure: Pt,
  bissectrice: Pt,
  dessousBras: Pt,
  sens: 1 | -1,
  tension: number,
  valeurBissectrice: number,
): Curve {
  const a = (METHOD.TANGENTE_BISSECTRICE_DEG * Math.PI) / 180;
  const d45 = pt(sens * Math.cos(a), Math.sin(a));
  const haut = splineThrough([epaule, carrure, bissectrice], tension, [undefined, undefined, d45]);
  const corde = dist(bissectrice, dessousBras);
  // poignée du raccord : celle de la spline, bornée par la valeur de
  // bissectrice (jamais sous la ligne) et par corde/3 (pas d'inflexion)
  const m1 = Math.min((dist(bissectrice, carrure) * (1 - tension)) / 6, valeurBissectrice, corde / 3);
  const dernier = haut.beziers[haut.beziers.length - 1];
  dernier.c2 = sub(bissectrice, scale(d45, m1)); // raccord C1 : même poignée que le virage
  // poignée d'arrivée : le virage tient sa hauteur puis la queue lèche la
  // ligne au repère de platitude (fraction de corde calibrée sur les planches)
  const m2 = METHOD.POIGNEE_ARRIVEE_EMMANCHURE * corde;
  const virage = hermite(bissectrice, scale(d45, 3 * m1), dessousBras, pt(sens * 3 * m2, 0));
  return concatCurves(haut, virage);
}

export function draftBuste(m: Measurements): BusteResult {
  const warnings: DraftWarning[] = [];
  const values: ReportValue[] = [];

  // ——— Valeurs dérivées d'encolure — EXACTES, l'arrondi est d'affichage (p. 39-40)
  const largeurEncolure = METHOD.ENCOLURE_LARGEUR(m.tourCou);
  const profEncolureDos = METHOD.ENCOLURE_PROFONDEUR_DOS(m.tourCou);
  const profEncolureDevant = METHOD.ENCOLURE_PROFONDEUR_DEVANT(largeurEncolure);

  // ——— Aisance globale (extension hors livre, buste.md §Extensions) : ajoutée
  // aux tours avant division ; à 0, tracé du livre. U reste sur les mesures du
  // corps : la même aisance s'ajoute à la poitrine et à la taille.
  const aisance = m.aisance ?? 0;
  const poitrineAisee = m.tourPoitrine + aisance;

  // ——— Angles d'épaule : 18°/26° du livre, ou déduits de la pente mesurée
  const angles = anglesEpaule(m.longueurEpaule, m.penteEpaule);
  if (angles.plafonne) {
    warnings.push({
      code: "pente-epaule-plafonnee",
      message: `Pente d'épaule ${m.penteEpaule} cm incohérente avec la longueur d'épaule ${m.longueurEpaule} cm : angle plafonné à 45°.`,
    });
  }

  // ——— Lignes horizontales du gabarit, établies par le dos (p. 33-34, ét. 1-8)
  const largeurPlanche = poitrineAisee / 2; // milieu dos x=0, milieu devant x=largeurPlanche
  const yTaille = m.longueurDos; // C1 : la longueur dos se reporte depuis la ligne d'épaule (y=0)
  const yEmmanchure = METHOD.LIGNE_EMMANCHURE(m.longueurDos); // C3 : mi-distance épaule ↔ taille
  const yCarrure = METHOD.LIGNE_CARRURE(m.longueurDos); // C4 : longueur dos / 3
  // C5 : largeurs ∓ 1 — les deux lignes de côté coïncident dans le repère miroir
  const xCote = poitrineAisee / 4 - METHOD.DEMI_LARGEUR_AJUSTEMENT;

  // ——— Répartition des pinces de taille (p. 54-58) — côté commun aux deux pièces
  const aAbsorberHaut = Math.max(0, (m.tourPoitrine - m.tourTaille) / 4);
  const aAbsorberBas = Math.max(0, (m.tourBassin - m.tourTaille) / 4);
  const rep = repartirPincesTaille(aAbsorberHaut);
  if (rep.pinceSupplementaire) {
    const excedent = rep.excedentDos + rep.excedentDevant;
    warnings.push({
      code: "pince-supplementaire",
      message:
        excedent > 0
          ? `${excedent.toFixed(1)} cm au-delà des plafonds de pinces : la méthode prévoit des pinces supplémentaires, non tracées en v1 (p. 58).`
          : `Milieu dos au-delà de 1 cm (${rep.milieuDos.toFixed(1)} cm) : la méthode recommande une pince supplémentaire (p. 58).`,
    });
  }

  // ═══════════════════ DEMI-DOS (1-8)
  const dos = new Draft("buste-dos", "Demi-dos");

  // 1 — Cadre (p. 33-34)
  const dessousBrasDos = dos.point("dessous-bras", pt(xCote, yEmmanchure), "Point de côté sur la ligne d'emmanchure");
  dos.helper("ligne-emmanchure", pt(0, yEmmanchure), pt(xCote, yEmmanchure), "Ligne d'emmanchure", "p. 34 ét. 7");
  dos.helper("ligne-carrure", pt(0, yCarrure), pt(xCote, yCarrure), "Ligne de carrure", "p. 34 ét. 8");
  dos.helper("ligne-epaule", pt(0, 0), pt(xCote, 0), "Ligne d'épaule dos", "p. 33 ét. 2");

  // 2 — Encolure dos (p. 39-40, C2 : nuque SOUS la ligne d'épaule)
  const nuque = dos.point("nuque", pt(0, profEncolureDos), "Nuque : profondeur d'encolure sous la ligne d'épaule", "p. 40");
  const snpDos = dos.point("snp-dos", pt(largeurEncolure, 0), "Point d'encolure côté cou, SUR la ligne d'épaule", "p. 39");

  // 3 — Épaule dos à 18° — ou à l'angle déduit de la pente d'épaule mesurée
  // (p. 41 ; buste.md §Extensions) ; pince absorbée (ét. 4, p. 47) : longueur = épaule mesurée
  const epauleDos = dos.point(
    "epaule-dos",
    polar(snpDos, angles.dos, m.longueurEpaule),
    `Extrémité d'épaule dos (${angles.dos.toFixed(0)}°)`,
    "p. 41",
  );

  // 5 — Points d'emmanchure dos (p. 42) : carrure, bissectrice du coin, platitude
  const carrureDosPt = dos.point("carrure-dos", pt(m.carrureDos / 2, yCarrure), "Point de carrure dos", "p. 42 ét. 1");
  const coinDos = pt(m.carrureDos / 2, yEmmanchure);
  const bisDos = dos.point(
    "bissectrice-dos",
    pt(
      coinDos.x + METHOD.BISSECTRICE_EMMANCHURE_DOS * Math.SQRT1_2,
      coinDos.y - METHOD.BISSECTRICE_EMMANCHURE_DOS * Math.SQRT1_2,
    ),
    "Point de bissectrice (1,5 cm du coin carrure/emmanchure)",
    "p. 42 ét. 2",
  );
  dos.point(
    "platitude-dos",
    pt(xCote - METHOD.PLATITUDE_EMMANCHURE, yEmmanchure),
    "Repère de platitude : la queue du virage lèche la ligne à 1 cm du côté",
    "p. 42 ét. 3",
  );

  // 7 — Pinces de taille dos (p. 54-58)
  const tailleMilieuDos = dos.point("taille-milieu-dos", pt(rep.milieuDos, yTaille), "Milieu dos cintré à la taille", "p. 55");
  const tailleCoteDos = dos.point("taille-cote-dos", pt(xCote - rep.cote, yTaille), "Côté dos cintré (pince de côté)", "p. 54");
  if (rep.pinceDemiDos > 0) {
    // axe à mi-distance entre le bras de la pince de côté et le milieu dos (cintré) — p. 54 ét. 5
    const xAxe = (tailleMilieuDos.x + tailleCoteDos.x) / 2;
    // sommet SUR la ligne d'emmanchure, borne haute des planches (C20, p. 55)
    const apex = pt(xAxe, yEmmanchure + METHOD.SOMMET_PINCE_DEMI_DOS_SOUS_EMMANCHURE);
    dos.dart({
      id: "pince-demi-dos",
      legs: [pt(xAxe - rep.pinceDemiDos / 2, yTaille), pt(xAxe + rep.pinceDemiDos / 2, yTaille)],
      apex,
      axis: [pt(xAxe, yTaille), apex],
      value: rep.pinceDemiDos,
      platitude: METHOD.PLATITUDE_PINCE(rep.pinceDemiDos),
      label: `Pince demi-dos ${rep.pinceDemiDos.toFixed(1)} cm`,
    });
  }

  // 6 + 8 — Contour dos : encolure → épaule → emmanchure → côté → taille → milieu dos
  dos.curve(
    "encolure-dos",
    neckCurve(
      nuque,
      pt(1, 0), // platitude au milieu dos : tangente horizontale à la nuque (p. 63)
      snpDos,
      pt(Math.sin((angles.dos * Math.PI) / 180), -Math.cos((angles.dos * Math.PI) / 180)),
    ),
    "Encolure dos : platitude au milieu, raccord sur l'épaule",
    "p. 39-40, 63",
  );
  dos.line("epaule-dos", snpDos, epauleDos, `Épaule dos à ${angles.dos.toFixed(0)}°`, "p. 41");
  dos.curve(
    "emmanchure",
    courbeEmmanchure(
      epauleDos,
      carrureDosPt,
      bisDos,
      dessousBrasDos,
      1,
      METHOD.TENSION.emmanchureDos,
      METHOD.BISSECTRICE_EMMANCHURE_DOS,
    ),
    "Emmanchure dos : épaule → carrure → bissectrice → platitude → côté",
    "p. 42-44",
  );
  dos.line("cote-dos", dessousBrasDos, tailleCoteDos, "Couture de côté dos (droite)", "p. 54, 61");
  dos.line("taille-dos", tailleCoteDos, tailleMilieuDos, "Ligne de taille dos");
  dos.line("milieu-dos-bas", tailleMilieuDos, pt(0, yEmmanchure), "Milieu dos cintré depuis la ligne d'emmanchure", "p. 55");
  dos.line("milieu-dos-haut", pt(0, yEmmanchure), nuque, "Milieu dos");

  dos.mark({ id: "droit-fil-dos", at: pt(4, yEmmanchure + 4), to: pt(4, yTaille - 3), kind: "droit-fil", label: "DL" });
  dos.lineRef("ref-milieu-dos", pt(0, 0), pt(0, yTaille), "Milieu dos", "p. 33 ét. 1");
  dos.lineRef("ref-taille-dos", pt(0, yTaille), pt(xCote, yTaille), "Ligne de taille", "p. 33 ét. 3");
  dos.label({ at: pt(8, yTaille - 6), text: "DOS", anchor: "middle" });

  // ═══════════════════ DEMI-DEVANT (D1-D9)
  const devant = new Draft("buste-devant", "Demi-devant");

  // D1 — Cadre (p. 35) : mêmes horizontales, ligne d'épaule propre au devant
  const yEpauleDevant = yTaille - m.longueurDevant;
  const dessousBras = devant.point("dessous-bras", pt(xCote, yEmmanchure), "Point de côté sur la ligne d'emmanchure");
  devant.helper("ligne-emmanchure", pt(xCote, yEmmanchure), pt(largeurPlanche, yEmmanchure), "Ligne d'emmanchure", "p. 35");
  devant.helper("ligne-carrure", pt(xCote, yCarrure), pt(largeurPlanche, yCarrure), "Ligne de carrure", "p. 35");
  devant.helper(
    "ligne-epaule-devant",
    pt(xCote, yEpauleDevant),
    pt(largeurPlanche, yEpauleDevant),
    "Ligne d'épaule devant",
    "p. 35 ét. 10",
  );

  // D2 — Encolure devant (p. 40)
  const snpDevant = devant.point(
    "snp-devant",
    pt(largeurPlanche - largeurEncolure, yEpauleDevant),
    "Point d'encolure côté cou devant, sur la ligne d'épaule devant",
    "p. 40",
  );
  const gorge = devant.point(
    "gorge",
    pt(largeurPlanche, yEpauleDevant + profEncolureDevant),
    "Point de gorge : profondeur d'encolure devant",
    "p. 40",
  );
  // forme de l'encolure (p. 63-64, C16) : platitudes ≈ 1/3 et arrivée ⊥ à
  // l'épaule (continuité de la courbe à travers la couture, dos et devant
  // assemblés)
  const encolureDevant = courbeEncolureDevant(gorge, snpDevant, angles.devant, METHOD.TENSION.encolureDevant);
  devant.point(
    "platitude-gorge",
    encolureDevant.platitudeGorge,
    "Repère de platitude de gorge (≈ largeur d'encolure / 3)",
    "p. 64",
  );
  devant.point(
    "platitude-verticale",
    encolureDevant.platitudeVerticale,
    "Repère de platitude verticale (≈ profondeur / 3 sous le point d'épaule)",
    "p. 64",
  );

  // D3 — Saillant (p. 50, C7) : hauteur de poitrine VERTICALE sous la ligne d'épaule devant
  const yPoitrine = yEpauleDevant + m.hauteurPoitrine;
  const saillant = devant.point(
    "saillant",
    pt(largeurPlanche - m.ecartPoitrine / 2, yPoitrine),
    "Saillant : demi-écart depuis le milieu devant, sur la ligne de poitrine",
    "p. 50",
  );
  devant.helper(
    "ligne-poitrine",
    pt(xCote, yPoitrine),
    pt(largeurPlanche, yPoitrine),
    "Ligne de poitrine (aide pince bretelle)",
    "p. 50",
  );

  // D5 — Épaule devant à 26° (ou angle dos mesuré + différentiel de la
  // méthode, buste.md §Extensions) + pince bretelle (p. 41, 49-53)
  // Option pince d'épaule dos absorbée : épaule devant = épaule − 1 (p. 47)
  const longueurEpauleDevant = m.longueurEpaule - METHOD.EMBU_EPAULE_DOS;
  const dirEpauleDevant = 180 - angles.devant; // vers le côté, en descendant
  const epauleProvisoire = polar(snpDevant, dirEpauleDevant, longueurEpauleDevant);
  const pb1 = devant.point(
    "pince-bretelle-1",
    polar(snpDevant, dirEpauleDevant, longueurEpauleDevant / 2),
    "Première jambe de la pince bretelle, au milieu de l'épaule",
    "p. 52",
  );
  const valeurBretelle = METHOD.PINCE_BRETELLE(m.tourPoitrine);
  const jambe = dist(pb1, saillant);
  // Ouverture par pivot autour du saillant : égalise les jambes et entraîne la
  // seconde moitié d'épaule et le haut d'emmanchure (D6, choix v1 documenté)
  const theta = (-2 * (Math.asin(valeurBretelle / 2 / jambe) * 180)) / Math.PI;
  const pb2 = devant.point(
    "pince-bretelle-2",
    rotateAround(pb1, saillant, theta),
    "Seconde jambe, égalisée sur la première",
    "p. 52",
  );
  const epauleDevant = devant.point(
    "epaule-devant",
    rotateAround(epauleProvisoire, saillant, theta),
    "Extrémité d'épaule devant, pince ouverte",
    "p. 52",
  );

  // D6 — Points d'emmanchure devant (p. 42) : carrure/bissectrice/platitude non pivotées
  const carrureDevantPt = devant.point(
    "carrure-devant",
    pt(largeurPlanche - m.carrureDevant / 2, yCarrure),
    "Point de carrure devant",
    "p. 42 ét. 1",
  );
  const coinDevant = pt(largeurPlanche - m.carrureDevant / 2, yEmmanchure);
  const bisDevant = devant.point(
    "bissectrice-devant",
    pt(
      coinDevant.x - METHOD.BISSECTRICE_EMMANCHURE_DEVANT * Math.SQRT1_2,
      coinDevant.y - METHOD.BISSECTRICE_EMMANCHURE_DEVANT * Math.SQRT1_2,
    ),
    "Point de bissectrice (2,5 cm du coin)",
    "p. 42 ét. 2",
  );
  devant.point(
    "platitude-devant",
    pt(xCote + METHOD.PLATITUDE_EMMANCHURE, yEmmanchure),
    "Repère de platitude : la queue du virage lèche la ligne à 1 cm du côté",
    "p. 42 ét. 3",
  );

  // D8 — Pinces de taille devant (p. 54-55)
  const tailleCoteDevant = devant.point(
    "taille-cote-devant",
    pt(xCote + rep.cote, yTaille),
    "Côté devant cintré (pince de côté)",
    "p. 54",
  );
  const tailleMilieuDevant = devant.point("taille-milieu-devant", pt(largeurPlanche, yTaille));
  if (rep.pinceDevant > 0) {
    // pointe arrêtée à la platitude de poitrine sous le saillant (C15, p. 75)
    const apex = pt(saillant.x, saillant.y + METHOD.PLATITUDE_POITRINE);
    devant.dart({
      id: "pince-taille-devant",
      legs: [pt(saillant.x - rep.pinceDevant / 2, yTaille), pt(saillant.x + rep.pinceDevant / 2, yTaille)],
      apex,
      axis: [pt(saillant.x, yTaille), apex],
      value: rep.pinceDevant,
      platitude: METHOD.PLATITUDE_PINCE(rep.pinceDevant),
      label: `Pince devant ${rep.pinceDevant.toFixed(1)} cm`,
    });
  }

  // D7 + D9 — Contour devant
  devant.line("cote-devant", dessousBras, tailleCoteDevant, "Couture de côté devant (droite)", "p. 54, 61");
  devant.line("taille-devant", tailleCoteDevant, tailleMilieuDevant, "Ligne de taille devant");
  devant.line("milieu-devant", tailleMilieuDevant, gorge, "Milieu devant");
  devant.curve(
    "encolure-devant",
    encolureDevant.curve,
    "Encolure devant : gorge plate, verticale suivie, arrivée ⊥ à l'épaule",
    "p. 40, 63-64",
  );
  devant.line("epaule-devant-1", snpDevant, pb1, `Première moitié d'épaule devant (${angles.devant.toFixed(0)}°)`, "p. 41");
  devant.line("bouche-pince-bretelle", pb1, pb2, "Ouverture de la pince bretelle", "p. 52");
  devant.line("epaule-devant-2", pb2, epauleDevant, "Seconde moitié d'épaule, pivotée", "p. 52");
  devant.curve(
    "emmanchure",
    courbeEmmanchure(
      epauleDevant,
      carrureDevantPt,
      bisDevant,
      dessousBras,
      -1,
      METHOD.TENSION.emmanchureDevant,
      METHOD.BISSECTRICE_EMMANCHURE_DEVANT,
    ),
    "Emmanchure devant : épaule → carrure → bissectrice → platitude → côté",
    "p. 42-44",
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
    at: pt(largeurPlanche - 4, yPoitrine + 4),
    to: pt(largeurPlanche - 4, yTaille - 3),
    kind: "droit-fil",
    label: "DL",
  });
  devant.lineRef(
    "ref-milieu-devant",
    pt(largeurPlanche, yEpauleDevant),
    pt(largeurPlanche, yTaille),
    "Milieu devant",
    "p. 35 ét. 10",
  );
  devant.lineRef("ref-taille-devant", pt(xCote, yTaille), pt(largeurPlanche, yTaille), "Ligne de taille", "p. 33 ét. 3");
  devant.label({ at: pt(largeurPlanche - 8, yTaille - 6), text: "DEVANT", anchor: "middle" });

  // ═══════════════════ Rapport de valeurs calculées (exactes ; l'arrondi est d'affichage)
  const dosPiece = dos.toPiece();
  const devantPiece = devant.toPiece();
  const emmanchureDos = curveLength(dosPiece.curves["emmanchure"]);
  const emmanchureDevant = curveLength(devantPiece.curves["emmanchure"]);

  // Contrôle du livre (p. 65, C17) : écart normal de 1 à 2 cm entre les deux
  // emmanchures, le sens dépendant de la morphologie — avertissement NON
  // bloquant hors plage
  const diffEmmanchure = Math.abs(emmanchureDos - emmanchureDevant);
  if (diffEmmanchure < METHOD.DIFFERENCE_EMMANCHURE_MIN || diffEmmanchure > METHOD.DIFFERENCE_EMMANCHURE_MAX) {
    warnings.push({
      code: "difference-emmanchure",
      message: `Écart de longueur d'emmanchure dos/devant de ${diffEmmanchure.toFixed(1)} cm, hors de la plage normale de ${METHOD.DIFFERENCE_EMMANCHURE_MIN} à ${METHOD.DIFFERENCE_EMMANCHURE_MAX} cm (p. 65) : vérifier l'inclinaison d'épaule et la répartition du tour de poitrine — le montage de la manche en pâtira.`,
    });
  }

  values.push(
    { key: "aisance", label: "Aisance ajoutée au tour", value: aisance, unit: "cm" },
    {
      key: "angleEpauleDos",
      label: m.penteEpaule === undefined ? "Angle d'épaule dos (méthode)" : "Angle d'épaule dos (pente mesurée)",
      value: angles.dos,
      unit: "°",
      bookRef: "p. 41",
    },
    {
      key: "angleEpauleDevant",
      label: m.penteEpaule === undefined ? "Angle d'épaule devant (méthode)" : "Angle d'épaule devant (pente + 8°)",
      value: angles.devant,
      unit: "°",
      bookRef: "p. 41",
    },
    { key: "largeurEncolure", label: "Largeur d'encolure (cou/6 + 1)", value: largeurEncolure, unit: "cm", bookRef: "p. 39", arrondi: true },
    { key: "profEncolureDos", label: "Profondeur d'encolure dos (cou/16)", value: profEncolureDos, unit: "cm", bookRef: "p. 40", arrondi: true },
    { key: "profEncolureDevant", label: "Profondeur d'encolure devant (largeur + 2)", value: profEncolureDevant, unit: "cm", bookRef: "p. 40", arrondi: true },
    { key: "pinceBretelle", label: "Pince bretelle (poitrine/20 + 1)", value: valeurBretelle, unit: "cm", bookRef: "p. 52" },
    { key: "aAbsorberHaut", label: "À absorber à la taille (haut, par quart)", value: aAbsorberHaut, unit: "cm", bookRef: "p. 56" },
    { key: "aAbsorberBas", label: "À absorber à la taille (bas, par quart)", value: aAbsorberBas, unit: "cm", bookRef: "p. 56" },
    { key: "cote", label: "Pince de côté (dos = devant)", value: rep.cote, unit: "cm", bookRef: "p. 54" },
    { key: "pinceDevant", label: "Pince du devant", value: rep.pinceDevant, unit: "cm", bookRef: "p. 54" },
    { key: "pinceDemiDos", label: "Pince du demi-dos", value: rep.pinceDemiDos, unit: "cm", bookRef: "p. 54" },
    { key: "milieuDos", label: "Reprise milieu dos", value: rep.milieuDos, unit: "cm", bookRef: "p. 55" },
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
