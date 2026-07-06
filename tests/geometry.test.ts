import { describe, it, expect } from "vitest";
import {
  pt,
  add,
  sub,
  scale,
  dist,
  lerp,
  polar,
  rotateAround,
  perpFoot,
  project,
  unit,
} from "../src/engine/geometry/point";
import {
  splineThrough,
  hermite,
  curveLength,
  pointAtLength,
  curveStart,
  curveEnd,
  startTangent,
  endTangent,
  reverseCurve,
} from "../src/engine/geometry/curve";
import { intersectLines, intersectSegments } from "../src/engine/geometry/intersect";
import {
  isClosed,
  outlineArea,
  boundingBox,
  selfIntersects,
  toSvgPath,
  segmentLength,
  type Segment,
} from "../src/engine/geometry/path";

describe("vecteurs", () => {
  it("add / sub / scale", () => {
    expect(add(pt(1, 2), pt(3, 4))).toEqual(pt(4, 6));
    expect(sub(pt(3, 4), pt(1, 2))).toEqual(pt(2, 2));
    expect(scale(pt(1, -2), 3)).toEqual(pt(3, -6));
  });

  it("dist / lerp / unit", () => {
    expect(dist(pt(0, 0), pt(3, 4))).toBe(5);
    expect(lerp(pt(0, 0), pt(10, 20), 0.5)).toEqual(pt(5, 10));
    expect(unit(pt(0, 0), pt(0, 7))).toEqual(pt(0, 1));
  });

  it("polar : 0° = +x, angles positifs vers le bas (y SVG)", () => {
    const p = polar(pt(1, 1), 0, 2);
    expect(p.x).toBeCloseTo(3);
    expect(p.y).toBeCloseTo(1);
    const q = polar(pt(0, 0), 90, 2);
    expect(q.x).toBeCloseTo(0);
    expect(q.y).toBeCloseTo(2); // vers le bas
    const r = polar(pt(0, 0), 18, 1);
    expect(r.x).toBeCloseTo(Math.cos((18 * Math.PI) / 180));
    expect(r.y).toBeCloseTo(Math.sin((18 * Math.PI) / 180));
  });

  it("rotateAround conserve les distances", () => {
    const c = pt(5, 5);
    const p = pt(8, 5);
    const r = rotateAround(p, c, 90);
    expect(dist(c, r)).toBeCloseTo(3);
    expect(r.x).toBeCloseTo(5);
    expect(r.y).toBeCloseTo(8);
  });

  it("perpFoot / project", () => {
    expect(perpFoot(pt(3, 5), pt(0, 0), pt(10, 0))).toEqual(pt(3, 0));
    expect(project(pt(3, 5), pt(0, 0), pt(10, 0))).toBeCloseTo(3);
  });
});

describe("intersections", () => {
  it("intersectLines : croisement simple", () => {
    const p = intersectLines(pt(0, 0), pt(10, 10), pt(0, 10), pt(10, 0));
    expect(p).not.toBeNull();
    expect(p!.x).toBeCloseTo(5);
    expect(p!.y).toBeCloseTo(5);
  });

  it("intersectLines : parallèles → null", () => {
    expect(intersectLines(pt(0, 0), pt(1, 0), pt(0, 1), pt(1, 1))).toBeNull();
  });

  it("intersectLines : droites infinies (hors segments)", () => {
    const p = intersectLines(pt(0, 0), pt(1, 0), pt(5, -1), pt(5, 1));
    expect(p!.x).toBeCloseTo(5);
    expect(p!.y).toBeCloseTo(0);
  });

  it("intersectSegments : ne croise pas hors bornes", () => {
    expect(intersectSegments(pt(0, 0), pt(1, 0), pt(5, -1), pt(5, 1))).toBeNull();
  });
});

