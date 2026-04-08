"use client";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { CRITICAL, determineSteelType, getPhaseLines, getPhaseRegions, identifyPhaseRegion, calculateLeverRule, calculateTotalPhases, interpolateY, getTieLine, getCoolingIntersections } from "@/lib/phaseDiagramData";

const BASE_W = 750, BASE_H = 580;
const M = { t: 30, r: 30, b: 50, l: 60 };
const cw = BASE_W - M.l - M.r, ch = BASE_H - M.t - M.b;

function xS(c, z) { return M.l + (c / 6.7) * cw * z.s + z.tx; }
function yS(t, z) { return M.t + ((1600 - t) / 1600) * ch * z.s + z.ty; }
function xInv(px, z) { return Math.max(0, Math.min(6.67, ((px - M.l - z.tx) / (cw * z.s)) * 6.7)); }
function yInv(py, z) { return Math.max(0, Math.min(1600, 1600 - ((py - M.t - z.ty) / (ch * z.s)) * 1600)); }

function ptsToPath(pts, z) { return pts.map((p, i) => `${i === 0 ? "M" : "L"}${xS(p[0], z)},${yS(p[1], z)}`).join(" ") + " Z"; }
function lineToSvg(pts, z) { return pts.map((p, i) => `${i === 0 ? "M" : "L"}${xS(p[0], z)},${yS(p[1], z)}`).join(" "); }

const Z0 = { s: 1, tx: 0, ty: 0 };

const TR = {
  title: "Fe-Fe\u2083C Faz Diyagram\u0131 Sim\u00fclat\u00f6r\u00fc", subtitle: "\u0130nteraktif faz diyagram\u0131 \u2014 so\u011fuma sim\u00fclasyonu, kald\u0131ra\u00e7 kural\u0131, mikroyap\u0131 g\u00f6rselle\u015ftirme.",
  carbon: "Karbon (a\u011f.%)", temp: "S\u0131cakl\u0131k (\u00b0C)", steelType: "\u00c7elik Tipi", phaseRegion: "Faz B\u00f6lgesi",
  leverRule: "Kald\u0131ra\u00e7 Kural\u0131", totalPhases: "Toplam Denge Fazlar\u0131", ferrite: "Ferrit (\u03b1)", cementite: "Sementit (Fe\u2083C)",
  clickDiagram: "T\u0131klayarak karbon/s\u0131cakl\u0131k se\u00e7in. Scroll ile zoom yap\u0131n.",
  warning: "Denge (metastabil Fe-Fe\u2083C) ko\u015fullar\u0131. Ger\u00e7ek mikroyap\u0131lar so\u011fuma h\u0131z\u0131na ba\u011fl\u0131d\u0131r.",
  startCooling: "So\u011fuma Ba\u015flat", stopCooling: "So\u011fumay\u0131 Durdur", microstructure: "Mikroyap\u0131 Sim\u00fclasyonu",
  free: "\u00dcCRET\u0130Z", upgrade: "Y\u00fckselt \u2192", wantMore: "Daha fazla ara\u00e7?", viewPlans: "Planlar\u0131 \u0130ncele \u2192",
  criticalPts: "Kritik Noktalar", resetZoom: "Zoom S\u0131f\u0131rla", phaseDetails: "Faz Detaylar\u0131", close: "Kapat",
};
const EN = {
  title: "Fe-Fe\u2083C Phase Diagram Simulator", subtitle: "Interactive phase diagram \u2014 cooling simulation, lever rule, microstructure visualization.",
  carbon: "Carbon (wt%)", temp: "Temperature (\u00b0C)", steelType: "Steel Type", phaseRegion: "Phase Region",
  leverRule: "Lever Rule", totalPhases: "Total Equilibrium Phases", ferrite: "Ferrite (\u03b1)", cementite: "Cementite (Fe\u2083C)",
  clickDiagram: "Click to select carbon/temperature. Scroll to zoom.",
  warning: "Equilibrium (metastable Fe-Fe\u2083C) conditions. Real microstructures depend on cooling rate.",
  startCooling: "Start Cooling", stopCooling: "Stop Cooling", microstructure: "Microstructure Simulation",
  free: "FREE", upgrade: "Upgrade \u2192", wantMore: "Want more tools?", viewPlans: "View Plans \u2192",
  criticalPts: "Critical Points", resetZoom: "Reset Zoom", phaseDetails: "Phase Details", close: "Close",
};

