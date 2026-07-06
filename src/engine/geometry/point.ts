/**
 * Primitives vectorielles. Unité : le centimètre. Axe y orienté VERS LE BAS
 * (convention SVG), donc un angle positif en degrés descend sous l'horizontale.
 */

export type Pt = { x: number; y: number };

export const pt = (x: number, y: number): Pt => ({ x, y });

export const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });
export const scale = (a: Pt, k: number): Pt => ({ x: a.x * k, y: a.y * k });

export const dist = (a: Pt, b: Pt): number => Math.hypot(a.x - b.x, a.y - b.y);
export const norm = (a: Pt): number => Math.hypot(a.x, a.y);

export const lerp = (a: Pt, b: Pt, t: number): Pt => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

/** Vecteur unitaire de a vers b. */
export function unit(a: Pt, b: Pt): Pt {
  const d = dist(a, b);
  if (d === 0) throw new Error("unit: points confondus");
  return scale(sub(b, a), 1 / d);
}

/**
 * Point à `length` cm de `origin` dans la direction `angleDeg`.
 * 0° = vers +x (droite) ; les angles positifs descendent (y vers le bas).
 * Sert aux pentes d'épaule (18° dos, 26° devant).
 */
export function polar(origin: Pt, angleDeg: number, length: number): Pt {
  const a = (angleDeg * Math.PI) / 180;
  return { x: origin.x + Math.cos(a) * length, y: origin.y + Math.sin(a) * length };
}

/** Rotation de `p` autour de `center`, angle en degrés (sens horaire à l'écran, y vers le bas). */
export function rotateAround(p: Pt, center: Pt, angleDeg: number): Pt {
  const a = (angleDeg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const v = sub(p, center);
  return { x: center.x + v.x * c - v.y * s, y: center.y + v.x * s + v.y * c };
}

/** Angle en degrés du vecteur a→b (0° = +x, positif vers le bas). */
export function angleDeg(a: Pt, b: Pt): number {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

/** Pied de la perpendiculaire abaissée de `p` sur la droite (a, b). */
export function perpFoot(p: Pt, a: Pt, b: Pt): Pt {
  const ab = sub(b, a);
  const t = ((p.x - a.x) * ab.x + (p.y - a.y) * ab.y) / (ab.x * ab.x + ab.y * ab.y);
  return add(a, scale(ab, t));
}

/** Projection scalaire de `p` sur la droite orientée (a, b) : abscisse de son pied, en cm depuis a. */
export function project(p: Pt, a: Pt, b: Pt): number {
  const ab = sub(b, a);
  return ((p.x - a.x) * ab.x + (p.y - a.y) * ab.y) / norm(ab);
}
