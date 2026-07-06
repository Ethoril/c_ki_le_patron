/** Types pivots entre moteur et rendu. Aucune dépendance React/DOM. */

import type { Pt } from "./geometry/point";
import type { Curve } from "./geometry/curve";
import type { Segment } from "./geometry/path";

export type { Pt, Curve, Segment };

/** Pince : deux jambes vers un sommet, avec axe pour le pliage. */
export type Dart = {
  id: string;
  /** Extrémités des jambes sur le bord de la pièce. */
  legs: [Pt, Pt];
  /** Sommet (pointe) de la pince. */
  apex: Pt;
  /** Axe de la pince (du milieu des jambes vers le sommet). */
  axis: [Pt, Pt];
  /** Valeur absorbée en cm (écart entre les jambes). */
  value: number;
  label?: string;
};

/** Repère ponctuel : saillant, cran de montage, droit-fil… */
export type Mark = {
  id: string;
  at: Pt;
  kind: "point" | "cran" | "droit-fil";
  /** Pour le droit-fil : second point donnant la direction. */
  to?: Pt;
  label?: string;
};

export type Label = { at: Pt; text: string; anchor?: "start" | "middle" | "end" };

/** Une étape de construction enregistrée par le Draft (mode pas-à-pas, debug). */
export type DraftStep = {
  id: string;
  type: "point" | "line" | "lineRef" | "helper" | "curve";
  geometry: Pt | Segment;
  label?: string;
  /** Référence au livre (page/étape), ex. "p.42 §2". */
  bookRef?: string;
};

export type PatternPiece = {
  id: string;
  /** Nom d'affichage, ex. "Demi-dos". */
  title: string;
  /** Contour fermé, ordonné. */
  outline: Segment[];
  /** Lignes de référence (rouges) : milieux, taille. */
  refLines: Segment[];
  /** Lignes d'aide (grises) : carrure, emmanchure, poitrine. */
  helpers: Segment[];
  darts: Dart[];
  marks: Mark[];
  labels: Label[];
  /** Trace de construction ordonnée (mode pas-à-pas). */
  steps: DraftStep[];
  /** Points nommés exposés (debug visuel, dépendances inter-pièces). */
  points: Record<string, Pt>;
  /** Courbes nommées exposées (ex. "emmanchure" → mesure pour la manche). */
  curves: Record<string, Curve>;
};

/** Avertissement structuré émis par le moteur (jamais d'exception pour un cas métier). */
export type DraftWarning = { code: string; message: string };

/** Valeur calculée à afficher dans le panneau (et à tester). */
export type ReportValue = {
  key: string;
  label: string;
  value: number;
  unit?: string;
  bookRef?: string;
};

export type DraftReport = {
  values: ReportValue[];
  warnings: DraftWarning[];
};