function MicroCanvas({ carbon, steelType, temp }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    const eC = CRITICAL.eutectoidC;
    let seed = 42;
    const rng = () => { const x = Math.sin(seed++) * 43758.5453; return x - Math.floor(x); };
    const noise = (x, y) => Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1);
    const isLiquid = temp > 1500;
    const isAustenite = temp > CRITICAL.a1 && temp <= 1500;
    const N = 60;
    const grains = [];
    for (let i = 0; i < N; i++) grains.push({ x: rng() * w, y: rng() * h, ang: rng() * Math.PI, shade: 0.8 + rng() * 0.3, sd: 0.3 + rng() * 0.4, def: (rng() - 0.5) * 2 });
    const pctFerrite = Math.max(0, Math.min(100, ((eC - carbon) / eC) * 100));
    const numFerrite = Math.round((pctFerrite / 100) * N);
    const indices = Array.from({ length: N }, (_, i) => i).sort(() => rng() - 0.5);
    grains.forEach((g, i) => {
      if (isLiquid) g.phase = "liquid";
      else if (isAustenite) g.phase = "austenite";
      else if (carbon > 2.14) g.phase = "ledeburite";
      else if (steelType === "Eutectoid") g.phase = "pearlite";
      else if (steelType === "Hypereutectoid") g.phase = "pearlite";
      else g.phase = indices.indexOf(i) < numFerrite ? "ferrite" : "pearlite";
    });
    const img = ctx.createImageData(w, h);
    const d = img.data;
    const px = (idx, r, g, b) => { d[idx] = r; d[idx + 1] = g; d[idx + 2] = b; d[idx + 3] = 255; };
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const wf = 0.025, wa = 5;
        const wx = x + Math.sin(y * wf) * wa, wy = y + Math.cos(x * wf) * wa;
        let minD = Infinity, minD2 = Infinity, closest = grains[0];
        for (const g of grains) {
          const ds = (wx - g.x) ** 2 + (wy - g.y) ** 2;
          if (ds < minD) { minD2 = minD; minD = ds; closest = g; } else if (ds < minD2) minD2 = ds;
        }
        const diff = Math.sqrt(minD2) - Math.sqrt(minD);
        const nv = (noise(x * 20, y * 20) - 0.5) * 10;
        if (!isAustenite && !isLiquid && steelType === "Hypereutectoid" && carbon <= 2.14) {
          const pctCem = Math.max(0, ((carbon - eC) / (6.67 - eC)) * 100);
          const netW = 1 + (pctCem / 15) * 5;
          if (diff < netW * (0.7 + 0.6 * noise(wx * 0.2, wy * 0.2))) { px(idx, 255, 255, 255); continue; }
          if (diff < netW + 1.2) { px(idx, 50, 50, 50); continue; }
        } else {
          if (diff < 0.8 + noise(x * 0.5, y * 0.5) * 0.5) { px(idx, 20, 20, 20); continue; }
        }
        if (closest.phase === "liquid") { px(idx, 255, 100 + noise(x * 0.05, y * 0.05) * 40, 50); }
        else if (closest.phase === "austenite") {
          const s = closest.shade;
          const tw = Math.abs((x * Math.cos(closest.ang) + y * Math.sin(closest.ang)) % 40) < 3;
          const b = tw ? 20 : 0;
          px(idx, 255 * s + nv + b, 160 * s + nv + b, 100 * s + nv + b);
        }
        else if (closest.phase === "ferrite") {
          const b = Math.min(255, Math.max(0, 245 * closest.shade + nv));
          px(idx, b, b, b + 5);
        }
        else if (closest.phase === "pearlite") {
          const lx = x - closest.x, ly = y - closest.y;
          const rx = lx * Math.cos(closest.ang) - ly * Math.sin(closest.ang);
          const ry = lx * Math.sin(closest.ang) + ly * Math.cos(closest.ang);
          const warp = Math.sin(rx * 0.04) * 8 * closest.def + noise(x * 0.2, y * 0.2) * 2;
          const val = Math.sin((ry + warp) * closest.sd);
          if (val > 0) px(idx, 220 + nv, 220 + nv, 225 + nv);
          else px(idx, 30 + nv, 30 + nv, 35 + nv);
        }
        else if (closest.phase === "ledeburite") {
          const pat = Math.sin(wx * 0.25) * Math.cos(wy * 0.25) + noise(x, y) * 0.5;
          if (pat > 0.2) px(idx, 230, 230, 230);
          else px(idx, 40 + nv, 40 + nv, 45 + nv);
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [carbon, steelType, temp]);
  return <canvas ref={ref} width={200} height={200} className="rounded-lg border border-white/10 w-full" />;
}

