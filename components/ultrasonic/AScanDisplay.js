"use client";
import { useRef, useState } from "react";

export default function AScanDisplay({
  echoes, range, gate, zoomX = 1, zoomY = 1,
  cursorsEnabled, cursors, onCursorsChange,
  hoveredFlawId, onHoverFlaw,
}) {
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  const points = [{ x: 0, y: 100 }];
  const sortedEchoes = [...echoes].sort((a, b) => a.distance - b.distance);
  let lastX = 0;

  sortedEchoes.forEach((e) => {
    const x = (e.distance / range) * 1000 * zoomX;
    const y = Math.max(0, 100 - e.amplitude * zoomY);
    const w = (e.width / range) * 1000 * zoomX;
    if (x - w > lastX) points.push({ x: x - w, y: 100 });
    points.push({ x, y });
    points.push({ x: x + w, y: 100 });
    lastX = x + w;
  });

  const maxX = 1000 * Math.max(1, zoomX);
  points.push({ x: maxX, y: 100 });
  const pathD = `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`;

  const gateX = (gate.start / range) * 1000 * zoomX;
  const gateW = (gate.width / range) * 1000 * zoomX;
  const gateY = Math.max(0, 100 - gate.threshold * zoomY);

  const getDistance = (clientX) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const xSvg = ((clientX - rect.left) / rect.width) * 1000;
    return (xSvg / (1000 * zoomX)) * range;
  };

  const handlePointerDown = (e) => {
    if (!cursorsEnabled) return;
    const dist = getDistance(e.clientX);
    const threshold = range / (20 * zoomX);
    const d1 = Math.abs(dist - cursors.c1);
    const d2 = Math.abs(dist - cursors.c2);
    if (d1 < d2 && d1 < threshold) {
      setDragging("c1");
      e.target.setPointerCapture(e.pointerId);
    } else if (d2 < threshold) {
      setDragging("c2");
      e.target.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const dist = Math.max(0, getDistance(e.clientX));
    onCursorsChange({ ...cursors, [dragging]: dist });
  };

  const handlePointerUp = (e) => {
    if (dragging) {
      setDragging(null);
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  const c1X = cursors ? (cursors.c1 / range) * 1000 * zoomX : 0;
  const c2X = cursors ? (cursors.c2 / range) * 1000 * zoomX : 0;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 100"
      className={`w-full h-full overflow-hidden ${cursorsEnabled ? "cursor-crosshair touch-none" : ""}`}
      preserveAspectRatio="none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Graticule */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={`v-${i}`} x1={i * 100} y1={0} x2={i * 100} y2={100} stroke="#1a331a" strokeWidth={i % 5 === 0 ? 2 : 1} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`h-${i}`} x1={0} y1={i * 20} x2={1000} y2={i * 20} stroke="#1a331a" strokeWidth={i === 0 || i === 5 ? 2 : 1} />
      ))}

      {/* Gate */}
      <line x1={gateX} y1={gateY} x2={gateX + gateW} y2={gateY} stroke="#ef4444" strokeWidth={2} />
      <rect x={gateX} y={gateY} width={gateW} height={100 - gateY} fill="rgba(239,68,68,0.1)" />

      {/* Signal */}
      <path
        d={pathD}
        fill="none"
        stroke="#4ade80"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        style={{ filter: "drop-shadow(0 0 2px #4ade80)" }}
      />

      {/* Fill under signal */}
      <path d={`${pathD} L ${maxX},100 L 0,100 Z`} fill="rgba(74,222,128,0.1)" />

      {/* Highlighted Echo */}
      {hoveredFlawId &&
        sortedEchoes
          .filter((e) => e.sourceId === hoveredFlawId)
          .map((e, i) => {
            const x = (e.distance / range) * 1000 * zoomX;
            const y = Math.max(0, 100 - e.amplitude * zoomY);
            const w = (e.width / range) * 1000 * zoomX;
            return (
              <path
                key={`hl-${i}`}
                className="animate-echo-glow"
                d={`M ${x - w},100 L ${x},${y} L ${x + w},100`}
                fill="rgba(254,240,138,0.4)"
                stroke="#fef08a"
                strokeWidth={3}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

      {/* Invisible hit areas for hovering echoes */}
      {onHoverFlaw &&
        sortedEchoes
          .filter((e) => e.sourceId && typeof e.sourceId === "number")
          .map((e, i) => {
            const x = (e.distance / range) * 1000 * zoomX;
            const w = Math.max(10, (e.width / range) * 1000 * zoomX);
            return (
              <rect
                key={`hit-${i}`}
                x={x - w}
                y={0}
                width={w * 2}
                height={100}
                fill="transparent"
                onPointerEnter={() => onHoverFlaw(e.sourceId)}
                onPointerLeave={() => onHoverFlaw(null)}
                className="cursor-pointer"
              />
            );
          })}

      {/* Cursors */}
      {cursorsEnabled && (
        <>
          <line x1={c1X} y1={0} x2={c1X} y2={100} stroke="#a855f7" strokeWidth={dragging === "c1" ? 4 : 2} strokeDasharray="4 4" />
          <polygon points={`${c1X - 6},0 ${c1X + 6},0 ${c1X},8`} fill="#a855f7" />
          <line x1={c2X} y1={0} x2={c2X} y2={100} stroke="#f97316" strokeWidth={dragging === "c2" ? 4 : 2} strokeDasharray="4 4" />
          <polygon points={`${c2X - 6},0 ${c2X + 6},0 ${c2X},8`} fill="#f97316" />
        </>
      )}
    </svg>
  );
}
