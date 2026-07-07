/**
 * Export PDF multi-pages A4 à l'échelle 1:1 (jalon M3, cahier §3.3) :
 * tuilage du patron sur pages A4 portrait avec marges d'impression, croix
 * d'alignement aux coins et numérotation ligne/colonne, page de garde avec
 * cartouche, carré de contrôle 5 cm et plan d'assemblage.
 *
 * Choix de bibliothèque (cahier §4.1, « à trancher en M3 ») : jsPDF, retenu
 * pour son API vectorielle en unités physiques (cm) et sa génération 100 %
 * client. Le rendu consomme PatternPiece sans aucun calcul géométrique ;
 * seule la géométrie de MISE EN PAGE (tuilage) vit ici, testée à part.
 */

import { jsPDF } from "jspdf";
import type { Pt, PatternPiece, Dart } from "../engine/types";
import type { Segment } from "../engine/geometry/path";
import { boundingBox, segmentStart } from "../engine/geometry/path";
import { dartOutline } from "../engine/drafting";
import type { Measurements } from "../engine/measurements";
import { cartoucheLignes } from "./cartouche";

// ——— Géométrie de page (cm)
const PAGE = { w: 21, h: 29.7 }; // A4 portrait
/** Marge d'impression : aucune encre à moins de 1 cm du bord (imprimantes domestiques). */
const MARGE_IMPRESSION = 1;
/** Zone utile d'une tuile : le cadre imprimé, à découper/superposer au montage. */
export const TUILE = { w: PAGE.w - 2 * MARGE_IMPRESSION, h: PAGE.h - 2 * MARGE_IMPRESSION }; // 19 × 27,7
/** Blanc autour du tracé sur la planche assemblée. */
const MARGE_PATRON = 1;
const CARRE_CONTROLE = 5; // cm, cohérent avec l'export SVG

export type Tiling = {
  /** Origine de la planche (coin haut-gauche de la tuile L1·C1) dans le repère du patron. */
  origin: Pt;
  cols: number;
  rows: number;
  /** Largeur/hauteur totales de la planche assemblée. */
  w: number;
  h: number;
};

/** Découpe la boîte englobante du patron en tuiles A4 (math pure, testée). */
export function computeTiling(min: Pt, max: Pt): Tiling {
  const w = max.x - min.x + 2 * MARGE_PATRON;
  const h = max.y - min.y + 2 * MARGE_PATRON;
  return {
    origin: { x: min.x - MARGE_PATRON, y: min.y - MARGE_PATRON },
    cols: Math.max(1, Math.ceil(w / TUILE.w)),
    rows: Math.max(1, Math.ceil(h / TUILE.h)),
    w,
    h,
  };
}

export const tuileLabel = (row: number, col: number) => `L${row + 1}·C${col + 1}`;

// ——— Tracé d'une polyligne/courbe via doc.lines (coordonnées relatives jsPDF)
type LineEntry = [number, number] | [number, number, number, number, number, number];

/** Convertit un contour en entrées relatives pour doc.lines(). */
function outlineToLines(outline: Segment[]): { start: Pt; lines: LineEntry[] } {
  const start = segmentStart(outline[0]);
  let cur = start;
  const lines: LineEntry[] = [];
  for (const s of outline) {
    if (s.kind === "line") {
      lines.push([s.b.x - cur.x, s.b.y - cur.y]);
      cur = s.b;
    } else {
      for (const b of s.c.beziers) {
        lines.push([b.c1.x - cur.x, b.c1.y - cur.y, b.c2.x - cur.x, b.c2.y - cur.y, b.p1.x - cur.x, b.p1.y - cur.y]);
        cur = b.p1;
      }
    }
  }
  return { start, lines };
}

function drawOutline(doc: jsPDF, outline: Segment[], offset: Pt, scale: number, closed: boolean) {
  if (outline.length === 0) return;
  const { start, lines } = outlineToLines(outline);
  doc.lines(lines, offset.x + start.x * scale, offset.y + start.y * scale, [scale, scale], "S", closed);
}

