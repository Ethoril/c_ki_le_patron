/**
 * Le « plan de travail » traçable (cahier §4.3, étage 2).
 * Chaque appel enregistre une étape ordonnée { id, type, geometry, label, bookRef } :
 * le mode pas-à-pas rejoue la liste, le debug visuel affiche les points nommés,
 * les tests ciblent un point précis par son identifiant.
 */

import type { Pt } from "./geometry/point";
import type { Curve } from "./geometry/curve";
import type { Segment } from "./geometry/path";
import type { DraftStep, Dart, Mark, Label, PatternPiece, Seam, StepMetadata } from "./types";

/**
 * Polyligne de tracé d'une pince. Pince simple : V d'une jambe à l'autre par
 * le sommet. Avec platitude (pinces de taille, p. 59-60) : zone plate
 * verticale autour de la ligne des jambes, à parts égales de part et d'autre
 * quand la pince est en losange (`apexBas`, p. 55, 59) — le contour est alors
 * fermé (premier point = dernier point).
 */
export function dartOutline(d: Dart): Pt[] {
  const demi = (d.platitude ?? 0) / 2;
  const haut = d.legs.map((l) => ({ x: l.x, y: l.y - demi }));
  if (!d.apexBas) {
    if (!d.platitude) return [d.legs[0], d.apex, d.legs[1]];
    return [d.legs[0], haut[0], d.apex, haut[1], d.legs[1]];
  }
  const bas = d.legs.map((l) => ({ x: l.x, y: l.y + demi }));
  return [d.apex, haut[0], d.legs[0], bas[0], d.apexBas, bas[1], d.legs[1], haut[1], d.apex];
}

export class Draft {
  readonly id: string;
  readonly title: string;
  private steps: DraftStep[] = [];
  private points: Record<string, Pt> = {};
  private curves: Record<string, Curve> = {};
  private contourSegments: Record<string, Segment> = {};
  private outline: Segment[] = [];
  private refLines: Segment[] = [];
  private helpers: Segment[] = [];
  private darts: Dart[] = [];
  private marks: Mark[] = [];
  private labels: Label[] = [];
  private seams: Record<string, Seam> = {};

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }

  private recordStep(
    id: string,
    type: DraftStep["type"],
    geometry: DraftStep["geometry"],
    label?: string,
    bookRef?: string,
    metadata: StepMetadata = {},
  ): void {
    this.steps.push({
      id,
      type,
      geometry,
      label,
      bookRef,
      dependsOn: [...(metadata.dependsOn ?? [])],
      inputs: { ...(metadata.inputs ?? {}) },
      origin: metadata.origin ?? (bookRef ? "method" : "project-choice"),
      status: metadata.status ?? "validated",
      diagnostics: [...(metadata.diagnostics ?? [])],
    });
  }

  /** Enregistre un point nommé. Retourne le point pour chaîner les constructions. */
  point(id: string, p: Pt, label?: string, bookRef?: string, metadata?: StepMetadata): Pt {
    if (this.points[id]) throw new Error(`Draft ${this.id}: point "${id}" déjà défini`);
    this.points[id] = p;
    this.recordStep(id, "point", p, label, bookRef, metadata);
    return p;
  }

  /** Point nommé précédemment enregistré (erreur explicite si absent : typo de construction). */
  get(id: string): Pt {
    const p = this.points[id];
    if (!p) throw new Error(`Draft ${this.id}: point "${id}" inconnu`);
    return p;
  }

  getCurve(id: string): Curve {
    const c = this.curves[id];
    if (!c) throw new Error(`Draft ${this.id}: courbe "${id}" inconnue`);
    return c;
  }

  /** Ligne de référence (rouge) : milieux, ligne de taille. */
  lineRef(id: string, a: Pt, b: Pt, label?: string, bookRef?: string, metadata?: StepMetadata): void {
    const seg: Segment = { kind: "line", a, b };
    this.refLines.push(seg);
    this.recordStep(id, "lineRef", seg, label, bookRef, metadata);
  }

  /** Ligne d'aide (grise) : carrure, ligne de poitrine… */
  helper(id: string, a: Pt, b: Pt, label?: string, bookRef?: string, metadata?: StepMetadata): void {
    const seg: Segment = { kind: "line", a, b };
    this.helpers.push(seg);
    this.recordStep(id, "helper", seg, label, bookRef, metadata);
  }

  /** Segment de contour (tracé noir). L'ordre des appels définit l'ordre du contour. */
  line(id: string, a: Pt, b: Pt, label?: string, bookRef?: string, metadata?: StepMetadata): void {
    const seg: Segment = { kind: "line", a, b };
    this.outline.push(seg);
    this.contourSegments[id] = seg;
    this.recordStep(id, "line", seg, label, bookRef, metadata);
  }

  /** Courbe de contour nommée (encolure, emmanchure). */
  curve(id: string, c: Curve, label?: string, bookRef?: string, metadata?: StepMetadata): void {
    if (this.curves[id]) throw new Error(`Draft ${this.id}: courbe "${id}" déjà définie`);
    this.curves[id] = c;
    const seg: Segment = { kind: "curve", c };
    this.outline.push(seg);
    this.contourSegments[id] = seg;
    this.recordStep(id, "curve", seg, label, bookRef, metadata);
  }

  dart(d: Dart, bookRef?: string, metadata?: StepMetadata): void {
    this.darts.push(d);
    this.recordStep(d.id, "dart", d, d.label, bookRef, metadata);
  }

  mark(m: Mark, bookRef?: string, metadata?: StepMetadata): void {
    this.marks.push(m);
    this.recordStep(m.id, "mark", m, m.label, bookRef, metadata);
  }

  label(l: Label): void {
    this.labels.push(l);
  }

  /** Nomme une couture à partir de segments de contour déjà enregistrés. */
  seam(
    id: string,
    stepIds: string[],
    from: string,
    to: string,
    metadata: Pick<StepMetadata, "origin" | "status"> = {},
  ): void {
    if (this.seams[id]) throw new Error(`Draft ${this.id}: couture "${id}" déjà définie`);
    const path = stepIds.map((stepId) => {
      const segment = this.contourSegments[stepId];
      if (!segment) throw new Error(`Draft ${this.id}: segment de couture "${stepId}" inconnu`);
      return segment;
    });
    this.seams[id] = {
      id,
      path,
      stepIds: [...stepIds],
      from,
      to,
      origin: metadata.origin ?? "method",
      status: metadata.status ?? "validated",
    };
  }

  toPiece(): PatternPiece {
    return {
      id: this.id,
      title: this.title,
      outline: this.outline,
      refLines: this.refLines,
      helpers: this.helpers,
      darts: this.darts,
      marks: this.marks,
      labels: this.labels,
      steps: this.steps,
      points: { ...this.points },
      curves: { ...this.curves },
      seams: { ...this.seams },
    };
  }
}
