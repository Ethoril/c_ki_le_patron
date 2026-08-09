/**
 * Lignes de cartouche communes aux exports SVG et PDF : mesures utilisées,
 * date, mention « sans valeurs de couture » et aisance réellement appliquée
 * (le patron de base du livre correspond à aisance 0).
 */

import type { Measurements } from "../engine/measurements";

const fmtCm = (v: number) => `${v}`.replace(".", ",");

export function cartoucheLignes(m: Measurements, date: Date): string[] {
  const aisance = m.aisance ?? 0;
  const mentionAisance = aisance > 0 ? `aisance ${fmtCm(aisance)} cm au tour` : "sans aisance";
  const pente = m.penteEpaule !== undefined ? ` (pente ${fmtCm(m.penteEpaule)})` : "";
  // p. 19 : l'épaule vient de la largeur d'épaule OU de la largeur du dos
  const epaule =
    m.largeurDos !== undefined
      ? `Largeur dos ${fmtCm(m.largeurDos)}`
      : `Épaule ${fmtCm(m.longueurEpaule ?? 0)}`;
  return [
    `Généré le ${date.toLocaleDateString("fr-FR")} — échelle 1:1 — SANS valeurs de couture, ${mentionAisance}`,
    `Poitrine ${m.tourPoitrine} · Taille ${m.tourTaille} · Bassin ${m.tourBassin} · Cou ${m.tourCou}`,
    `Long. dos ${m.longueurDos} · Long. devant ${m.longueurDevant} · Carrure dos ${m.carrureDos} · Carrure devant ${m.carrureDevant}`,
    `${epaule}${pente} · Haut. poitrine ${m.hauteurPoitrine} · Écart poitrine ${m.ecartPoitrine} (cm)`,
  ];
}
