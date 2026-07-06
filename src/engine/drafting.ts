/**
 * Le « plan de travail » traçable (cahier §4.3, étage 2).
 * Chaque appel enregistre une étape ordonnée { id, type, geometry, label, bookRef } :
 * le mode pas-à-pas rejoue la liste, le debug visuel affiche les points nommés,
 * les tests ciblent un point précis par son identifiant.
 */

import type { Pt } from "./geometry/point";
import type { Curve } from "./geometry/curve";
import type { Segment } from "./geometry/path";
import type { DraftStep, Dart, Mark, Label, PatternPiece } from "./types";

export class Draft {
  readonly id: string;
  readonly title: string;
  private steps: DraftStep[] = [];
  private points: Record<string, Pt> = {};
  private curves: Record<string, Curve> = {};
  private outline: Segment[] = [];
  private refLines: Segment[] = [];
  private helpers: Segment[] = [];
  private darts: Dart[] = [];
  private marks: Mark[] = [];
  private labels: Label[] = [];

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }

  /** Enregistre un point nommé. Retourne le point pour chaîner les constructions. */
  point(id: string, p: Pt, label?: string, bookRef?: string): Pt {
    if (this.points[id]) throw new Error(`Draft ${this.id}: point "${id}" déjà défini`);
    this.points[id] = p;
    this.steps.push({ id, type: "point", geometry: p, label, bookRef });
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
  lineRef(id: string, a: Pt, b: Pt, label?: string, bookRef?: string): void {
    const seg: Segment = { kind: "line", a, b };
    this.refLines.push(seg);
    this.steps.push({ id, type: "lineRef", geometry: seg, label, bookRef });
  }

  /** Ligne d'aide (grise) : carrure, ligne de poitrine… */
  helper(id: string, a: Pt, b: Pt, label?: string, bookRef?: string): void {
    const seg: Segment = { kind: "line", a, b };
    this.helpers.push(seg);
    this.steps.push({ id, type: "helper", geometry: seg, label, bookRef });
  }

  /** Segment de contour (tracé noir). L'ordre des appels définit l'ordre du contour. */
  line(id: string, a: Pt, b: Pt, label?: string, bookRef?: string): void {
    const seg: Segment = { kind: "line", a, b };
    this.outline.push(seg);
    this.steps.push({ id, type: "line", geometry: seg, label, bookRef });
  }

  /** Courbe de contour nommée (encolure, emmanchure). */
  curve(id: string, c: Curve, label?: string, bookRef?: string): void {
    if (this.curves[id]) throw new Error(`Draft ${this.id}: courbe "${id}" déjà définie`);
    this.curves[id] = c;
    const seg: Segment = { kind: "curve", c };
    this.outline.push(seg);
    this.steps.push({ id, type: "curve", geometry: seg, label, bookRef });
  }

  dart(d: Dart): void {
    this.darts.push(d);
  }

  mark(m: Mark): void {
    this.marks.push(m);
  }

  label(l: Label): void {
    this.labels.push(l);
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
    };
  }
}