function PhaseModal({ data, onClose, t }) {
  if (!data) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-dark-800 border border-white/10 rounded-xl p-6 max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: data.color }} />
            <h3 className="text-lg font-bold text-dark-50">{data.name}</h3>
          </div>
          <button onClick={onClose} className="text-dark-300 hover:text-dark-50 cursor-pointer text-lg font-bold bg-transparent border-none font-sans">{"\u2715"}</button>
        </div>
        <p className="text-dark-200 text-sm leading-relaxed">{data.desc}</p>
        <button onClick={onClose} className="mt-5 w-full py-2 rounded-lg bg-gold-400/20 text-gold-400 text-sm font-semibold border border-gold-400/30 cursor-pointer font-sans hover:bg-gold-400/30">{t.close}</button>
      </div>
    </div>
  );
}

export default function PhaseDiagramSimulator() {
  const { lang, switchLang } = useLang();
  const t = lang === "tr" ? TR : EN;

  const [carbon, setCarbon] = useState(0.4);
  const [temp, setTemp] = useState(600);
  const [hover, setHover] = useState(null);
  const [zoom, setZoom] = useState(Z0);
  const [modal, setModal] = useState(null);
  const [cooling, setCooling] = useState(false);
  const [coolingEvents, setCoolingEvents] = useState([]);
  const [highlightLine, setHighlightLine] = useState(null);
  const coolingRef = useRef(false);
  const pauseRef = useRef(false);
  const svgRef = useRef(null);
  const isPanRef = useRef(false);
  const panLastRef = useRef(null);
  const hasDraggedRef = useRef(false);

  const regions = useMemo(() => getPhaseRegions(), []);
  const lines = useMemo(() => getPhaseLines(), []);
  const steelType = useMemo(() => determineSteelType(carbon), [carbon]);
  const phaseInfo = useMemo(() => identifyPhaseRegion(carbon, temp), [carbon, temp]);
  const lever = useMemo(() => calculateLeverRule(carbon, temp), [carbon, temp]);
  const totalPhases = useMemo(() => calculateTotalPhases(carbon), [carbon]);
  const tieLine = useMemo(() => getTieLine(carbon, temp), [carbon, temp]);

  useEffect(() => {
    if (!cooling) { coolingRef.current = false; return; }
    coolingRef.current = true;
    pauseRef.current = false;
    let lastT = 0;
    const events = getCoolingIntersections(carbon, temp);
    setCoolingEvents(events);
    const animate = (ts) => {
      if (!coolingRef.current) return;
      if (pauseRef.current) { lastT = ts; requestAnimationFrame(animate); return; }
      if (!lastT) lastT = ts;
      const dt = ts - lastT;
      if (dt > 16) {
        setTemp(prev => {
          if (prev <= 200) { setCooling(false); return 200; }
          const next = prev - Math.max(0.5, dt * 0.05);
          for (const ev of events) {
            if (ev.temp < prev && ev.temp >= next) {
              setHighlightLine(ev.name);
              pauseRef.current = true;
              setTimeout(() => { pauseRef.current = false; setHighlightLine(null); }, 1500);
              return ev.temp;
            }
          }
          return next;
        });
        lastT = ts;
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => { coolingRef.current = false; };
  }, [cooling]);

  const toggleCooling = () => {
    if (cooling) { setCooling(false); setHighlightLine(null); setCoolingEvents([]); }
    else { if (temp < 900) setTemp(1200); setCooling(true); }
  };

  // Attach wheel listener imperatively with passive:false so e.preventDefault() works
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handler = (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 0.87;
      const rect = svg.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      setZoom(z => {
        const ns = Math.max(1, Math.min(10, z.s * factor));
        if (ns === z.s) return z;
        const ntx = mx - (mx - z.tx) * (ns / z.s);
        const nty = my - (my - z.ty) * (ns / z.s);
        return { s: ns, tx: ntx, ty: nty };
      });
    };
    svg.addEventListener("wheel", handler, { passive: false });
    return () => svg.removeEventListener("wheel", handler);
  }, []);

  // Helper: screen px → SVG user-unit delta (accounts for viewBox scaling)
  const svgScale = useCallback(() => {
    const rect = svgRef.current?.getBoundingClientRect();
    return rect ? BASE_W / rect.width : 1;
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    isPanRef.current = true;
    hasDraggedRef.current = false;
    panLastRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleSvgClick = useCallback((e) => {
    // Suppress click if mouse was dragged
    if (hasDraggedRef.current) { hasDraggedRef.current = false; return; }
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    const c = Number(xInv(px, zoom).toFixed(2));
    const tp = Math.round(yInv(py, zoom));
    if (tp >= 0 && tp <= 1600) { setCarbon(c); setTemp(tp); }
  }, [zoom]);

  const handleSvgMove = useCallback((e) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Pan when mouse is held and we are zoomed in
    if (isPanRef.current && panLastRef.current && zoom.s > 1) {
      const dx = e.clientX - panLastRef.current.x;
      const dy = e.clientY - panLastRef.current.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        hasDraggedRef.current = true;
        const sc = svgScale();
        setZoom(z => ({ ...z, tx: z.tx + dx * sc, ty: z.ty + dy * sc }));
        panLastRef.current = { x: e.clientX, y: e.clientY };
      }
      return; // skip hover tooltip while panning
    }

    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    setHover({ c: xInv(px, zoom).toFixed(2), t: Math.round(yInv(py, zoom)), x: px, y: py });
  }, [zoom, svgScale]);

  const handleMouseUp = useCallback(() => {
    isPanRef.current = false;
    panLastRef.current = null;
  }, []);

  const handleRegionClick = useCallback((r, e) => {
    e.stopPropagation();
    setModal({ name: r.name, desc: r.desc, color: r.color });
  }, []);

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
          <span className="text-dark-200 text-sm">{"\ud83d\udcca"} Fe-C</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/[0.05] rounded-full p-0.5 border border-white/10">
            <button onClick={() => switchLang("tr")} className={`px-2.5 py-1 rounded-full text-xs font-medium border-none cursor-pointer font-sans ${lang === "tr" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>TR</button>
            <button onClick={() => switchLang("en")} className={`px-2.5 py-1 rounded-full text-xs font-medium border-none cursor-pointer font-sans ${lang === "en" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>EN</button>
          </div>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">{t.free}</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">{t.title}</h1>
        <p className="text-dark-300 text-sm mb-5">{t.subtitle}</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-3 space-y-4">
            <button onClick={toggleCooling}
              className={`w-full py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer border-none font-sans transition-all ${cooling ? "bg-red-500/20 text-red-400" : "bg-blue-500 text-white hover:bg-blue-600"}`}>
              {cooling ? `\u2744 ${t.stopCooling}` : `\u2744 ${t.startCooling}`}
            </button>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] text-dark-300 font-bold uppercase tracking-wider">{t.carbon}</label>
                <span className="text-xl font-bold font-mono text-gold-400">{carbon.toFixed(2)}%</span>
              </div>
              <input type="range" min="0" max="6.67" step="0.01" value={carbon} disabled={cooling}
                onChange={e => setCarbon(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-yellow-500 bg-dark-800 disabled:opacity-40" />
              <div className="flex justify-between text-[9px] text-dark-300 mt-1"><span>0</span><span>0.76</span><span>2.14</span><span>6.67</span></div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] text-dark-300 font-bold uppercase tracking-wider">{t.temp}</label>
                <span className="text-xl font-bold font-mono text-red-400">{Math.round(temp)}{"\u00b0"}C</span>
              </div>
              <input type="range" min="0" max="1600" step="1" value={temp} disabled={cooling}
                onChange={e => setTemp(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-red-500 bg-dark-800 disabled:opacity-40" />
              <div className="flex justify-between text-[9px] text-dark-300 mt-1"><span>0</span><span>727</span><span>1147</span><span>1600</span></div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 space-y-3">
              <div><div className="text-[10px] text-dark-300 uppercase font-bold mb-0.5">{t.steelType}</div><div className="text-sm font-semibold text-gold-400">{steelType}</div></div>
              <div><div className="text-[10px] text-dark-300 uppercase font-bold mb-0.5">{t.phaseRegion}</div><div className="text-sm font-semibold text-dark-50">{phaseInfo.region}</div><div className="text-xs text-dark-300 mt-0.5">{phaseInfo.desc}</div></div>
            </div>

            {lever && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="text-[10px] text-blue-400 uppercase font-bold mb-2">{t.leverRule}</div>
                {[lever.phase1, lever.phase2].map((p, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between text-xs mb-0.5"><span className="text-dark-300">{p.name}</span><span className="font-mono font-bold text-dark-50">{p.pct}%</span></div>
                    <div className="w-full bg-dark-800 rounded-full h-1.5"><div className={`h-full rounded-full ${i === 0 ? "bg-blue-400" : "bg-purple-400"}`} style={{ width: `${p.pct}%` }} /></div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
              <div className="text-[10px] text-dark-300 uppercase font-bold mb-2">{t.totalPhases}</div>
              <div className="flex justify-between text-xs"><span className="text-dark-300">{t.ferrite}</span><span className="font-mono font-bold text-green-400">{totalPhases.ferrite.toFixed(1)}%</span></div>
              <div className="flex justify-between text-xs mt-1"><span className="text-dark-300">{t.cementite}</span><span className="font-mono font-bold text-dark-100">{totalPhases.cementite.toFixed(1)}%</span></div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
              <div className="text-[10px] text-dark-300 uppercase font-bold mb-2">{t.microstructure}</div>
              <MicroCanvas carbon={carbon} steelType={steelType} temp={temp} />
              <p className="text-[10px] text-dark-300 mt-2 italic">
                {temp > CRITICAL.a1 ? (temp > 1500 ? "Liquid melt" : "Austenite (FCC)") :
                  steelType === "Hypoeutectoid" ? "White: ferrite | Dark lamellar: pearlite" :
                  steelType === "Hypereutectoid" ? "White network: cementite | Dark lamellar: pearlite" :
                  steelType === "Cast Iron" ? "Transformed ledeburite" : "Fully pearlitic (eutectoid)"}
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <div className="text-[10px] text-dark-300 uppercase font-bold mb-2">{t.criticalPts}</div>
              <div className="space-y-1 text-[11px] text-dark-200 font-mono">
                <div>A{"\u2081"} = 727{"\u00b0"}C</div>
                <div>A{"\u2083"} {"\u2248"} {interpolateY(Math.min(carbon, 0.76), [0, 912], [0.76, 727]).toFixed(0)}{"\u00b0"}C</div>
                <div>Eutectoid: 0.76% C</div>
                <div>Eutectic: 4.3% C, 1147{"\u00b0"}C</div>
                <div>Peritectic: 1495{"\u00b0"}C</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden relative">
              {zoom.s > 1.05 && (
                <button onClick={() => setZoom(Z0)}
                  className="absolute top-2 right-2 z-10 px-2 py-1 rounded text-[10px] bg-dark-800/80 text-dark-200 border border-white/10 cursor-pointer font-sans hover:bg-dark-800">
                  {t.resetZoom}
                </button>
              )}

              {cooling && coolingEvents.length > 0 && (
                <div className="absolute top-2 left-2 z-10 bg-dark-800/90 border border-blue-500/20 rounded-lg p-2 max-w-[200px]">
                  <div className="text-[10px] text-blue-400 font-bold mb-1">Cooling Path Events:</div>
                  {coolingEvents.map((ev, i) => (
                    <div key={i} className={`text-[10px] flex items-center gap-1 ${highlightLine === ev.name ? "text-yellow-400 font-bold" : "text-dark-300"}`}>
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: ev.color }} />
                      {ev.temp.toFixed(0)}{"\u00b0"}C {"\u2014"} {ev.name}
                    </div>
                  ))}
                </div>
              )}

              <svg ref={svgRef} viewBox={`0 0 ${BASE_W} ${BASE_H}`} className="w-full select-none"
                style={{ cursor: zoom.s > 1 ? (isPanRef.current ? "grabbing" : "grab") : "crosshair" }}
                onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
                onClick={handleSvgClick} onMouseMove={handleSvgMove}
                onMouseLeave={() => { setHover(null); isPanRef.current = false; panLastRef.current = null; }}>

                <defs><clipPath id="chart-clip"><rect x={M.l} y={M.t} width={cw} height={ch} /></clipPath></defs>
                <rect x={M.l} y={M.t} width={cw} height={ch} fill="#0f172a" />

                <g clipPath="url(#chart-clip)">
                  {regions.map(r => (
                    <path key={r.id} d={ptsToPath(r.pts, zoom)} fill={r.color} fillOpacity={0.15}
                      stroke={r.color} strokeWidth={0.5} strokeOpacity={0.3}
                      style={{ cursor: "pointer" }} onClick={(e) => handleRegionClick(r, e)} />
                  ))}

                  {lines.map(l => (
                    <path key={l.name} d={lineToSvg(l.points, zoom)} fill="none" stroke={highlightLine === l.name ? "#fbbf24" : l.color}
                      strokeWidth={highlightLine === l.name ? l.w + 3 : l.w} strokeDasharray={l.dash || "none"} strokeLinecap="round"
                      style={{ transition: "stroke-width 0.3s, stroke 0.3s", pointerEvents: "none" }} />
                  ))}

                  {regions.map(r => {
                    const cx = r.pts.reduce((s, p) => s + p[0], 0) / r.pts.length;
                    const cy = r.pts.reduce((s, p) => s + p[1], 0) / r.pts.length;
                    const px = xS(cx, zoom), py = yS(cy, zoom);
                    if (px < M.l || px > BASE_W - M.r || py < M.t || py > BASE_H - M.b) return null;
                    return <text key={r.id + "-lbl"} x={px} y={py} textAnchor="middle" dominantBaseline="middle" fill={r.color} fontSize={10 * Math.min(zoom.s, 2)} fontWeight="700" opacity="0.8" style={{ pointerEvents: "none" }}>{r.name}</text>;
                  })}

                  {lines.filter(l => ["A1","A3","Acm","Liquidus","Eutectic","Fe\u2083C","Peritectic"].includes(l.name)).map(l => {
                    const i = l.points.length > 2 ? 1 : 0;
                    const p1 = l.points[i], p2 = l.points[Math.min(i+1, l.points.length-1)];
                    const mx = (xS(p1[0],zoom)+xS(p2[0],zoom))/2, my = (yS(p1[1],zoom)+yS(p2[1],zoom))/2;
                    return <text key={l.name+"-lbl"} x={mx} y={my-6} textAnchor="middle" fill={l.color} fontSize="11" fontWeight="800" stroke="#0f172a" strokeWidth="3" paintOrder="stroke" style={{pointerEvents:"none"}}>{l.name}</text>;
                  })}

                  {tieLine && (
                    <g>
                      <line x1={xS(tieLine.c1,zoom)} y1={yS(temp,zoom)} x2={xS(tieLine.c2,zoom)} y2={yS(temp,zoom)}
                        stroke="#dc2626" strokeWidth="2" strokeDasharray="5,3" />
                      <circle cx={xS(tieLine.c1,zoom)} cy={yS(temp,zoom)} r="4" fill="#dc2626" stroke="white" strokeWidth="1.5" />
                      <circle cx={xS(tieLine.c2,zoom)} cy={yS(temp,zoom)} r="4" fill="#dc2626" stroke="white" strokeWidth="1.5" />
                      <rect x={xS(tieLine.c1,zoom)-55} y={yS(temp,zoom)-22} width="50" height="18" rx="3" fill="#1e293b" stroke="#dc2626" strokeWidth="1" />
                      <text x={xS(tieLine.c1,zoom)-30} y={yS(temp,zoom)-10} textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="700">
                        {tieLine.label1} {tieLine.pct1}%
                      </text>
                      <rect x={xS(tieLine.c2,zoom)+5} y={yS(temp,zoom)-22} width="50" height="18" rx="3" fill="#1e293b" stroke="#dc2626" strokeWidth="1" />
                      <text x={xS(tieLine.c2,zoom)+30} y={yS(temp,zoom)-10} textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="700">
                        {tieLine.label2} {tieLine.pct2}%
                      </text>
                    </g>
                  )}

                  {cooling && (
                    <line x1={xS(carbon,zoom)} y1={yS(1600,zoom)} x2={xS(carbon,zoom)} y2={yS(200,zoom)}
                      stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="8,4" opacity="0.5" />
                  )}

                  <line x1={xS(carbon,zoom)} y1={yS(1600,zoom)} x2={xS(carbon,zoom)} y2={yS(0,zoom)} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.6" />
                  <line x1={xS(0,zoom)} y1={yS(temp,zoom)} x2={xS(6.67,zoom)} y2={yS(temp,zoom)} stroke="#dc2626" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
                  <circle cx={xS(carbon,zoom)} cy={yS(temp,zoom)} r="5" fill="#dc2626" stroke="white" strokeWidth="2" />
                </g>

                <line x1={M.l} y1={BASE_H-M.b} x2={BASE_W-M.r} y2={BASE_H-M.b} stroke="#475569" />
                <line x1={M.l} y1={M.t} x2={M.l} y2={BASE_H-M.b} stroke="#475569" />
                {xTicks.map(v => { const px = xS(v, Z0); if (px < M.l || px > BASE_W-M.r) return null; return (<g key={`xt${v}`}><line x1={px} y1={BASE_H-M.b} x2={px} y2={BASE_H-M.b+5} stroke="#64748b" /><text x={px} y={BASE_H-M.b+16} textAnchor="middle" fill="#94a3b8" fontSize="9">{v}</text></g>); })}
                <text x={BASE_W/2} y={BASE_H-5} textAnchor="middle" fill="#94a3b8" fontSize="11">Carbon Content (wt%)</text>
                {yTicks.filter(v => v >= 0 && v <= 1600).map(v => { const py = yS(v, Z0); if (py < M.t || py > BASE_H-M.b) return null; const key = [727,912,1147,1495,1538].includes(v); return (<g key={`yt${v}`}><line x1={M.l-5} y1={py} x2={M.l} y2={py} stroke="#64748b" /><text x={M.l-8} y={py+3} textAnchor="end" fill={key?"#f59e0b":"#94a3b8"} fontSize="9" fontWeight={key?"700":"400"}>{v}</text></g>); })}
                <text x={12} y={BASE_H/2} textAnchor="middle" fill="#94a3b8" fontSize="11" transform={`rotate(-90,12,${BASE_H/2})`}>Temperature ({"\u00b0"}C)</text>

                {hover && hover.t >= 0 && hover.t <= 1600 && (
                  <g>
                    <rect x={hover.x+10} y={hover.y-30} width="95" height="28" rx="4" fill="#1e293b" stroke="#334155" opacity="0.9" />
                    <text x={hover.x+57} y={hover.y-19} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">C: {hover.c}%</text>
                    <text x={hover.x+57} y={hover.y-8} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">T: {hover.t}{"\u00b0"}C</text>
                  </g>
                )}
              </svg>
            </div>

            <p className="text-xs text-dark-300 text-center mt-2">{t.clickDiagram}</p>
            <div className="mt-3 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-xs text-dark-200">
              <span className="text-orange-400 font-semibold">{"\u26a0"}</span> {t.warning}
            </div>
            <div className="mt-3 bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
              <div className="text-[11px] text-dark-300 space-y-0.5 font-mono">
                <div>{"•"} Callister & Rethwisch, Materials Science and Engineering, 10th Ed.</div>
                <div>{"•"} ASM Handbook Vol. 3: Alloy Phase Diagrams</div>
                <div>{"•"} Bhadeshia & Honeycombe, Steels: Microstructure and Properties</div>
              </div>
            </div>

            {/* ── HOW TO USE BRIEFING ── */}
            <div className="mt-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02] flex items-center gap-2">
                <span className="text-base">📋</span>
                <span className="text-[10px] text-gold-400 font-mono font-bold uppercase tracking-widest">
                  {lang === "tr" ? "Nasıl Kullanılır?" : "How to Use"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/[0.04]">
                {[
                  {
                    icon: "🖱️", color: "blue",
                    title: lang === "tr" ? "Diyagram Üzerinde Nokta Seç" : "Select a Point on the Diagram",
                    desc: lang === "tr"
                      ? "Diyagram üzerine tıklayarak karbon içeriği (%C) ve sıcaklık (°C) değerini seçin. Sol panel anında güncellenir: faz bölgesi, kaldıraç kuralı oranları ve toplam denge fazları hesaplanır."
                      : "Click anywhere on the diagram to select carbon content (wt%C) and temperature (°C). The left panel updates instantly: phase region, lever rule fractions, and total equilibrium phases are calculated.",
                  },
                  {
                    icon: "🔍", color: "amber",
                    title: lang === "tr" ? "Zoom & Kaydır" : "Zoom & Pan",
                    desc: lang === "tr"
                      ? "Fare tekerleği ile diyagramı yakınlaştırın veya uzaklaştırın — sayfa kayması olmadan yalnızca diyagram zoom yapar. Zoom sıfırlamak için sağ üstteki «Zoom Sıfırla» butonunu kullanın."
                      : "Use the scroll wheel directly over the diagram to zoom in or out — only the diagram zooms, page scroll is blocked. Use the «Reset Zoom» button (top-right of diagram) to return to full view.",
                  },
                  {
                    icon: "❄️", color: "blue",
                    title: lang === "tr" ? "Soğuma Simülasyonu" : "Cooling Simulation",
                    desc: lang === "tr"
                      ? "«Soğumayı Başlat» butonuna basın. Seçilen karbon değerinde 1200°C'den itibaren denge soğuma simüle edilir. Her kritik faz dönüşüm sıcaklığında (A₁, A₃, Acm) diyagram kısa süre duraksayarak olayı vurgular."
                      : "Press «Start Cooling» to simulate equilibrium cooling from 1200°C at the selected carbon content. The animation pauses briefly at each critical transformation temperature (A₁, A₃, Acm) and highlights the event.",
                  },
                  {
                    icon: "📐", color: "green",
                    title: lang === "tr" ? "Kaldıraç Kuralı & Faz Bölgeleri" : "Lever Rule & Phase Regions",
                    desc: lang === "tr"
                      ? "İki fazlı bölgelerde (α+γ, γ+Fe₃C, L+γ vb.) kaldıraç kuralı otomatik hesaplanır ve yüzde olarak gösterilir. Herhangi bir renkli faz bölgesine tıklayarak detaylı faz açıklamasına ulaşabilirsiniz."
                      : "In two-phase regions (α+γ, γ+Fe₃C, L+γ, etc.) the lever rule is calculated automatically and displayed as percentages. Click any colored phase region to open a detailed description of that phase.",
                  },
                  {
                    icon: "🔬", color: "purple",
                    title: lang === "tr" ? "Mikroyapı Simülasyonu" : "Microstructure Simulation",
                    desc: lang === "tr"
                      ? "Sol alt köşedeki mikroyapı paneli, seçilen C% ve sıcaklığa göre gerçekçi Voronoi tane yapısı oluşturur: ferrit/perlit oranı, östenit, sıvı eriyik veya ledeburit görselleştirilir."
                      : "The microstructure panel (bottom-left) generates a realistic Voronoi grain structure based on the selected C% and temperature — visualizing ferrite/pearlite ratio, austenite, liquid melt, or ledeburite.",
                  },
                  {
                    icon: "📊", color: "gold",
                    title: lang === "tr" ? "Karbon & Sıcaklık Slider'ları" : "Carbon & Temperature Sliders",
                    desc: lang === "tr"
                      ? "Sol paneldeki slider'lar ile 0–6.67%C ve 0–1600°C arasında manuel değer girebilirsiniz. Kritik noktalar (A₁=727°C, ötektoid=0.76%C, ötektik=4.3%C) sarı renkte gösterilmiştir."
                      : "Use the sliders in the left panel to manually set carbon (0–6.67%C) and temperature (0–1600°C). Critical values are highlighted in yellow: A₁=727°C, eutectoid=0.76%C, eutectic=4.3%C.",
                  },
                ].map(({ icon, color, title, desc }) => {
                  const border = {
                    blue: "border-blue-500/20 bg-blue-500/5 text-blue-400",
                    amber: "border-amber-500/20 bg-amber-500/5 text-amber-400",
                    green: "border-green-500/20 bg-green-500/5 text-green-400",
                    purple: "border-purple-500/20 bg-purple-500/5 text-purple-400",
                    gold: "border-gold-400/20 bg-gold-400/5 text-gold-400",
                  };
                  return (
                    <div key={title} className="p-4 flex gap-3">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm shrink-0 mt-0.5 ${border[color]}`}>
                        {icon}
                      </div>
                      <div>
                        <div className="text-dark-50 text-xs font-semibold mb-1">{title}</div>
                        <p className="text-dark-300 text-[11px] leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">{t.wantMore}</h3>
          <Link href="/pricing" className="inline-block bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-6 py-2.5 text-sm font-semibold no-underline">{t.viewPlans}</Link>
        </div>
      </div>

      <PhaseModal data={modal} onClose={() => setModal(null)} t={t} />
    </div>
  );
}

