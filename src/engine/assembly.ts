/**
 * Vues temporaires de fermeture et d'assemblage. Les pièces sources restent
 * immuables : toutes les opérations produisent des géométries transformées.
 */

import type { Curve } from "./geometry/curve";
import { endTangent, startTangent } from "./geometry/curve";
import type { Pt } from "./geometry/point";
import { angleDeg, dist } from "./geometry/point";
import type { Segment } from "./geometry/path";
import type { Dart, PatternPiece, AssemblyCheck, RigidTransform } from "./types";
import {
  applyTransform,
  applyVector,
  composeTransforms,
  invertTransform,
  rotationAroundTransform,
  transformCurve,
  transformSegment,
  translationTransform,
} from "./geometry/transform";

export type TransformableGeometry = Pt | Curve | Segment | Pt[];

function transformGeometry<T extends TransformableGeometry>(geometry: T, transform: RigidTransform): T {
  if (Array.isArray(geometry)) return geometry.map((point) => applyTransform(point, transform)) as T;
  if ("beziers" in geometry) return transformCurve(geometry, transform) as T;
  if ("kind" in geometry) return transformSegment(geometry, transform) as T;
  return applyTransform(geometry, transform) as T;
}

export function closeDart<T extends TransformableGeometry>(dart: Dart, geometry: T): T {
  if (!dart.closeTransform) throw new Error(`Pince "${dart.id}" sans transformation de fermeture`);
  return transformGeometry(geometry, dart.closeTransform);
}

export function reopenDart<T extends TransformableGeometry>(dart: Dart, geometry: T): T {
  if (!dart.closeTransform) throw new Error(`Pince "${dart.id}" sans transformation de fermeture`);
  return transformGeometry(geometry, invertTransform(dart.closeTransform));
}

/** Aligne le segment mobile sur le segment de référence, origine sur origine. */
export function alignSegmentTransform(
  referenceFrom: Pt,
  referenceTo: Pt,
  movingFrom: Pt,
  movingTo: Pt,
): RigidTransform {
  const rotation = rotationAroundTransform(
    movingFrom,
    angleDeg(referenceFrom, referenceTo) - angleDeg(movingFrom, movingTo),
  );
  const rotatedFrom = applyTransform(movingFrom, rotation);
  const translation = translationTransform(referenceFrom.x - rotatedFrom.x, referenceFrom.y - rotatedFrom.y);
  return composeTransforms(rotation, translation);
}

function angleBetweenDeg(a: Pt, b: Pt): number {
  const na = Math.hypot(a.x, a.y);
  const nb = Math.hypot(b.x, b.y);
  if (na < 1e-12 || nb < 1e-12) return 180;
  const cosine = Math.max(-1, Math.min(1, (a.x * b.x + a.y * b.y) / (na * nb)));
  return (Math.acos(cosine) * 180) / Math.PI;
}

/** Écart angulaire quand les deux tangentes doivent être opposées au raccord. */
export function opposedTangentMismatchDeg(first: Pt, second: Pt): number {
  return angleBetweenDeg(first, { x: -second.x, y: -second.y });
}

const TOLERANCE = { gapCm: 1e-6, lengthCm: 0.01, tangentDeg: 0.5 } as const;

function getDart(piece: PatternPiece, id: string): Dart {
  const dart = piece.darts.find((candidate) => candidate.id === id);
  if (!dart) throw new Error(`${piece.id}: pince "${id}" absente`);
  return dart;
}

function check(
  id: string,
  seams: string[],
  gapCm: number,
  lengthDifferenceCm: number,
  tangentMismatchDeg: number,
): AssemblyCheck {
  return {
    id,
    state: "assembled",
    seams,
    gapCm,
    lengthDifferenceCm,
    tangentMismatchDeg,
    tolerance: { ...TOLERANCE },
    passed:
      gapCm <= TOLERANCE.gapCm &&
      lengthDifferenceCm <= TOLERANCE.lengthCm &&
      tangentMismatchDeg <= TOLERANCE.tangentDeg,
  };
}

/**
 * Ferme les pinces d'épaule dos/devant, superpose les coutures d'épaule et
 * mesure les raccords de l'encolure et de l'emmanchure sans muter les pièces.
 */
export function checkBusteAssemblage(dos: PatternPiece, devant: PatternPiece): AssemblyCheck[] {
  const pinceDos = getDart(dos, "pince-epaule-dos");
  const pinceDevant = getDart(devant, "pince-bretelle");

  const couDos = dos.points["snp-dos"];
  const couDevant = devant.points["snp-devant"];
  const brasDosFerme = closeDart(pinceDos, dos.points["epaule-dos"]);
  const brasDevantFerme = closeDart(pinceDevant, devant.points["epaule-devant"]);
  const assemblageDevant = alignSegmentTransform(couDos, brasDosFerme, couDevant, brasDevantFerme);

  const couDevantAligne = applyTransform(couDevant, assemblageDevant);
  const brasDevantAligne = applyTransform(brasDevantFerme, assemblageDevant);
  const gap = Math.max(dist(couDos, couDevantAligne), dist(brasDosFerme, brasDevantAligne));

  const longueurDos = dist(couDos, pinceDos.legs[0]) + dist(pinceDos.legs[0], brasDosFerme);
  const longueurDevant =
    dist(couDevant, pinceDevant.legs[0]) + dist(pinceDevant.legs[0], brasDevantFerme);
  const differenceLongueur = Math.abs(longueurDos - longueurDevant);

  const tangenteEncolureDos = endTangent(dos.curves["encolure-dos"]);
  const tangenteEncolureDevant = applyVector(
    endTangent(devant.curves["encolure-devant"]),
    assemblageDevant,
  );

  const tangenteEmmanchureDos = applyVector(
    startTangent(dos.curves["emmanchure"]),
    pinceDos.closeTransform!,
  );
  const tangenteEmmanchureDevantFermee = applyVector(
    startTangent(devant.curves["emmanchure"]),
    pinceDevant.closeTransform!,
  );
  const tangenteEmmanchureDevant = applyVector(tangenteEmmanchureDevantFermee, assemblageDevant);

  return [
    check(
      "encolure-assemblee",
      ["buste-dos:encolure", "buste-devant:encolure"],
      gap,
      differenceLongueur,
      opposedTangentMismatchDeg(tangenteEncolureDos, tangenteEncolureDevant),
    ),
    check(
      "emmanchure-assemblee",
      ["buste-dos:emmanchure", "buste-devant:emmanchure"],
      gap,
      differenceLongueur,
      opposedTangentMismatchDeg(tangenteEmmanchureDos, tangenteEmmanchureDevant),
    ),
  ];
}

/** Ramène une direction du repère assemblé vers le repère ouvert d'une pince. */
export function assembledDirectionToOpen(
  direction: Pt,
  closeTransform: RigidTransform,
  assemblyTransform: RigidTransform,
): Pt {
  const inClosedLocal = applyVector(direction, invertTransform(assemblyTransform));
  return applyVector(inClosedLocal, invertTransform(closeTransform));
}
