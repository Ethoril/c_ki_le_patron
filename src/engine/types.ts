/** Types pivots entre moteur et rendu. Aucune dépendance React/DOM. */

import type { Pt } from "./geometry/point";
import type { Curve } from "./geometry/curve";
import type { Segment } from "./geometry/path";
import type { RigidTransform } from "./geometry/transform";

export type { Pt, Curve, Segment, RigidTransform };

export type ConstructionOrigin = "method" | "project-choice" | "fitting";
export type ValidationStatus = "validated" | "interpretation" | "to-validate";

export type Diagnostic = {
  code: string;
  message: string;
  level: "info" | "warning" | "error";
  /** Mesures, points, courbes ou étapes concernés. */
  entities?: string[];
};

/** Pince : deux jambes vers un sommet, avec axe pour le pliage. */
export type Dart = {
  id: string;
  /** Extrémités des jambes sur le bord de la pièce. */
  legs: [Pt, Pt];
  /** Sommet (pointe) de la pince. */
  apex: Pt;
  /** Pivot géométrique utilisé pour fermer la pince. */
  pivot: Pt;
  /**
   * Sommet bas des pinces de taille en losange, prolongées sous la taille
   * (p. 55 : devant 9 cm, demi-dos 11 cm sous la taille). Absent pour les
   * pinces à sommet unique (bretelle).
   */
  apexBas?: Pt;
  /** Axe de la pince (du milieu des jambes vers le sommet). */
  axis: [Pt, Pt];
  /** Valeur absorbée en cm (écart entre les jambes). */
  value: number;
  /** Transformation appliquée au bloc mobile pour superposer legs[1] sur legs[0]. */
  closeTransform?: RigidTransform;
  foldToward?: "center" | "side" | "custom";
  /** Instruction de montage, distincte de la pointe géométrique dessinée. */
  assemblyInstruction?: { stitchStopBeforeTipCm?: number };
  /**
   * Platitude à la taille (p. 59) : zone plate où les bords de pince sont
   * parallèles, répartie autour de la ligne de taille. Absente pour les
   * pinces hors taille (bretelle).
   */
  platitude?: number;
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
  type: "point" | "line" | "lineRef" | "helper" | "curve" | "dart" | "mark";
  geometry: Pt | Segment | Dart | Mark;
  label?: string;
  /** Référence au livre (page/étape), ex. "p.42 §2". */
  bookRef?: string;
  /** Mesures, points, courbes ou étapes réellement consommés. */
  dependsOn: string[];
  /** Valeurs utiles à l'explication de cette étape. */
  inputs: Record<string, number | string>;
  origin: ConstructionOrigin;
  status: ValidationStatus;
  diagnostics: Diagnostic[];
};

export type StepMetadata = Partial<
  Pick<DraftStep, "dependsOn" | "inputs" | "origin" | "status" | "diagnostics">
>;

/** Ligne de couture nommée, indépendante de son usage visuel dans le contour. */
export type Seam = {
  id: string;
  path: Segment[];
  /** Identifiants des étapes de contour qui composent la couture. */
  stepIds: string[];
  from: string;
  to: string;
  origin: ConstructionOrigin;
  status: ValidationStatus;
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
  /** Coutures principales nommées pour les contrôles d'assemblage. */
  seams: Record<string, Seam>;
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
  /** Le livre arrondit cette valeur au 1/2 cm supérieur sur ses planches (affichage uniquement). */
  arrondi?: boolean;
};

export type DraftReport = {
  values: ReportValue[];
  warnings: DraftWarning[];
  assemblyChecks: AssemblyCheck[];
};

/** Résultat mesurable d'une vue temporaire avec pinces fermées et coutures assemblées. */
export type AssemblyCheck = {
  id: string;
  state: "closed" | "assembled";
  seams: string[];
  gapCm: number;
  lengthDifferenceCm: number;
  tangentMismatchDeg: number;
  tolerance: { gapCm: number; lengthCm: number; tangentDeg: number };
  passed: boolean;
};
