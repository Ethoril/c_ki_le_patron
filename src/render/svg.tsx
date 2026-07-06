/**
 * Rendu écran d'une PatternPiece. Code couleur du livre : lignes de référence
 * en rouge (milieux, taille), tracé en noir, lignes d'aide en gris.
 * Unités du SVG = centimètres ; l'épaisseur des traits est indépendante du
 * zoom (vector-effect non-scaling-stroke).
 */

import type { PatternPiece, Dart, Mark } from "../engine/types";
import { toSvgPath } from "../engine/geometry/path";
import { dartOutline } from "../engine/drafting";

const STROKE = { vectorEffect: "non-scaling-stroke" as const };

function DartShape({ dart }: { dart: Dart }) {
  const poly = dartOutline(dart);
  return (
    <g>
      <path
        d={`M ${poly.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
        fill="none"
        stroke="black"
        strokeWidth={1}
        {...STROKE}
      />
      <line
        x1={dart.axis[0].x}
        y1={dart.axis[0].y}
        x2={dart.axis[1].x}
        y2={dart.axis[1].y}
        stroke="black"
        strokeWidth={0.5}
        strokeDasharray="4 3"
        {...STROKE}
      />
    </g>
  );
}

function MarkShape({ mark }: { mark: Mark }) {
  if (mark.kind === "droit-fil" && mark.to) {
    const { at, to } = mark;
    // vector-effect ne s'hérite pas : il doit être posé sur chaque élément
    return (
      <g stroke="black" fill="none">
        <line x1={at.x} y1={at.y} x2={to.x} y2={to.y} strokeWidth={1} {...STROKE} />
        {/* pointes de flèche aux deux bouts (droit-fil) */}
        <path d={`M ${at.x - 0.4} ${at.y + 0.8} L ${at.x} ${at.y} L ${at.x + 0.4} ${at.y + 0.8}`} strokeWidth={1} {...STROKE} />
        <path d={`M ${to.x - 0.4} ${to.y - 0.8} L ${to.x} ${to.y} L ${to.x + 0.4} ${to.y - 0.8}`} strokeWidth={1} {...STROKE} />
      </g>
    );
  }
  return (
    <g>
      <circle cx={mark.at.x} cy={mark.at.y} r={0.25} fill="black" />
      {mark.label && (
        <text x={mark.at.x + 0.6} y={mark.at.y - 0.4} fontSize={1.1} fill="black">
          {mark.label}
        </text>
      )}
    </g>
  );
}

export function PieceSvg({ piece, construction }: { piece: PatternPiece; construction: boolean }) {
  return (
    <g>
      {construction &&
        piece.helpers.map((h, i) =>
          h.kind === "line" ? (
            <line
              key={i}
              x1={h.a.x}
              y1={h.a.y}
              x2={h.b.x}
              y2={h.b.y}
              stroke="#9ca3af"
              strokeWidth={0.75}
              strokeDasharray="5 4"
              {...STROKE}
            />
          ) : null,
        )}
      {piece.refLines.map((r, i) =>
        r.kind === "line" ? (
          <line key={i} x1={r.a.x} y1={r.a.y} x2={r.b.x} y2={r.b.y} stroke="#dc2626" strokeWidth={1} {...STROKE} />
        ) : null,
      )}
      <path d={toSvgPath(piece.outline)} fill="rgba(0,0,0,0.02)" stroke="black" strokeWidth={1.75} {...STROKE} />
      {piece.darts.map((d) => (
        <DartShape key={d.id} dart={d} />
      ))}
      {piece.marks.map((m) => (
        <MarkShape key={m.id} mark={m} />
      ))}
      {piece.labels.map((l, i) => (
        <text key={i} x={l.at.x} y={l.at.y} fontSize={1.6} fontWeight={600} textAnchor={l.anchor ?? "start"} fill="#374151">
          {l.text}
        </text>
      ))}
      {construction &&
        Object.entries(piece.points).map(([id, p]) => (
          <g key={id}>
            <circle cx={p.x} cy={p.y} r={0.18} fill="#2563eb" />
            <text x={p.x + 0.35} y={p.y - 0.25} fontSize={0.8} fill="#2563eb">
              {id}
            </text>
          </g>
        ))}
    </g>
  );
}
