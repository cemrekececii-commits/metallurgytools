"use client";
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { CRITICAL, determineSteelType, getPhaseLines, getPhaseRegions, identifyPhaseRegion, calculateLeverRule, calculateTotalPhases, interpolateY } from "@/lib/phaseDiagramData";

const W = 700, H = 550, M = { t: 30, r: 30, b: 50, l: 60 };
const cw = W - M.l - M.r, ch = H - M.t - M.b;
const xScale = (c) => M.l + (c / 6.7) * cw;
const yScale = (t) => M.t + ((1600 - t) / (1600 - 0)) * ch;
const xInv = (px) => Math.max(0, Math.min(6.67, ((px - M.l) / cw) * 6.7));
const yInv = (py) => Math.max(0, Math.min(1600, 1600 - ((py - M.t) / ch) * 1600));

function pointsToPath(pts) {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p[0])},${yScale(p[1])}`).join(" ") + " Z";
}
function lineToPath(pts) {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p[0])},${yScale(p[1])}`).join(" ");
}

const T_TR = {
  title: "Fe-Fe₃C Faz Diyagramı Simülatörü",
  subtitle: "İnteraktif demir-sementit denge faz diyagramı. Kaldıraç kuralı hesaplaması ve faz bölgesi tanımlama.",
  carbon: "Karbon İçeriği (ağ.%)",
  temp: "Sıcaklık (°C)",
  steelType: "Çelik Tipi",
  phaseRegion: "Faz Bölgesi",
  leverRule: "Kaldıraç Kuralı (A1 altı)",
  totalPhases: "Toplam Denge Fazları",
  ferrite: "Ferrit (α)", cementite: "Sementit (Fe₃C)",
  clickDiagram: "Diyagram üzerine tıklayarak karbon ve sıcaklık seçin.",
  criticalPts: "Kritik Noktalar",
  warning: "Bu simülatör denge (metastabil Fe-Fe₃C) koşullarını gösterir. Gerçek mikroyapılar soğuma hızına bağlıdır.",
  free: "ÜCRETSİZ", upgrade: "Yükselt →",
  wantMore: "Daha fazla araç mı istiyorsunuz?",
  viewPlans: "Planları İncele →",
  references: "Referanslar",
};
const T_EN = {
  title: "Fe-Fe₃C Phase Diagram Simulator",
  subtitle: "Interactive iron-cementite equilibrium phase diagram with lever rule calculation and phase region identification.",
  carbon: "Carbon Content (wt%)",
  temp: "Temperature (°C)",
  steelType: "Steel Type",
  phaseRegion: "Phase Region",
  leverRule: "Lever Rule (below A1)",
  totalPhases: "Total Equilibrium Phases",
  ferrite: "Ferrite (α)", cementite: "Cementite (Fe₃C)",
  clickDiagram: "Click on the diagram to select carbon and temperature.",
  criticalPts: "Critical Points",
  warning: "This simulator shows equilibrium (metastable Fe-Fe₃C) conditions. Real microstructures depend on cooling rate.",
  free: "FREE", upgrade: "Upgrade →",
  wantMore: "Want more tools?",
  viewPlans: "View Plans →",
  references: "References",
};

