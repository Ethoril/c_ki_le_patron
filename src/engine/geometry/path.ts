/** Assemblage de contours : longueurs, fermeture, bbox, aire, auto-intersection, chemin SVG. */

import type { Pt } from "./point";
import { dist } from "./point";
import type { Curve } from "./curve";
import { curveToPolyline, curveLength, curveStart, curveEnd } from "./curve";
import { intersectSegments } from "./intersect";

export type Segment = { kind: "line"; a: Pt; b: Pt } | { kind: "curve"; c: Curve };

export function segmentStart(s: Segment): Pt {
  return s.kind === "line" ? s.a : curveStart(s.c);
}

export function segmentEnd(s: Segment): Pt {
  return s.kind === "line" ? s.b : curveEnd(s.c);
}

export function segmentLength(s: Segment): number {
  return s.kind === "line" ? dist(s.a, s.b) : curveLength(s.c);
}

/** Le contour est-il fermé et continu (chaque segment démarre où finit le précédent) ? */
export function isClosed(outline: Segment[], tol = 1e-6): boolean {
  if (outline.length === 0) return false;
  for (let i = 0; i < outline.length; i++) {
    const end = segmentEnd(outline[i]);
    const next = segmentStart(outline[(i + 1) % outline.length]);
    if (dist(end, next) > tol) return false;
  }
  return true;
}

/** Polyligne du contour complet (pour aire, bbox, auto-intersection). */
export function outlineToPolyline(outline: Segment[]): Pt[] {
  const out: Pt[] = [];
  for (const s of outline) {
    const pts = s.kind === "line" ? [s.a, s.b] : curveToPolyline(s.c, 32);
    for (const p of pts) {
      const last = out[out.length - 1];
      if (!last || dist(last, p) > 1e-9) out.push(p);
    }
  }
  return out;
}

export function boundingBox(outline: Segment[]): { min: Pt; max: Pt } {
  const poly = outlineToPolyline(outline);
  const min = { x: Infinity, y: Infinity };
  const max = { x: -Infinity, y: -Infinity };
  for (const p of poly) {
    min.x = Math.min(min.x, p.x);
    min.y = Math.min(min.y, p.y);
    max.x = Math.max(max.x, p.x);
    max.y = Math.max(max.y, p.y);
  }
  return { min, max };
}

/** Aire signée (cm²) du contour fermé, via la polyligne (formule du lacet). */
export function outlineArea(outline: Segment[]): number {
  const poly = outlineToPolyline(outline);
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

/** Le contour se recoupe-t-il lui-même ? (test O(n²) sur la polyligne, suffisant ici) */
export function selfIntersects(outline: Segment[]): boolean {
  const poly = outlineToPolyline(outline);
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a1 = poly[i];
    const a2 = poly[(i + 1) % n];
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue; // segments adjacents par fermeture
      const hit = intersectSegments(a1, a2, poly[j], poly[(j + 1) % n], true);
      if (hit) return true;
    }
  }
  return false;
}

const fmt = (v: number) => (Math.round(v * 1000) / 1000).toString();

/** Attribut `d` d'un <path> SVG (unités = cm, à mettre à l'échelle côté rendu). */
export function toSvgPath(outline: Segment[], close = true): string {
  if (outline.length === 0) return "";
  const start = segmentStart(outline[0]);
  let d = `M ${fmt(start.x)} ${fmt(start.y)}`;
  for (const s of outline) {
    if (s.kind === "line") {
      d += ` L ${fmt(s.b.x)} ${fmt(s.b.y)}`;
    } else {
      for (const b of s.c.beziers) {
        d += ` C ${fmt(b.c1.x)} ${fmt(b.c1.y)} ${fmt(b.c2.x)} ${fmt(b.c2.y)} ${fmt(b.p1.x)} ${fmt(b.p1.y)}`;
      }
    }
  }
  if (close) d += " Z";
  return d;
}