describe("courbes", () => {
  it("splineThrough passe par tous les points imposés", () => {
    const pts = [pt(0, 0), pt(4, 3), pt(8, 1), pt(12, 5)];
    const c = splineThrough(pts);
    expect(curveStart(c)).toEqual(pts[0]);
    expect(curveEnd(c)).toEqual(pts[3]);
    // les jonctions de béziers sont exactement les points imposés
    expect(c.beziers[0].p1).toEqual(pts[1]);
    expect(c.beziers[1].p1).toEqual(pts[2]);
  });

  it("curveLength d'une spline alignée = distance", () => {
    const c = splineThrough([pt(0, 0), pt(5, 0), pt(10, 0)]);
    expect(curveLength(c)).toBeCloseTo(10, 3);
  });

  it("pointAtLength au milieu d'un segment droit", () => {
    const c = splineThrough([pt(0, 0), pt(10, 0)]);
    const p = pointAtLength(c, 5);
    expect(p.x).toBeCloseTo(5, 3);
    expect(p.y).toBeCloseTo(0, 3);
  });

  it("hermite respecte points et tangentes", () => {
    const c = hermite(pt(0, 0), pt(1, 0), pt(10, 10), pt(0, 1));
    expect(curveStart(c)).toEqual(pt(0, 0));
    expect(curveEnd(c)).toEqual(pt(10, 10));
    const t0 = startTangent(c);
    expect(t0.x).toBeCloseTo(1);
    expect(t0.y).toBeCloseTo(0);
    const t1 = endTangent(c);
    expect(t1.x).toBeCloseTo(0);
    expect(t1.y).toBeCloseTo(1);
  });

  it("reverseCurve inverse départ et arrivée sans changer la longueur", () => {
    const c = splineThrough([pt(0, 0), pt(4, 3), pt(8, 1)]);
    const r = reverseCurve(c);
    expect(curveStart(r)).toEqual(curveEnd(c));
    expect(curveEnd(r)).toEqual(curveStart(c));
    expect(curveLength(r)).toBeCloseTo(curveLength(c), 3);
  });
});

describe("contours", () => {
  const square: Segment[] = [
    { kind: "line", a: pt(0, 0), b: pt(10, 0) },
    { kind: "line", a: pt(10, 0), b: pt(10, 10) },
    { kind: "line", a: pt(10, 10), b: pt(0, 10) },
    { kind: "line", a: pt(0, 10), b: pt(0, 0) },
  ];

  it("isClosed : carré fermé, ouvert si un côté manque", () => {
    expect(isClosed(square)).toBe(true);
    expect(isClosed(square.slice(0, 3))).toBe(false);
  });

  it("aire et bbox du carré 10×10", () => {
    expect(Math.abs(outlineArea(square))).toBeCloseTo(100, 3);
    const bb = boundingBox(square);
    expect(bb.min).toEqual(pt(0, 0));
    expect(bb.max).toEqual(pt(10, 10));
  });

  it("selfIntersects : carré non, nœud papillon oui", () => {
    expect(selfIntersects(square)).toBe(false);
    const bowtie: Segment[] = [
      { kind: "line", a: pt(0, 0), b: pt(10, 10) },
      { kind: "line", a: pt(10, 10), b: pt(10, 0) },
      { kind: "line", a: pt(10, 0), b: pt(0, 10) },
      { kind: "line", a: pt(0, 10), b: pt(0, 0) },
    ];
    expect(selfIntersects(bowtie)).toBe(true);
  });

  it("segmentLength ligne et courbe", () => {
    expect(segmentLength({ kind: "line", a: pt(0, 0), b: pt(3, 4) })).toBe(5);
    expect(segmentLength({ kind: "curve", c: splineThrough([pt(0, 0), pt(6, 0)]) })).toBeCloseTo(6, 3);
  });

  it("toSvgPath produit un chemin M/L/Z", () => {
    expect(toSvgPath(square)).toBe("M 0 0 L 10 0 L 10 10 L 0 10 L 0 0 Z");
  });
});
