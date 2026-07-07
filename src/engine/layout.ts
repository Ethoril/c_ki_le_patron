/**
 * Mise en planche : positionnement des pièces les unes par rapport aux
 * autres AVANT rendu/export. Les constructions (pieces/*.ts) travaillent
 * dans le repère du gabarit du livre, où les lignes de côté dos et devant
 * coïncident — ce qui peut faire se chevaucher les pièces (épaules longues,
 * pince bretelle large…). Le livre écarte ses planches d'un blanc de
 * 10-15 cm (docs/methode/buste.md, Conventions) ; ici l'écart est calculé
 * pour garantir qu'aucun chevauchement n'est possible.
 */

import type { Pt } from "./geometry/point";
import type { Curve } from "./geometry/curve";
import type { Segment } from "./geometry/path";
import { boundingBox } from "./geometry/path";
import type { PatternPiece, Dart, Mark, DraftStep } from "./types";

/** Blanc minimal entre deux pièces sur la planche (cm). */
export const ECART_PIECES = 5;

const movePt = (p: Pt, dx: number, dy: number): Pt => ({ x: p.x + dx, y: p.y + dy });

function moveCurve(c: Curve, dx: number, dy: number): Curve {
  return {
    beziers: c.beziers.map((b) => ({
      p0: movePt(b.p0, dx, dy),
      c1: movePt(b.c1, dx, dy),
      c2: movePt(b.c2, dx, dy),
      p1: movePt(b.p1, dx, dy),
    })),
  };
}

function moveSegment(s: Segment, dx: number, dy: number): Segment {
  return s.kind === "line"
    ? { kind: "line", a: movePt(s.a, dx, dy), b: movePt(s.b, dx, dy) }
    : { kind: "curve", c: moveCurve(s.c, dx, dy) };
}

function moveDart(d: Dart, dx: number, dy: number): Dart {
  return {
    ...d,
    legs: [movePt(d.legs[0], dx, dy), movePt(d.legs[1], dx, dy)],
    apex: movePt(d.apex, dx, dy),
    axis: [movePt(d.axis[0], dx, dy), movePt(d.axis[1], dx, dy)],
  };
}

function moveMark(m: Mark, dx: number, dy: number): Mark {
  return { ...m, at: movePt(m.at, dx, dy), to: m.to ? movePt(m.to, dx, dy) : undefined };
}

function moveStep(s: DraftStep, dx: number, dy: number): DraftStep {
  const g = s.geometry;
  const geometry = "kind" in g ? moveSegment(g, dx, dy) : movePt(g, dx, dy);
  return { ...s, geometry };
}

/** Translate une pièce entière (géométrie, points nommés, courbes, étapes). */
export function translatePiece(piece: PatternPiece, dx: number, dy: number): PatternPiece {
  if (dx === 0 && dy === 0) return piece;
  return {
    ...piece,
    outline: piece.outline.map((s) => moveSegment(s, dx, dy)),
    refLines: piece.refLines.map((s) => moveSegment(s, dx, dy)),
    helpers: piece.helpers.map((s) => moveSegment(s, dx, dy)),
    darts: piece.darts.map((d) => moveDart(d, dx, dy)),
    marks: piece.marks.map((m) => moveMark(m, dx, dy)),
    labels: piece.labels.map((l) => ({ ...l, at: movePt(l.at, dx, dy) })),
    steps: piece.steps.map((s) => moveStep(s, dx, dy)),
    points: Object.fromEntries(Object.entries(piece.points).map(([k, p]) => [k, movePt(p, dx, dy)])),
    curves: Object.fromEntries(Object.entries(piece.curves).map(([k, c]) => [k, moveCurve(c, dx, dy)])),
  };
}

/**
 * Aligne les pièces de gauche à droite avec un blanc d'au moins ECART_PIECES
 * entre les boîtes englobantes : le chevauchement devient impossible, quelles
 * que soient les mesures. L'ordre d'entrée est conservé (dos à gauche,
 * devant à droite, comme les planches du livre).
 */
export function layoutPieces(pieces: PatternPiece[]): PatternPiece[] {
  const out: PatternPiece[] = [];
  let cursor = -Infinity;
  for (const piece of pieces) {
    const bb = boundingBox(piece.outline);
    const dx = cursor === -Infinity ? 0 : Math.max(0, cursor + ECART_PIECES - bb.min.x);
    const moved = translatePiece(piece, dx, 0);
    out.push(moved);
    cursor = Math.max(cursor, bb.max.x + dx);
  }
  return out;
}
