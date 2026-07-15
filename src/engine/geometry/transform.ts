/** Transformations rigides 2D réversibles (cm, axe y vers le bas). */

import type { Pt } from "./point";
import type { Curve } from "./curve";
import type { Segment } from "./path";

/** Matrice affine rigide : [a c tx; b d ty; 0 0 1]. */
export type RigidTransform = {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
};

export const IDENTITY_TRANSFORM: RigidTransform = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };

export function translationTransform(dx: number, dy: number): RigidTransform {
  return { ...IDENTITY_TRANSFORM, tx: dx, ty: dy };
}

/** Rotation autour d'un pivot, positive dans le sens horaire à l'écran. */
export function rotationAroundTransform(pivot: Pt, angleDeg: number): RigidTransform {
  const angle = (angleDeg * Math.PI) / 180;
  const a = Math.cos(angle);
  const b = Math.sin(angle);
  const c = -b;
  const d = a;
  return {
    a,
    b,
    c,
    d,
    tx: pivot.x - a * pivot.x - c * pivot.y,
    ty: pivot.y - b * pivot.x - d * pivot.y,
  };
}

export function applyTransform(point: Pt, transform: RigidTransform): Pt {
  return {
    x: transform.a * point.x + transform.c * point.y + transform.tx,
    y: transform.b * point.x + transform.d * point.y + transform.ty,
  };
}

/** Applique uniquement rotation/réflexion à un vecteur, sans translation. */
export function applyVector(vector: Pt, transform: RigidTransform): Pt {
  return {
    x: transform.a * vector.x + transform.c * vector.y,
    y: transform.b * vector.x + transform.d * vector.y,
  };
}

/** Compose `first` puis `second`. */
export function composeTransforms(first: RigidTransform, second: RigidTransform): RigidTransform {
  return {
    a: second.a * first.a + second.c * first.b,
    b: second.b * first.a + second.d * first.b,
    c: second.a * first.c + second.c * first.d,
    d: second.b * first.c + second.d * first.d,
    tx: second.a * first.tx + second.c * first.ty + second.tx,
    ty: second.b * first.tx + second.d * first.ty + second.ty,
  };
}

export function invertTransform(transform: RigidTransform): RigidTransform {
  const det = transform.a * transform.d - transform.b * transform.c;
  if (Math.abs(det) < 1e-12) throw new Error("invertTransform: transformation non inversible");
  const a = transform.d / det;
  const b = -transform.b / det;
  const c = -transform.c / det;
  const d = transform.a / det;
  return {
    a,
    b,
    c,
    d,
    tx: -(a * transform.tx + c * transform.ty),
    ty: -(b * transform.tx + d * transform.ty),
  };
}

export function transformCurve(curve: Curve, transform: RigidTransform): Curve {
  return {
    beziers: curve.beziers.map((bezier) => ({
      p0: applyTransform(bezier.p0, transform),
      c1: applyTransform(bezier.c1, transform),
      c2: applyTransform(bezier.c2, transform),
      p1: applyTransform(bezier.p1, transform),
    })),
  };
}

export function transformSegment(segment: Segment, transform: RigidTransform): Segment {
  return segment.kind === "line"
    ? { kind: "line", a: applyTransform(segment.a, transform), b: applyTransform(segment.b, transform) }
    : { kind: "curve", c: transformCurve(segment.c, transform) };
}