function drawPolyline(doc: jsPDF, pts: Pt[], offset: Pt, scale: number) {
  const lines: LineEntry[] = [];
  for (let i = 1; i < pts.length; i++) lines.push([pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y]);
  doc.lines(lines, offset.x + pts[0].x * scale, offset.y + pts[0].y * scale, [scale, scale], "S", false);
}

/** Dessine toutes les pièces (contours, lignes rouges, pinces, repères, étiquettes). */
function drawPieces(doc: jsPDF, pieces: PatternPiece[], offset: Pt, scale: number, withText: boolean) {
  for (const piece of pieces) {
    // lignes de référence (rouges) : milieux, taille
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.02 * Math.max(scale, 0.3));
    for (const r of piece.refLines) {
      if (r.kind === "line") drawPolyline(doc, [r.a, r.b], offset, scale);
    }
    doc.setDrawColor(0, 0, 0);
    // contour
    doc.setLineWidth(0.05 * Math.max(scale, 0.3));
    drawOutline(doc, piece.outline, offset, scale, true);
    // pinces (avec platitude) et repères
    doc.setLineWidth(0.03 * Math.max(scale, 0.3));
    for (const d of piece.darts) drawPolyline(doc, dartOutline(d as Dart), offset, scale);
    for (const mk of piece.marks) {
      if (mk.kind === "droit-fil" && mk.to) {
        drawPolyline(doc, [mk.at, mk.to], offset, scale);
        if (scale === 1) {
          // pointes de flèche du droit-fil
          drawPolyline(doc, [{ x: mk.at.x - 0.4, y: mk.at.y + 0.8 }, mk.at, { x: mk.at.x + 0.4, y: mk.at.y + 0.8 }], offset, scale);
          drawPolyline(doc, [{ x: mk.to.x - 0.4, y: mk.to.y - 0.8 }, mk.to, { x: mk.to.x + 0.4, y: mk.to.y - 0.8 }], offset, scale);
        }
      } else {
        doc.circle(offset.x + mk.at.x * scale, offset.y + mk.at.y * scale, 0.12 * Math.max(scale, 0.5), "F");
      }
    }
    if (withText) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      for (const l of piece.labels) {
        doc.text(l.text, offset.x + l.at.x * scale, offset.y + l.at.y * scale, {
          align: l.anchor === "middle" ? "center" : l.anchor === "end" ? "right" : "left",
        });
      }
      doc.setFont("helvetica", "normal");
    }
  }
}

/** Croix d'alignement : petite croix centrée sur (x, y). */
function drawCross(doc: jsPDF, x: number, y: number, r = 0.4) {
  doc.setLineWidth(0.02);
  doc.setDrawColor(0, 0, 0);
  doc.line(x - r, y, x + r, y);
  doc.line(x, y - r, x, y + r);
}

function pageGarde(doc: jsPDF, pieces: PatternPiece[], m: Measurements, date: Date, tiling: Tiling) {
  const x0 = MARGE_IMPRESSION;
  let y = MARGE_IMPRESSION + 1;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`Patron de base — ${pieces.map((p) => p.title).join(" + ")}`, x0, y);
  y += 1;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const cartouche = cartoucheLignes(m, date);
  for (const t of cartouche) {
    doc.text(t, x0, y);
    y += 0.6;
  }
  y += 0.5;

  // Carré de contrôle : vérifier au réglet AVANT d'assembler
  doc.setLineWidth(0.02);
  doc.rect(x0, y, CARRE_CONTROLE, CARRE_CONTROLE);
  doc.setFontSize(9);
  doc.text(`carré de contrôle ${CARRE_CONTROLE} cm`, x0 + CARRE_CONTROLE / 2, y + CARRE_CONTROLE + 0.5, { align: "center" });
  doc.text(
    ["Imprimer à 100 % (échelle réelle, sans ajustement).", "Vérifier ce carré au réglet avant d'assembler.", `${tiling.rows} ligne(s) × ${tiling.cols} colonne(s) = ${tiling.rows * tiling.cols} pages à coller`, "bord à bord en alignant les croix des coins."],
    x0 + CARRE_CONTROLE + 1,
    y + 0.6,
  );
  y += CARRE_CONTROLE + 1.5;

  // Plan d'assemblage : patron miniature + grille des tuiles
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Plan d'assemblage", x0, y);
  doc.setFont("helvetica", "normal");
  y += 0.5;
  const planW = TUILE.w;
  const planH = PAGE.h - MARGE_IMPRESSION - y;
  const scale = Math.min(planW / (tiling.cols * TUILE.w), planH / (tiling.rows * TUILE.h));
  const off = { x: x0 - tiling.origin.x * scale, y: y - tiling.origin.y * scale };

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  for (let r = 0; r < tiling.rows; r++) {
    for (let c = 0; c < tiling.cols; c++) {
      const tx = x0 + c * TUILE.w * scale;
      const ty = y + r * TUILE.h * scale;
      doc.setDrawColor(160, 160, 160);
      doc.setLineWidth(0.01);
      doc.rect(tx, ty, TUILE.w * scale, TUILE.h * scale);
      doc.text(tuileLabel(r, c), tx + (TUILE.w * scale) / 2, ty + (TUILE.h * scale) / 2, { align: "center" });
    }
  }
  doc.setTextColor(0, 0, 0);
  drawPieces(doc, pieces, off, scale, false);
}