export default function PhaseDiagramSimulator() {
  const { lang, switchLang } = useLang();
  const t = lang === "tr" ? T_TR : T_EN;

  const [carbon, setCarbon] = useState(0.4);
  const [temp, setTemp] = useState(600);
  const [hover, setHover] = useState(null);

  const regions = useMemo(() => getPhaseRegions(), []);
  const lines = useMemo(() => getPhaseLines(), []);
  const steelType = useMemo(() => determineSteelType(carbon), [carbon]);
  const phaseInfo = useMemo(() => identifyPhaseRegion(carbon, temp), [carbon, temp]);
  const lever = useMemo(() => calculateLeverRule(carbon, temp), [carbon, temp]);
  const totalPhases = useMemo(() => calculateTotalPhases(carbon), [carbon]);

  const handleSvgClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const c = Number(xInv(px).toFixed(2));
    const tp = Math.round(yInv(py));
    if (tp >= 0 && tp <= 1600) { setCarbon(c); setTemp(tp); }
  }, []);

  const handleSvgMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setHover({ c: xInv(px).toFixed(2), t: Math.round(yInv(py)), x: px, y: py });
  }, []);

  // X axis ticks
  const xTicks = [0, 0.76, 1, 2, 2.14, 3, 4, 4.3, 5, 6, 6.67];
  const yTicks = [0, 200, 400, 600, 727, 912, 1000, 1147, 1200, 1400, 1495, 1538, 1600];

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 no-underline text-dark-50">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded-md flex items-center justify-center text-lg font-bold text-dark-800 font-mono">M</div>
            <span className="font-semibold text-lg tracking-tight">MetallurgyTools</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="text-dark-200 text-sm">📊 Fe-C</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/[0.05] rounded-full p-0.5 border border-white/10">
            <button onClick={() => switchLang("tr")} className={`px-2.5 py-1 rounded-full text-xs font-medium border-none cursor-pointer font-sans ${lang === "tr" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>TR</button>
            <button onClick={() => switchLang("en")} className={`px-2.5 py-1 rounded-full text-xs font-medium border-none cursor-pointer font-sans ${lang === "en" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>EN</button>
          </div>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">{t.free}</span>
          <Link href="/pricing" className="text-gold-400 text-sm no-underline hover:underline">{t.upgrade}</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">{t.title}</h1>
        <p className="text-dark-300 text-sm mb-6">{t.subtitle}</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* Carbon Slider */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs text-dark-300 font-semibold uppercase tracking-wider">{t.carbon}</label>
                <span className="text-2xl font-bold font-mono text-gold-400">{carbon.toFixed(2)}%</span>
              </div>
              <input type="range" min="0" max="6.67" step="0.01" value={carbon}
                onChange={e => setCarbon(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-yellow-500 bg-dark-800" />
              <div className="flex justify-between text-[10px] text-dark-300 mt-1">
                <span>0% (Fe)</span><span>0.76%</span><span>2.14%</span><span>6.67%</span>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs text-dark-300 font-semibold uppercase tracking-wider">{t.temp}</label>
                <span className="text-2xl font-bold font-mono text-red-400">{temp}°C</span>
              </div>
              <input type="range" min="0" max="1600" step="1" value={temp}
                onChange={e => setTemp(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-red-500 bg-dark-800" />
              <div className="flex justify-between text-[10px] text-dark-300 mt-1">
                <span>0°C</span><span>727°C</span><span>1147°C</span><span>1600°C</span>
              </div>
            </div>

            {/* Steel Type & Phase Region */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 space-y-3">
              <div>
                <div className="text-[10px] text-dark-300 uppercase font-bold tracking-wider mb-1">{t.steelType}</div>
                <div className="text-sm font-semibold text-gold-400">{steelType}</div>
              </div>
              <div>
                <div className="text-[10px] text-dark-300 uppercase font-bold tracking-wider mb-1">{t.phaseRegion}</div>
                <div className="text-sm font-semibold text-dark-50">{phaseInfo.region}</div>
                <div className="text-xs text-dark-300 mt-1">{phaseInfo.desc}</div>
              </div>
            </div>

            {/* Lever Rule */}
            {lever && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
                <div className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mb-3">{t.leverRule}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-300">{lever.phase1.name}</span>
                    <span className="font-bold font-mono text-dark-50">{lever.phase1.pct}%</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${lever.phase1.pct}%` }} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-300">{lever.phase2.name}</span>
                    <span className="font-bold font-mono text-dark-50">{lever.phase2.pct}%</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full transition-all" style={{ width: `${lever.phase2.pct}%` }} />
                  </div>
                </div>
              </div>
            )}

            {/* Total Phases */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
              <div className="text-[10px] text-dark-300 uppercase font-bold tracking-wider mb-3">{t.totalPhases}</div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-dark-300">{t.ferrite}</span>
                <span className="font-mono font-bold text-green-400">{totalPhases.ferrite.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-300">{t.cementite}</span>
                <span className="font-mono font-bold text-dark-100">{totalPhases.cementite.toFixed(1)}%</span>
              </div>
            </div>

            {/* Critical Points */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
              <div className="text-[10px] text-dark-300 uppercase font-bold tracking-wider mb-3">{t.criticalPts}</div>
              <div className="space-y-1.5 text-xs text-dark-200 font-mono">
                <div>A₁ = 727°C ({lang === "tr" ? "Ötektoid" : "Eutectoid"})</div>
                <div>A₃ = {interpolateY(Math.min(carbon, 0.76), [0, 912], [0.76, 727]).toFixed(0)}°C ({lang === "tr" ? "bu bileşimde" : "at this composition"})</div>
                <div>{lang === "tr" ? "Ötektoid" : "Eutectoid"}: 0.76% C</div>
                <div>{lang === "tr" ? "Ötektik" : "Eutectic"}: 4.3% C, 1147°C</div>
                <div>{lang === "tr" ? "Peritektik" : "Peritectic"}: 1495°C</div>
              </div>
            </div>
          </div>

          {/* Phase Diagram SVG */}
          <div className="lg:col-span-9">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ cursor: "crosshair" }}
                onClick={handleSvgClick} onMouseMove={handleSvgMove} onMouseLeave={() => setHover(null)}>
                <rect x={M.l} y={M.t} width={cw} height={ch} fill="#0f172a" />

                {/* Phase Regions */}
                {regions.map(r => (
                  <path key={r.id} d={pointsToPath(r.pts)} fill={r.color} fillOpacity={0.15} stroke="none" />
                ))}

                {/* Phase Lines */}
                {lines.map(l => (
                  <path key={l.name} d={lineToPath(l.points)} fill="none" stroke={l.color}
                    strokeWidth={l.w} strokeDasharray={l.dash || "none"} strokeLinecap="round" />
                ))}

                {/* Region Labels */}
                {regions.map(r => {
                  const cx = r.pts.reduce((s, p) => s + p[0], 0) / r.pts.length;
                  const cy = r.pts.reduce((s, p) => s + p[1], 0) / r.pts.length;
                  const px = xScale(cx), py = yScale(cy);
                  if (px < M.l || px > W - M.r || py < M.t || py > H - M.b) return null;
                  return (
                    <text key={r.id} x={px} y={py} textAnchor="middle" dominantBaseline="middle"
                      fill={r.color} fontSize="10" fontWeight="700" opacity="0.8" style={{ pointerEvents: "none" }}>
                      {r.name}
                    </text>
                  );
                })}

                {/* Line Labels */}
                {lines.filter(l => ["A1", "A3", "Acm", "Liquidus", "Eutectic", "Fe₃C"].includes(l.name)).map(l => {
                  const p1 = l.points[0], p2 = l.points[l.points.length > 2 ? 2 : 1];
                  const mx = (xScale(p1[0]) + xScale(p2[0])) / 2;
                  const my = (yScale(p1[1]) + yScale(p2[1])) / 2;
                  return (
                    <g key={l.name + "-label"}>
                      <text x={mx} y={my - 6} textAnchor="middle" fill={l.color}
                        fontSize="11" fontWeight="800" stroke="#0f172a" strokeWidth="3" paintOrder="stroke">
                        {l.name}
                      </text>
                    </g>
                  );
                })}

                {/* Axes */}
                <line x1={M.l} y1={H - M.b} x2={W - M.r} y2={H - M.b} stroke="#475569" strokeWidth="1" />
                <line x1={M.l} y1={M.t} x2={M.l} y2={H - M.b} stroke="#475569" strokeWidth="1" />
                {xTicks.map(v => {
                  const px = xScale(v);
                  if (px < M.l || px > W - M.r) return null;
                  return (<g key={`xt-${v}`}>
                    <line x1={px} y1={H - M.b} x2={px} y2={H - M.b + 5} stroke="#64748b" />
                    <text x={px} y={H - M.b + 16} textAnchor="middle" fill="#94a3b8" fontSize="9">{v}</text>
                  </g>);
                })}
                <text x={W / 2} y={H - 5} textAnchor="middle" fill="#94a3b8" fontSize="11">Carbon Content (wt%)</text>

                {yTicks.filter(v => v >= 0 && v <= 1600).map(v => {
                  const py = yScale(v);
                  if (py < M.t || py > H - M.b) return null;
                  const isKey = [727, 912, 1147, 1495, 1538].includes(v);
                  return (<g key={`yt-${v}`}>
                    <line x1={M.l - 5} y1={py} x2={M.l} y2={py} stroke="#64748b" />
                    <text x={M.l - 8} y={py + 3} textAnchor="end" fill={isKey ? "#f59e0b" : "#94a3b8"} fontSize="9" fontWeight={isKey ? "700" : "400"}>{v}</text>
                  </g>);
                })}
                <text x={12} y={H / 2} textAnchor="middle" fill="#94a3b8" fontSize="11" transform={`rotate(-90, 12, ${H / 2})`}>Temperature (°C)</text>

                {/* Cursor crosshairs */}
                <line x1={xScale(carbon)} y1={M.t} x2={xScale(carbon)} y2={H - M.b}
                  stroke="#dc2626" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.7" />
                <line x1={M.l} y1={yScale(temp)} x2={W - M.r} y2={yScale(temp)}
                  stroke="#dc2626" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                <circle cx={xScale(carbon)} cy={yScale(temp)} r="5" fill="#dc2626" stroke="white" strokeWidth="2" />

                {/* Hover tooltip */}
                {hover && hover.t >= 0 && hover.t <= 1600 && (
                  <g>
                    <rect x={hover.x + 10} y={hover.y - 30} width="90" height="28" rx="4"
                      fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.9" />
                    <text x={hover.x + 55} y={hover.y - 19} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">
                      C: {hover.c}%
                    </text>
                    <text x={hover.x + 55} y={hover.y - 8} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">
                      T: {hover.t}°C
                    </text>
                  </g>
                )}
              </svg>
            </div>

            <p className="text-xs text-dark-300 text-center mt-2">{t.clickDiagram}</p>

            {/* Warning */}
            <div className="mt-4 bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-xs text-dark-200">
              <span className="text-orange-400 font-semibold">⚠</span> {t.warning}
            </div>

            {/* References */}
            <div className="mt-4 bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
              <div className="text-xs font-semibold text-dark-100 mb-2">{t.references}</div>
              <div className="text-[11px] text-dark-300 space-y-1 font-mono">
                <div>• Callister & Rethwisch, Materials Science and Engineering, 10th Ed.</div>
                <div>• ASM Handbook Vol. 3: Alloy Phase Diagrams</div>
                <div>• Bhadeshia & Honeycombe, Steels: Microstructure and Properties, 4th Ed.</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">{t.wantMore}</h3>
          <p className="text-dark-300 text-sm mb-4">
            {lang === "tr" ? "Sertlik çevirici, birim dönüştürücü ve daha fazlası için üye olun." : "Sign up for hardness converter, unit converter and more."}
          </p>
          <Link href="/pricing" className="inline-block bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-6 py-2.5 text-sm font-semibold no-underline hover:shadow-lg hover:shadow-gold-400/20 transition-all">{t.viewPlans}</Link>
        </div>
      </div>
    </div>
  );
}
