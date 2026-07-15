/** Viewer SVG : zoom molette (centré sur le curseur), pan à la souris, grille centimétrique. */

import { useRef, useState, useMemo, useEffect } from "react";
import type { Pattern } from "../engine/generate";
import { boundingBox } from "../engine/geometry/path";
import { PieceSvg, ConstructionLabels } from "../render/svg";

type ViewBox = { x: number; y: number; w: number; h: number };

function Grid({ vb }: { vb: ViewBox }) {
  const lines = useMemo(() => {
    const out: { x1: number; y1: number; x2: number; y2: number; major: boolean }[] = [];
    const x0 = Math.floor(vb.x);
    const x1 = Math.ceil(vb.x + vb.w);
    const y0 = Math.floor(vb.y);
    const y1 = Math.ceil(vb.y + vb.h);
    if (x1 - x0 > 400) return out; // trop dézoomé : pas de grille
    for (let x = x0; x <= x1; x++) out.push({ x1: x, y1: y0, x2: x, y2: y1, major: x % 10 === 0 });
    for (let y = y0; y <= y1; y++) out.push({ x1: x0, y1: y, x2: x1, y2: y, major: y % 10 === 0 });
    return out;
  }, [vb]);
  return (
    <g>
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={l.major ? "#d1d5db" : "#eceef1"}
          strokeWidth={l.major ? 1 : 0.5}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  );
}

export function Viewer({ pattern, construction }: { pattern: Pattern; construction: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const initial = useMemo<ViewBox>(() => {
    const boxes = pattern.pieces.map((p) => boundingBox(p.outline));
    const minX = Math.min(...boxes.map((b) => b.min.x)) - 4;
    const minY = Math.min(...boxes.map((b) => b.min.y)) - 4;
    const maxX = Math.max(...boxes.map((b) => b.max.x)) + 4;
    const maxY = Math.max(...boxes.map((b) => b.max.y)) + 4;
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    // recadre uniquement quand la géométrie change
  }, [pattern]);
  const [vb, setVb] = useState<ViewBox | null>(null);
  // recadre sur le nouveau tracé à chaque génération : sans cela le zoom/pan
  // reste calé sur l'ancien patron et le nouveau peut se retrouver hors champ
  useEffect(() => setVb(null), [pattern]);
  const view = vb ?? initial;
  const drag = useRef<{ px: number; py: number; vb: ViewBox } | null>(null);

  const toLocal = (e: React.PointerEvent | React.WheelEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: view.x + ((e.clientX - rect.left) / rect.width) * view.w,
      y: view.y + ((e.clientY - rect.top) / rect.height) * view.h,
    };
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
      className="h-full w-full touch-none bg-white"
      preserveAspectRatio="xMidYMid meet"
      onWheel={(e) => {
        const k = e.deltaY > 0 ? 1.15 : 1 / 1.15;
        const c = toLocal(e);
        setVb({
          x: c.x - (c.x - view.x) * k,
          y: c.y - (c.y - view.y) * k,
          w: view.w * k,
          h: view.h * k,
        });
      }}
      onPointerDown={(e) => {
        (e.target as Element).setPointerCapture?.(e.pointerId);
        drag.current = { px: e.clientX, py: e.clientY, vb: view };
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const rect = svgRef.current!.getBoundingClientRect();
        const dx = ((e.clientX - drag.current.px) / rect.width) * drag.current.vb.w;
        const dy = ((e.clientY - drag.current.py) / rect.height) * drag.current.vb.h;
        setVb({ ...drag.current.vb, x: drag.current.vb.x - dx, y: drag.current.vb.y - dy });
      }}
      onPointerUp={() => (drag.current = null)}
      onDoubleClick={() => setVb(null)}
    >
      <Grid vb={view} />
      {pattern.pieces.map((p) => (
        <PieceSvg key={p.id} piece={p} construction={construction} />
      ))}
      {construction && <ConstructionLabels pieces={pattern.pieces} />}
    </svg>
  );
}
