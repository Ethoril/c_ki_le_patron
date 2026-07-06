/**
 * Export SVG autonome à l'échelle 1:1 : unités physiques en cm (width/height
 * en "cm"), carré de contrôle de 5 cm, cartouche avec mesures, date, et
 * mention « sans coutures ». Aucune dépendance DOM hormis le déclenchement
 * du téléchargement.
 */

import type { PatternPiece } from "../engine/types";
import type { Measurements } from "../engine/measurements";
import { boundingBox, toSvgPath } from "../engine/geometry/path";
import { dartOutline } from "../engine/drafting";

const MARGE = 3; // cm autour du tracé
const CARTOUCHE_H = 7; // cm réservés sous le tracé
const CARRE_CONTROLE = 5; // cm de côté

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildExportSvg(pieces: PatternPiece[], m: Measurements, date: Date): string {
  const boxes = pieces.map((p) => boundingBox(p.outline));
  const min = {
    x: Math.min(...boxes.map((b) => b.min.x)),
    y: Math.min(...boxes.map((b) => b.min.y)),
  };
  const max = {
    x: Math.max(...boxes.map((b) => b.max.x)),
    y: Math.max(...boxes.map((b) => b.max.y)),
  };
  const w = max.x - min.x + 2 * MARGE;
  const h = max.y - min.y + 2 * MARGE + CARTOUCHE_H;
  const ox = MARGE - min.x;
  const oy = MARGE - min.y;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}cm" height="${h}cm" viewBox="0 0 ${w} ${h}" font-family="sans-serif">`,
  );
  parts.push(`<g transform="translate(${ox} ${oy})">`);
  for (const piece of pieces) {
    for (const r of piece.refLines) {
      if (r.kind === "line")
        parts.push(
          `<line x1="${r.a.x}" y1="${r.a.y}" x2="${r.b.x}" y2="${r.b.y}" stroke="#dc2626" stroke-width="0.05"/>`,
        );
    }
    parts.push(`<path d="${toSvgPath(piece.outline)}" fill="none" stroke="black" stroke-width="0.08"/>`);
    for (const d of piece.darts) {
      const poly = dartOutline(d)
        .map((p) => `${p.x} ${p.y}`)
        .join(" L ");
      parts.push(`<path d="M ${poly}" fill="none" stroke="black" stroke-width="0.05"/>`);
    }
    for (const mk of piece.marks) {
      if (mk.kind === "droit-fil" && mk.to) {
        parts.push(
          `<line x1="${mk.at.x}" y1="${mk.at.y}" x2="${mk.to.x}" y2="${mk.to.y}" stroke="black" stroke-width="0.05"/>`,
        );
      } else {
        parts.push(`<circle cx="${mk.at.x}" cy="${mk.at.y}" r="0.15" fill="black"/>`);
      }
    }
    for (const l of piece.labels) {
      parts.push(
        `<text x="${l.at.x}" y="${l.at.y}" font-size="1.4" font-weight="bold" text-anchor="${l.anchor ?? "start"}" fill="black">${esc(l.text)}</text>`,
      );
    }
  }
  parts.push(`</g>`);

  // Carré de contrôle 5 × 5 cm : à vérifier au réglet après impression
  const cy = max.y - min.y + 2 * MARGE + 0.5;
  parts.push(
    `<rect x="${MARGE}" y="${cy}" width="${CARRE_CONTROLE}" height="${CARRE_CONTROLE}" fill="none" stroke="black" stroke-width="0.05"/>`,
  );
  parts.push(
    `<text x="${MARGE + CARRE_CONTROLE / 2}" y="${cy + CARRE_CONTROLE + 1.2}" font-size="0.9" text-anchor="middle">carré de contrôle ${CARRE_CONTROLE} cm</text>`,
  );

  // Cartouche
  const cx = MARGE + CARRE_CONTROLE + 3;
  const lignes = [
    `Patron de base — ${pieces.map((p) => p.title).join(" + ")}`,
    `Généré le ${date.toLocaleDateString("fr-FR")} — échelle 1:1 — SANS valeurs de couture ni aisance`,
    `Poitrine ${m.tourPoitrine} · Taille ${m.tourTaille} · Bassin ${m.tourBassin} · Cou ${m.tourCou}`,
    `Long. dos ${m.longueurDos} · Long. devant ${m.longueurDevant} · Carrure dos ${m.carrureDos} · Carrure devant ${m.carrureDevant}`,
    `Épaule ${m.longueurEpaule} · Haut. poitrine ${m.hauteurPoitrine} · Écart poitrine ${m.ecartPoitrine} (cm)`,
  ];
  lignes.forEach((t, i) => {
    parts.push(
      `<text x="${cx}" y="${cy + 1.2 + i * 1.4}" font-size="${i === 0 ? 1.1 : 0.85}">${esc(t)}</text>`,
    );
  });

  parts.push(`</svg>`);
  return parts.join("\n");
}

/** Déclenche le téléchargement du SVG dans le navigateur. */
export function downloadSvg(pieces: PatternPiece[], m: Measurements): void {
  const svg = buildExportSvg(pieces, m, new Date());
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `patron-buste-${new Date().toISOString().slice(0, 10)}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}
