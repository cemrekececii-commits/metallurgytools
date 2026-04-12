"use client";
import { useRef, useState } from "react";

export default function PhysicalView({
  block, probe, probeDir = 1, probePos, probeIndex = 0,
  setProbePos, flaws, hoveredFlawId, onHoverFlaw,
  echoes = [], velocity = 3240,
}) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    updatePos(e);
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (isDragging) updatePos(e);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  const updatePos = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const scale = 250 / rect.width;
    const newPos = Math.max(10, Math.min(240, x * scale));
    setProbePos(newPos);
  };

  const renderBeam = () => {
    const beamColor = probe.color || "#3b82f6";
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "59, 130, 246";
    };
    const rgb = hexToRgb(beamColor);

    const effectiveProbePos = probe.angle > 0 ? probePos + probeDir * probeIndex : probePos;

    if (probe.angle === 0) {
      let hitDepth = block.thickness;
      if (block.id === "flaw" && flaws) {
        flaws.forEach((f) => {
          const dx = Math.abs(effectiveProbePos - f.x);
          if (dx < f.size + 6) {
            if (f.y < hitDepth) hitDepth = f.y;
          }
        });
      }
      return (
        <g>
          <rect x={effectiveProbePos - 6} y={0} width={12} height={hitDepth} fill={`rgba(${rgb}, 0.2)`} />
          {hitDepth === block.thickness && (
            <path d={`M ${effectiveProbePos - 3},${hitDepth} L ${effectiveProbePos},${hitDepth - 10} L ${effectiveProbePos + 3},${hitDepth}`} fill={`rgba(${rgb}, 0.4)`} />
          )}
        </g>
      );
    }

    const theta = (probe.angle * Math.PI) / 180;

    if (block.id === "k1") {
      const distToCenter = Math.abs(effectiveProbePos - 100);
      if (distToCenter < 30 && probeDir === 1) {
        const nextX = effectiveProbePos + probeDir * 100 * Math.sin(theta);
        const nextY = 100 * Math.cos(theta);
        return <path d={`M ${effectiveProbePos},0 L ${nextX},${nextY}`} stroke={`rgba(${rgb}, 0.4)`} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
      }
    } else if (block.id === "k2") {
      const distToCenter = Math.abs(effectiveProbePos - 25);
      if (distToCenter < 20) {
        if (probeDir === 1) {
          const nextX = effectiveProbePos + probeDir * 25 * Math.sin(theta);
          const nextY = 25 * Math.cos(theta);
          return <path d={`M ${effectiveProbePos},0 L ${nextX},${nextY}`} stroke={`rgba(${rgb}, 0.4)`} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
        } else {
          const nextX = effectiveProbePos + probeDir * 50 * Math.sin(theta);
          const nextY = 50 * Math.cos(theta);
          return <path d={`M ${effectiveProbePos},0 L ${nextX},${nextY}`} stroke={`rgba(${rgb}, 0.4)`} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
        }
      }
    }

    const legs = 3;
    let d = "";
    let currentX = effectiveProbePos;

    for (let i = 0; i < legs; i++) {
      const startY = i % 2 === 0 ? 0 : block.thickness;
      const endY = i % 2 === 0 ? block.thickness : 0;
      const nextX = currentX + probeDir * block.thickness * Math.tan(theta);
      if (i === 0) d += `M ${currentX},${startY} `;
      d += `L ${nextX},${endY} `;
      currentX = nextX;
    }

    return <path d={d} stroke={`rgba(${rgb}, 0.4)`} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-ew-resize touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <svg viewBox="-10 -30 270 100" className="w-full h-full overflow-visible">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect x="-10" y="-30" width="270" height="100" fill="url(#grid)" pointerEvents="none" />

        {/* Block */}
        <g className="block-group">
          {/* Ruler X */}
          <g className="ruler-x" pointerEvents="none">
            {Array.from({ length: 26 }).map((_, i) => (
              <g key={`x-${i}`} transform={`translate(${i * 10}, 0)`}>
                <line x1={0} y1={0} x2={0} y2={-2} stroke="#737373" strokeWidth="0.5" />
                {i % 5 === 0 && (
                  <text x={0} y={-3} fill="#737373" fontSize="4" textAnchor="middle">{i * 10}</text>
                )}
              </g>
            ))}
          </g>

          {/* Ruler Y */}
          <g className="ruler-y" pointerEvents="none">
            {Array.from({ length: Math.floor((block.thickness || 25) / 10) + 1 }).map((_, i) => (
              <g key={`y-${i}`} transform={`translate(0, ${i * 10})`}>
                <line x1={0} y1={0} x2={-2} y2={0} stroke="#737373" strokeWidth="0.5" />
                {i % 2 === 0 && (
                  <text x={-3} y={1.5} fill="#737373" fontSize="4" textAnchor="end">{i * 10}</text>
                )}
              </g>
            ))}
          </g>

          {block.id === "flaw" && (
            <>
              <rect x={0} y={0} width={250} height={block.thickness} fill="#404040" stroke="#525252" strokeWidth="2" />
              {flaws.map((f) => {
                const isHovered = hoveredFlawId === f.id;
                const flawEcho = echoes.find((e) => e.sourceId === f.id);
                let measurementText = null;

                if (flawEcho) {
                  const S = flawEcho.time * (velocity / 1000) / 2;
                  const theta = (probe.angle * Math.PI) / 180;
                  const PA = S * Math.sin(theta);
                  const rawDepth = S * Math.cos(theta);
                  const T = block.thickness;
                  const leg = Math.floor(rawDepth / T) + 1;
                  const rem = rawDepth % T;
                  const RA = leg % 2 !== 0 ? rem : T - rem;

                  measurementText = (
                    <g transform={`translate(${f.x}, ${f.y - (f.size * 1.15) - 3})`} pointerEvents="none">
                      <rect x="-26.5" y="-17.5" width="53" height="15" fill="rgba(0,0,0,0.8)" rx="1.5" stroke="#4ade80" strokeWidth="0.5" />
                      <text x="0" y="-12" fill="#4ade80" fontSize="4" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                        SA: {S.toFixed(1)}
                      </text>
                      <text x="0" y="-6.5" fill="#a78bfa" fontSize="4" textAnchor="middle" fontFamily="monospace">
                        PA: {PA.toFixed(1)} | RA: {RA.toFixed(1)}
                      </text>
                    </g>
                  );
                }

                return (
                  <g key={f.id}>
                    <circle
                      cx={f.x}
                      cy={f.y}
                      r={f.size * 1.15}
                      fill={isHovered ? "#fef08a" : "#ef4444"}
                      stroke={isHovered ? "#ca8a04" : "#7f1d1d"}
                      strokeWidth={isHovered ? "2.3" : "1.15"}
                      onPointerEnter={() => onHoverFlaw && onHoverFlaw(f.id)}
                      onPointerLeave={() => onHoverFlaw && onHoverFlaw(null)}
                      className="transition-colors cursor-pointer"
                    />
                    {measurementText}
                  </g>
                );
              })}
            </>
          )}
          {block.id === "k1" && (
            <g>
              <path d="M 0,0 L 250,0 L 250,25 L 0,25 Z" fill="#404040" stroke="#525252" strokeWidth="2" />
              <path d="M 100,0 A 100 100 0 0 1 200,100 L 100,100 Z" fill="#4a4a4a" stroke="#525252" strokeWidth="2" />
              <circle cx={100} cy={0} r={2} fill="#eab308" />
              <text x={100} y={-5} fill="#eab308" fontSize="8" textAnchor="middle">0</text>
            </g>
          )}
          {block.id === "k2" && (
            <g>
              <path d="M 0,0 L 75,0 L 75,12.5 L 0,12.5 Z" fill="#404040" stroke="#525252" strokeWidth="2" />
              <path d="M 25,0 A 25 25 0 0 1 50,25 L 25,25 Z" fill="#4a4a4a" stroke="#525252" strokeWidth="2" />
              <path d="M 25,0 A 50 50 0 0 0 -25,50 L 25,50 Z" fill="#4a4a4a" stroke="#525252" strokeWidth="2" />
              <circle cx={25} cy={0} r={2} fill="#eab308" />
              <text x={25} y={-5} fill="#eab308" fontSize="8" textAnchor="middle">0</text>
            </g>
          )}
        </g>

        {/* Beam */}
        {renderBeam()}

        {/* Probe */}
        <g transform={`translate(${probePos}, 0)`} pointerEvents="none">
          <rect x={-13.8} y={-23} width={27.6} height={23} fill={probe.color || "#3b82f6"} rx="2.3" />
          <rect x={-11.5} y={-23} width={23} height={5.75} fill="rgba(0,0,0,0.3)" rx="1.15" />
          {probe.angle > 0 && (
            <>
              <line
                x1={probeDir * probeIndex} y1={0}
                x2={probeDir * 23 * Math.sin(probe.angle * Math.PI / 180) + probeDir * probeIndex}
                y2={-23 * Math.cos(probe.angle * Math.PI / 180)}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2.3"
              />
              <line
                x1={probeDir * probeIndex} y1={0}
                x2={probeDir * probeIndex} y2={-5}
                stroke="#ef4444"
                strokeWidth="1.5"
              />
            </>
          )}
          <circle cx={0} cy={0} r={1.725} fill="white" />
          {probe.angle > 0 && (
            <circle cx={probeDir * probeIndex} cy={0} r={1.5} fill="#ef4444" />
          )}
          <text x={0} y={-25} fill="#9ca3af" fontSize="4" textAnchor="middle" fontFamily="monospace">
            {probePos.toFixed(1)} mm
          </text>
        </g>
      </svg>
    </div>
  );
}