function pageTuile(doc: jsPDF, pieces: PatternPiece[], tiling: Tiling, row: number, col: number, pageNum: number, total: number) {
  const x0 = MARGE_IMPRESSION;
  const y0 = MARGE_IMPRESSION;
  // origine de cette tuile dans le repère du patron
  const tileOrigin = { x: tiling.origin.x + col * TUILE.w, y: tiling.origin.y + row * TUILE.h };
  const offset = { x: x0 - tileOrigin.x, y: y0 - tileOrigin.y };

  // cadre de la tuile (pointillés : ligne de coupe/collage) + croix d'alignement aux coins
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.01);
  doc.setLineDashPattern([0.2, 0.2], 0);
  doc.rect(x0, y0, TUILE.w, TUILE.h);
  doc.setLineDashPattern([], 0);
  for (const cx of [x0, x0 + TUILE.w]) for (const cy of [y0, y0 + TUILE.h]) drawCross(doc, cx, cy);

  // contenu, découpé à la tuile
  doc.saveGraphicsState();
  doc.rect(x0, y0, TUILE.w, TUILE.h, null);
  doc.clip();
  doc.discardPath();
  drawPieces(doc, pieces, offset, 1, true);
  doc.restoreGraphicsState();

  // pied de page dans la marge basse
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`${tuileLabel(row, col)} — page ${pageNum}/${total} — cadre ${TUILE.w} × ${TUILE.h} cm`, PAGE.w / 2, PAGE.h - 0.35, {
    align: "center",
  });
}

export function buildExportPdf(pieces: PatternPiece[], m: Measurements, date: Date): jsPDF {
  const doc = new jsPDF({ unit: "cm", format: "a4", compress: true });
  const boxes = pieces.map((p) => boundingBox(p.outline));
  const min = { x: Math.min(...boxes.map((b) => b.min.x)), y: Math.min(...boxes.map((b) => b.min.y)) };
  const max = { x: Math.max(...boxes.map((b) => b.max.x)), y: Math.max(...boxes.map((b) => b.max.y)) };
  const tiling = computeTiling(min, max);
  const total = tiling.rows * tiling.cols + 1;

  pageGarde(doc, pieces, m, date, tiling);
  let page = 1;
  for (let r = 0; r < tiling.rows; r++) {
    for (let c = 0; c < tiling.cols; c++) {
      doc.addPage();
      page++;
      pageTuile(doc, pieces, tiling, r, c, page, total);
    }
  }
  return doc;
}

/** Déclenche le téléchargement du PDF dans le navigateur. */
export function downloadPdf(pieces: PatternPiece[], m: Measurements): void {
  const doc = buildExportPdf(pieces, m, new Date());
  doc.save(`patron-buste-A4-${new Date().toISOString().slice(0, 10)}.pdf`);
}
