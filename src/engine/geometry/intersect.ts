/** Intersections. Unité cm, y vers le bas. */

import type { Pt } from "./point";
import type { Curve } from "./curve";
import { curveToPolyline } from "./curve";

/**
 * Intersection des DROITES (a1,a2) et (b1,b2) — droites infinies, pas segments.
 * Retourne null si parallèles.
 */
export function intersectLines(a1: Pt, a2: Pt, b1: Pt, b2: Pt): Pt | null {
  const d1x = a2.x - a1.x;
  const d1y = a2.y - a1.y;
  const d2x = b2.x - b1.x;
  const d2y = b2.y - b1.y;
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 1e-12) return null;
  const t = ((b1.x - a1.x) * d2y - (b1.y - a1.y) * d2x) / denom;
  return { x: a1.x + t * d1x, y: a1.y + t * d1y };
}

/** Intersection des SEGMENTS [a1,a2] et [b1,b2] (bornes exclues si `open`). */
export function intersectSegments(a1: Pt, a2: Pt, b1: Pt, b2: Pt, open = false): Pt | null {
  const d1x = a2.x - a1.x;
  const d1y = a2.y - a1.y;
  const d2x = b2.x - b1.x;
  const d2y = b2.y - b1.y;
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 1e-12) return null;
  const t = ((b1.x - a1.x) * d2y - (b1.y - a1.y) * d2x) / denom;
  const u = ((b1.x - a1.x) * d1y - (b1.y - a1.y) * d1x) / denom;
  const eps = open ? 1e-9 : 0;
  if (t < eps || t > 1 - eps || u < eps || u > 1 - eps) return null;
  return { x: a1.x + t * d1x, y: a1.y + t * d1y };
}

/** Première intersection d'une droite (a1,a2) avec une courbe (par échantillonnage). */
export function intersectLineCurve(a1: Pt, a2: Pt, curve: Curve): Pt | null {
  const poly = curveToPolyline(curve);
  for (let i = 1; i < poly.length; i++) {
    const hit = intersectLineSegment(a1, a2, poly[i - 1], poly[i]);
    if (hit) return hit;
  }
  return null;
}

function intersectLineSegment(a1: Pt, a2: Pt, b1: Pt, b2: Pt): Pt | null {
  const d1x = a2.x - a1.x;
  const d1y = a2.y - a1.y;
  const d2x = b2.x - b1.x;
  const d2y = b2.y - b1.y;
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 1e-12) return null;
  const u = ((b1.x - a1.x) * d1y - (b1.y - a1.y) * d1x) / denom;
  if (u < 0 || u > 1) return null;
  return { x: b1.x + u * d2x, y: b1.y + u * d2y };
}
