import { describe, expect, it } from "vitest";
import { Draft } from "../src/engine/drafting";
import { draftBuste } from "../src/engine/pieces/buste";
import { DEMO_MEASUREMENTS } from "../src/engine/measurements";
import { dist, pt } from "../src/engine/geometry/point";
import {
  applyTransform,
  composeTransforms,
  invertTransform,
  rotationAroundTransform,
  translationTransform,
} from "../src/engine/geometry/transform";
import { closeDart, reopenDart } from "../src/engine/assembly";

describe("Phase A : traçabilité compatible", () => {
  it("les anciens appels Draft reçoivent des métadonnées explicites par défaut", () => {
    const draft = new Draft("test", "Test");
    const a = draft.point("a", pt(0, 0));
    const b = draft.point("b", pt(2, 0), "B", "p. 1");
    draft.line("ab", a, b, "AB", "p. 1");
    draft.seam("bord", ["ab"], "a", "b");
    const piece = draft.toPiece();

    expect(piece.steps[0]).toMatchObject({
      dependsOn: [],
      inputs: {},
      origin: "project-choice",
      status: "validated",
      diagnostics: [],
    });
    expect(piece.steps[1].origin).toBe("method");
    expect(piece.seams.bord.stepIds).toEqual(["ab"]);
  });

  it("le buste sérialisé conserve provenance, dépendances et coutures nommées", () => {
    const { dos, devant } = draftBuste({ ...DEMO_MEASUREMENTS, aisance: 0 });
    const serialized = JSON.parse(JSON.stringify({ dos, devant })) as {
      dos: typeof dos;
      devant: typeof devant;
    };
    expect(serialized.dos.seams.epaule.stepIds).toEqual([
      "epaule-dos-1",
      "bouche-pince-epaule-dos",
      "epaule-dos-2",
    ]);
    const epaule = serialized.dos.steps.find((step) => step.id === "epaule-dos-2")!;
    expect(epaule.origin).toBe("method");
    expect(epaule.status).toBe("validated");
    expect(epaule.dependsOn).toContain("pince-epaule-dos");
    expect(serialized.devant.seams.emmanchure.path).toHaveLength(1);
  });
});

describe("transformations rigides réversibles", () => {
  it("compose rotation puis translation et inverse sans perte", () => {
    const source = pt(4, -2);
    const rotation = rotationAroundTransform(pt(1, 1), 37);
    const translation = translationTransform(8, -3);
    const transform = composeTransforms(rotation, translation);
    const transformed = applyTransform(source, transform);
    const restored = applyTransform(transformed, invertTransform(transform));
    expect(dist(source, restored)).toBeLessThan(1e-10);
  });

  it("ferme et rouvre une géométrie de pince sans muter la source", () => {
    const { dos } = draftBuste({ ...DEMO_MEASUREMENTS, aisance: 0 });
    const dart = dos.darts.find((candidate) => candidate.id === "pince-epaule-dos")!;
    const source = dos.curves.emmanchure;
    const snapshot = JSON.stringify(source);
    const closed = closeDart(dart, source);
    const reopened = reopenDart(dart, closed);
    expect(JSON.stringify(source)).toBe(snapshot);
    expect(dist(reopened.beziers[0].p0, source.beziers[0].p0)).toBeLessThan(1e-9);
    expect(dist(reopened.beziers.at(-1)!.p1, source.beziers.at(-1)!.p1)).toBeLessThan(1e-9);
  });
});
