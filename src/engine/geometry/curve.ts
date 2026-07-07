/**
 * Courbes : cubiques de Bézier assemblées, produites par une spline
 * Catmull-Rom passant par des points imposés. Longueur d'arc et point à
 * distance — indispensables pour mesurer l'emmanchure (dépendance manche).
 */

import type { Pt } from "./point";
import { add, scale, sub, dist } from "./point";

export type CubicBezier = { p0: Pt; c1: Pt; c2: Pt; p1: Pt };
export type Curve = { beziers: CubicBezier[] };

/**
 * Spline Catmull-Rom centripète-uniforme passant par tous les `points`,
 * convertie en cubiques de Bézier. `tension` ∈ [0..1] : 0 = très arrondie,
 * 1 = quasi polyligne. Les tensions par courbe vivent dans method.ts (§4.4).
 *
 * `tangentes` (optionnel, creux) impose la DIRECTION de la tangente au point
 * de même indice — l'amplitude Catmull-Rom est conservée, seule l'orientation
 * change. Sert aux passages obligés de la méthode (ex. emmanchure
 * perpendiculaire à la bissectrice, arrivée plate sur la platitude).
 */
export function splineThrough(points: Pt[], tension = 0, tangentes?: (Pt | undefined)[]): Curve {
  if (points.length < 2) throw new Error("splineThrough: il faut au moins 2 points");
  const T: Pt[] = points.map((p, i) => {
    const prev = points[i - 1] ?? p;
    const next = points[i + 1] ?? p;
    const t = scale(sub(next, prev), (1 - tension) / 2);
    const dir = tangentes?.[i];
    if (!dir) return t;
    const n = Math.hypot(dir.x, dir.y);
    if (n < 1e-9) throw new Error(`splineThrough: tangente imposée nulle au point ${i}`);
    return scale(dir, Math.hypot(t.x, t.y) / n);
  });
  const beziers: CubicBezier[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    beziers.push({
      p0: points[i],
      c1: add(points[i], scale(T[i], 1 / 3)),
      c2: sub(points[i + 1], scale(T[i + 1], 1 / 3)),
      p1: points[i + 1],
    });
  }
  return { beziers };
}

/** Cubique de Bézier unique définie par tangentes (forme de Hermite). */
export function hermite(p0: Pt, t0: Pt, p1: Pt, t1: Pt): Curve {
  return {
    beziers: [{ p0, c1: add(p0, scale(t0, 1 / 3)), c2: sub(p1, scale(t1, 1 / 3)), p1 }],
  };
}

/** Concatène des courbes contiguës (l'arrivée de chacune = le départ de la suivante). */
export function concatCurves(...curves: Curve[]): Curve {
  const beziers: CubicBezier[] = [];
  for (const c of curves) {
    if (beziers.length > 0 && dist(beziers[beziers.length - 1].p1, c.beziers[0].p0) > 1e-6) {
      throw new Error("concatCurves: courbes non contiguës");
    }
    beziers.push(...c.beziers);
  }
  return { beziers };
}

export function bezierPointAt(b: CubicBezier, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * b.p0.x + 3 * u * u * t * b.c1.x + 3 * u * t * t * b.c2.x + t * t * t * b.p1.x,
    y: u * u * u * b.p0.y + 3 * u * u * t * b.c1.y + 3 * u * t * t * b.c2.y + t * t * t * b.p1.y,
  };
}

const SAMPLES_PER_BEZIER = 64;

/** Polyligne d'échantillonnage (rendu, aire, auto-intersection, longueur). */
export function curveToPolyline(curve: Curve, samplesPerBezier = SAMPLES_PER_BEZIER): Pt[] {
  const out: Pt[] = [curve.beziers[0].p0];
  for (const b of curve.beziers) {
    for (let i = 1; i <= samplesPerBezier; i++) out.push(bezierPointAt(b, i / samplesPerBezier));
  }
  return out;
}

/** Longueur d'arc en cm (échantillonnage dense ; précision ≈ 0,01 cm sur nos courbes). */
export function curveLength(curve: Curve): number {
  const poly = curveToPolyline(curve, 128);
  let len = 0;
  for (let i = 1; i < poly.length; i++) len += dist(poly[i - 1], poly[i]);
  return len;
}

/** Point situé à l'abscisse curviligne `s` (cm) depuis le début — crans, repères de montage. */
export function pointAtLength(curve: Curve, s: number): Pt {
  const poly = curveToPolyline(curve, 128);
  if (s <= 0) return poly[0];
  let acc = 0;
  for (let i = 1; i < poly.length; i++) {
    const d = dist(poly[i - 1], poly[i]);
    if (acc + d >= s) {
      const t = (s - acc) / d;
      return {
        x: poly[i - 1].x + (poly[i].x - poly[i - 1].x) * t,
        y: poly[i - 1].y + (poly[i].y - poly[i - 1].y) * t,
      };
    }
    acc += d;
  }
  return poly[poly.length - 1];
}

export function curveStart(curve: Curve): Pt {
  return curve.beziers[0].p0;
}

export function curveEnd(curve: Curve): Pt {
  return curve.beziers[curve.beziers.length - 1].p1;
}

/** Tangente unitaire au départ de la courbe. */
export function startTangent(curve: Curve): Pt {
  const b = curve.beziers[0];
  const t = sub(b.c1, b.p0);
  const n = Math.hypot(t.x, t.y);
  if (n < 1e-9) {
    const t2 = sub(b.c2, b.p0);
    const n2 = Math.hypot(t2.x, t2.y);
    return { x: t2.x / n2, y: t2.y / n2 };
  }
  return { x: t.x / n, y: t.y / n };
}

/** Tangente unitaire à l'arrivée de la courbe. */
export function endTangent(curve: Curve): Pt {
  const b = curve.beziers[curve.beziers.length - 1];
  const t = sub(b.p1, b.c2);
  const n = Math.hypot(t.x, t.y);
  if (n < 1e-9) {
    const t2 = sub(b.p1, b.c1);
    const n2 = Math.hypot(t2.x, t2.y);
    return { x: t2.x / n2, y: t2.y / n2 };
  }
  return { x: t.x / n, y: t.y / n };
}

/** Renverse le sens de parcours de la courbe. */
export function reverseCurve(curve: Curve): Curve {
  return {
    beziers: curve.beziers
      .map((b) => ({ p0: b.p1, c1: b.c2, c2: b.c1, p1: b.p0 }))
      .reverse(),
  };
}
