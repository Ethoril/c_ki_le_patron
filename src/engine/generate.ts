/**
 * Orchestrateur (étage 4 du cahier §4.3) : construit les pièces dans l'ordre
 * de leurs dépendances. La manche (M5) consommera la longueur d'emmanchure
 * MESURÉE sur les courbes du buste tracé, pas une formule sur les mensurations.
 */

import type { Measurements } from "./measurements";
import type { PatternPiece, DraftReport } from "./types";
import { draftBuste } from "./pieces/buste";
import { curveLength } from "./geometry/curve";

export type Pattern = {
  pieces: PatternPiece[];
  report: DraftReport;
  /** Données inter-pièces mesurées sur le tracé (entrée de la manche en M5). */
  interPieces: { longueurEmmanchureTotale: number };
};

export function generate(m: Measurements): Pattern {
  const buste = draftBuste(m);
  const longueurEmmanchureTotale =
    curveLength(buste.dos.curves["emmanchure"]) + curveLength(buste.devant.curves["emmanchure"]);
  return {
    pieces: [buste.dos, buste.devant],
    report: buste.report,
    interPieces: { longueurEmmanchureTotale },
  };
}
