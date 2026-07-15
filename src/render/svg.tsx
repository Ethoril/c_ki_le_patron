/**
 * Rendu écran d'une PatternPiece. Code couleur du livre : lignes de référence
 * en rouge (milieux, taille), tracé en noir, lignes d'aide en gris.
 * Unités du SVG = centimètres ; l'épaisseur des traits est indépendante du
 * zoom (vector-effect non-scaling-stroke).
 */

import type { PatternPiece, Dart, Mark, Pt } from "../engine/types";
import { toSvgPath } from "../engine/geometry/path";
import { dartOutline } from "../engine/drafting";

const STROKE = { vectorEffect: "non-scaling-stroke" as const };

const PT_FONT = 0.8; // hauteur du texte des libellés de points (cm)
const CHAR_W = 0.5 * PT_FONT; // largeur moyenne d'un caractère (sans-serif)

type Rect = { x: number; y: number; w: number; h: number };
type Placement = {
  id: string;
  p: Pt;
  tx: number;
  ty: number;
  anchor: "start" | "middle" | "end";
  leader: boolean;
};

const LINE_H = PT_FONT + 0.35; // hauteur de boîte d'un libellé (interligne)
const PAD_X = 0.15;

// Boîte englobante d'un libellé selon son ancrage. La ligne de base (ty) est le
// bas visuel du texte ; le texte monte de PT_FONT au-dessus.
function labelRect(tx: number, ty: number, w: number, anchor: "start" | "end"): Rect {
  const x = anchor === "start" ? tx : tx - w;
  return { x: x - PAD_X, y: ty - PT_FONT - 0.1, w: w + 2 * PAD_X, h: LINE_H };
}
const overlap = (a: Rect, b: Rect) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

/**
 * Placement anti-chevauchement des libellés de points (mode construction).
 *
 * Les noms sont larges (jusqu'à ~7 cm) mais les points sont serrés (1 à 5 cm) :
 * aucun simple décalage autour du point ne suffit. On ancre donc chaque libellé
 * *vers l'extérieur* de la pièce (à gauche des points de gauche, à droite des
 * points de droite) puis on résout les collisions en les *empilant
 * verticalement* — deux noms larges qui se recouvrent en x se séparent d'une
 * ligne en y. Un trait de rappel relie le point au libellé qui s'est éloigné.
 */
export function placeLabels(points: { id: string; p: Pt }[]): Placement[] {
  if (points.length === 0) return [];
  const cx = points.reduce((s, { p }) => s + p.x, 0) / points.length;

  const items = points.map(({ id, p }) => {
    const anchor: "start" | "end" = p.x < cx ? "end" : "start";
    const dir = p.x < cx ? -1 : 1;
    return {
      id,
      p,
      w: id.length * CHAR_W,
      anchor,
      tx: p.x + dir * 0.6,
      ty: p.y + 0.3, // ligne de base légèrement sous le point
    };
  });

  // Désempilage vertical itératif : on repousse les paires qui se chevauchent.
  for (let iter = 0; iter < 80; iter++) {
    let moved = false;
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];
        const ra = labelRect(a.tx, a.ty, a.w, a.anchor);
        const rb = labelRect(b.tx, b.ty, b.w, b.anchor);
        if (!overlap(ra, rb)) continue;
        const push = (Math.min(ra.y + ra.h, rb.y + rb.h) - Math.max(ra.y, rb.y)) / 2 + 0.05;
        if (a.ty <= b.ty) {
          a.ty -= push;
          b.ty += push;
        } else {
          a.ty += push;
          b.ty -= push;
        }
        moved = true;
      }
    }
    if (!moved) break;
  }

  return items.map((it) => ({
    id: it.id,
    p: it.p,
    tx: it.tx,
    ty: it.ty,
    anchor: it.anchor,
    leader: Math.hypot(it.tx - it.p.x, it.ty - 0.3 - it.p.y) > 1.3,
  }));
}

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
    </g>
  );
}

/**
 * Calque des libellés de points (mode construction), calculé sur l'ensemble des
 * pièces d'un coup pour que les noms d'une pièce ne recouvrent pas ceux d'une
 * autre (typiquement dans l'espace entre dos et devant). À rendre au-dessus de
 * toutes les pièces.
 */
export function ConstructionLabels({ pieces }: { pieces: PatternPiece[] }) {
  const points = pieces.flatMap((piece) =>
    Object.entries(piece.points).map(([id, p]) => ({ id, p })),
  );
  return (
    <g>
      {points.map(({ id, p }) => (
        <circle key={`dot-${id}-${p.x}-${p.y}`} cx={p.x} cy={p.y} r={0.18} fill="#2563eb" />
      ))}
      {placeLabels(points).map((l) => (
        <g key={`lbl-${l.id}-${l.p.x}-${l.p.y}`}>
          {l.leader && (
            <line
              x1={l.p.x}
              y1={l.p.y}
              x2={l.tx}
              y2={l.ty - PT_FONT * 0.3}
              stroke="#93c5fd"
              strokeWidth={0.5}
              {...STROKE}
            />
          )}
          <text x={l.tx} y={l.ty} fontSize={PT_FONT} textAnchor={l.anchor} fill="#2563eb">
            {l.id}
          </text>
        </g>
      ))}
    </g>
  );
}
