"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

const WIRE_ROD_CRITERIA = [
  { name: "General Purpose", minG: 5 },
  { name: "High Strength", minG: 6 },
  { name: "Cold Heading (CHQ)", minG: 6 },
  { name: "Spring Wire", minG: 7 },
];
const SCALE_CONFIGS = { 100: 100, 200: 80, 500: 30 };
const MEAS_COLOR = "#4ade80";
const THEME_COLOR = "#00d4ff";

function getGrainCategory(g) {
  if (g < 1) return "Extra Coarse";
  if (g < 4) return "Coarse";
  if (g < 6) return "Medium";
  if (g < 10) return "Fine";
  return "Very Fine";
}

function calcStats(lines, pxPerUm) {
  if (!lines.length || !pxPerUm) return { count: 0, avgD: 0, avgA: 0, G: 0, cat: "N/A" };
  const diams = lines.map(l => l.lenPx / pxPerUm);
  const avgD = diams.reduce((s, d) => s + d, 0) / diams.length;
  const avgDmm = avgD / 1000;
  const areas = diams.map(d => (Math.PI * d * d) / 4);
  const avgA = areas.reduce((s, a) => s + a, 0) / areas.length;
  let G = 0;
  if (avgDmm > 0) { const Na = 1 / (avgDmm * avgDmm); G = 3.322 * Math.log10(Na) - 2.954; }
  return { count: lines.length, avgD: +avgD.toFixed(2), avgA: +avgA.toFixed(2), G: +G.toFixed(2), cat: getGrainCategory(G) };
}

function detectScaleBar(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const sw = Math.floor(img.naturalWidth * 0.5);
  const sh = Math.floor(img.naturalHeight * 0.25);
  const sx = img.naturalWidth - sw, sy = img.naturalHeight - sh;
  canvas.width = sw; canvas.height = sh;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  const data = ctx.getImageData(0, 0, sw, sh).data;
  let maxRun = 0;
  for (let y = 0; y < sh; y++) {
    let run = 0;
    for (let x = 0; x < sw; x++) {
      const i = (y * sw + x) * 4;
      if (data[i] > 150 && data[i + 1] < 100 && data[i + 2] < 100) run++;
      else { if (run > maxRun) maxRun = run; run = 0; }
    }
    if (run > maxRun) maxRun = run;
  }
  return maxRun > 20 ? maxRun : null;
}

const TR = {
  title: "ASTM E112 Tane Boyutu Analiz\u00f6r\u00fc",
  subtitle: "Kesi\u015fim y\u00f6ntemiyle ASTM tane boyutu numaras\u0131 hesaplama.",
  upload: "G\u00f6r\u00fcnt\u00fc Y\u00fckle", mag: "B\u00fcy\u00fctme", undo: "Geri Al", clearAll: "T\u00fcm\u00fcn\u00fc Sil", fit: "SI\u011eDIR",
  grainSize: "ASTM TANE BOYUTU NUMARASI", avgDiam: "ORT. \u00c7AP", avgArea: "ORT. ALAN",
  criteria: "TEL \u00c7UBUK KABUL KR\u0130TERLER\u0130", grade: "Kalite / Tip", reqMin: "Min G", status: "Durum",
  measurements: "\u00d6L\u00c7\u00dcM VER\u0130LER\u0130", noData: "Hen\u00fcz \u00f6l\u00e7\u00fcm yap\u0131lmad\u0131. G\u00f6r\u00fcnt\u00fc \u00fczerinde \u00e7izgi \u00e7ekin.",
  diameter: "\u00c7ap (\u03bcm)", area: "Alan (\u03bcm\u00b2)", action: "\u0130\u015flem",
  exportTxt: "Rapor (TXT)", exportPng: "G\u00f6r\u00fcnt\u00fc (PNG)",
  calibAuto: "Otomatik", calibDefault: "Varsay\u0131lan (1px=1\u03bcm)",
  instructions: "Sol T\u0131k: \u00d6l\u00e7\u00fcm | Sa\u011f T\u0131k: Kayd\u0131r | Tekerlek: Zoom",
  free: "\u00dcCRET\u0130Z", upgrade: "Y\u00fckselt \u2192", placeholder: "Analiz i\u00e7in mikroyap\u0131 g\u00f6r\u00fcnt\u00fcs\u00fc y\u00fckleyin",
  pass: "GE\u00c7T\u0130", fail: "KALDI",
};
const EN = {
  title: "ASTM E112 Grain Size Analyzer",
  subtitle: "Calculate ASTM grain size number using intercept method.",
  upload: "Upload Image", mag: "Magnification", undo: "Undo", clearAll: "Clear All", fit: "FIT",
  grainSize: "ASTM GRAIN SIZE NUMBER", avgDiam: "AVG DIAMETER", avgArea: "AVG AREA",
  criteria: "WIRE ROD ACCEPTANCE CRITERIA", grade: "Grade / Type", reqMin: "Req. Min G", status: "Status",
  measurements: "MEASUREMENT DATA", noData: "No grains measured yet. Drag on image to measure.",
  diameter: "Diameter (\u03bcm)", area: "Area (\u03bcm\u00b2)", action: "Action",
  exportTxt: "Export TXT", exportPng: "Export PNG",
  calibAuto: "Auto", calibDefault: "Default (1px=1\u03bcm)",
  instructions: "L-Click: Measure | R-Click: Pan | Wheel: Zoom",
  free: "FREE", upgrade: "Upgrade \u2192", placeholder: "Upload a microstructure image to begin analysis",
  pass: "PASS", fail: "FAIL",
};

export default function GrainSizeAnalyzer() {
  const { lang, switchLang } = useLang();
  const t = lang === "tr" ? TR : EN;

  const [imageSrc, setImageSrc] = useState(null);
  const [mag, setMag] = useState(100);
  const [lines, setLines] = useState([]);
  const [calib, setCalib] = useState({ barPx: 0, pxPerUm: 1, detected: false });
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [lineStart, setLineStart] = useState(null);
  const [lineEnd, setLineEnd] = useState(null);
  const lastMouse = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(typeof window !== "undefined" ? new Image() : null);
  const containerRef = useRef(null);

  const stats = useMemo(() => calcStats(lines, calib.pxPerUm), [lines, calib.pxPerUm]);

  const toImg = (cx, cy) => ({ x: (cx - view.x) / view.s, y: (cy - view.y) / view.s });

  const fitToScreen = useCallback(() => {
    if (!containerRef.current || !imgRef.current?.complete) return;
    const { width: cw, height: ch } = containerRef.current.getBoundingClientRect();
    const { naturalWidth: iw, naturalHeight: ih } = imgRef.current;
    if (!iw || !ih) return;
    const s = Math.min(cw / iw, ch / ih) * 0.95;
    setView({ s, x: (cw - iw * s) / 2, y: (ch - ih * s) / 2 });
  }, []);

  const runCalib = useCallback(() => {
    if (!imgRef.current?.complete || !imageSrc) return;
    const px = detectScaleBar(imgRef.current);
    const barUm = SCALE_CONFIGS[mag] || 100;
    if (px) setCalib({ barPx: px, pxPerUm: px / barUm, detected: true });
    else setCalib({ barPx: 0, pxPerUm: 1, detected: false });
  }, [imageSrc, mag]);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      for (const e of entries) setCanvasSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (!imageSrc || !img) return;
    const onLoad = () => { runCalib(); setTimeout(fitToScreen, 50); };
    if (img.complete && img.naturalWidth > 0) onLoad();
    else img.onload = onLoad;
  }, [imageSrc, runCalib, fitToScreen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !imageSrc) return;
    if (canvas.width !== canvasSize.w || canvas.height !== canvasSize.h) {
      canvas.width = canvasSize.w; canvas.height = canvasSize.h;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(view.x, view.y);
    ctx.scale(view.s, view.s);
    ctx.imageSmoothingEnabled = view.s < 1;
    if (imgRef.current) ctx.drawImage(imgRef.current, 0, 0);
    const lw = 2 / view.s, fs = Math.max(12, 24 / view.s), r = 4 / view.s;
    ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.font = `${fs}px Arial`;
    lines.forEach((line, i) => {
      ctx.beginPath(); ctx.strokeStyle = MEAS_COLOR;
      ctx.moveTo(line.start.x, line.start.y); ctx.lineTo(line.end.x, line.end.y); ctx.stroke();
      ctx.fillStyle = MEAS_COLOR; ctx.beginPath();
      ctx.arc(line.start.x, line.start.y, r, 0, Math.PI * 2);
      ctx.arc(line.end.x, line.end.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.strokeStyle = "#000"; ctx.lineWidth = lw * 1.5;
      ctx.strokeText(`#${i + 1}`, line.start.x + 10 / view.s, line.start.y);
      ctx.fillText(`#${i + 1}`, line.start.x + 10 / view.s, line.start.y);
    });
    if (isDrawing && lineStart && lineEnd) {
      ctx.beginPath(); ctx.strokeStyle = THEME_COLOR; ctx.lineWidth = lw * 1.5;
      ctx.moveTo(lineStart.x, lineStart.y); ctx.lineTo(lineEnd.x, lineEnd.y); ctx.stroke();
    }
    ctx.restore();
  }, [lines, lineEnd, calib, view, canvasSize, imageSrc, isDrawing, lineStart]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result;
      setImageSrc(src);
      if (imgRef.current) imgRef.current.src = src;
      setLines([]);
    };
    reader.readAsDataURL(file);
  };

  const handleWheel = (e) => {
    if (!imageSrc) return;
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    setView(v => {
      const ns = Math.max(0.1, Math.min(50, v.s * factor));
      const wx = (mx - v.x) / v.s, wy = (my - v.y) / v.s;
      return { s: ns, x: mx - wx * ns, y: my - wy * ns };
    });
  };

  const handleMouseDown = (e) => {
    if (!imageSrc) return;
    if (e.button === 1 || e.button === 2) {
      e.preventDefault(); setIsPanning(true);
      lastMouse.current = { x: e.clientX, y: e.clientY };
    } else if (e.button === 0) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pos = toImg(e.clientX - rect.left, e.clientY - rect.top);
      setIsDrawing(true); setLineStart(pos); setLineEnd(pos);
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning && lastMouse.current) {
      const dx = e.clientX - lastMouse.current.x, dy = e.clientY - lastMouse.current.y;
      setView(v => ({ ...v, x: v.x + dx, y: v.y + dy }));
      lastMouse.current = { x: e.clientX, y: e.clientY };
    } else if (isDrawing) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      setLineEnd(toImg(e.clientX - rect.left, e.clientY - rect.top));
    }
  };

  const handleMouseUp = () => {
    if (isPanning) { setIsPanning(false); lastMouse.current = null; }
    else if (isDrawing && lineStart && lineEnd) {
      const dx = lineEnd.x - lineStart.x, dy = lineEnd.y - lineStart.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0.5) setLines(p => [...p, { id: Date.now().toString(), start: lineStart, end: lineEnd, lenPx: dist }]);
      setIsDrawing(false); setLineStart(null); setLineEnd(null);
    }
  };

  const exportReport = () => {
    const text = `ASTM E112 GRAIN SIZE REPORT\n${"=".repeat(30)}\nMag: ${mag}X\nCalib: ${calib.detected ? "Auto" : "Default"} (${calib.pxPerUm.toFixed(2)} px/\u03bcm)\n\nRESULTS\n-------\nG = ${stats.G}\nCategory: ${stats.cat}\nAvg Diameter: ${stats.avgD} \u03bcm\nAvg Area: ${stats.avgA} \u03bcm\u00b2\nCount: ${stats.count}\n\nCRITERIA\n--------\n${WIRE_ROD_CRITERIA.map(c => `${c.name} (Min G=${c.minG}): ${stats.G >= c.minG ? "PASS" : "FAIL"}`).join("\n")}\n\nRAW DATA\n--------\n${lines.map((l, i) => `#${i + 1}: ${(l.lenPx / calib.pxPerUm).toFixed(2)} \u03bcm`).join("\n")}`;
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "grain_report.txt"; a.click();
  };

  const exportImage = () => {
    if (!imgRef.current) return;
    const iw = imgRef.current.naturalWidth, ih = imgRef.current.naturalHeight;
    const tc = document.createElement("canvas"); tc.width = iw; tc.height = ih;
    const ctx = tc.getContext("2d"); if (!ctx) return;
    ctx.drawImage(imgRef.current, 0, 0);
    ctx.lineWidth = 4; ctx.font = "32px Arial";
    lines.forEach((l, i) => {
      ctx.beginPath(); ctx.strokeStyle = MEAS_COLOR;
      ctx.moveTo(l.start.x, l.start.y); ctx.lineTo(l.end.x, l.end.y); ctx.stroke();
      ctx.fillStyle = MEAS_COLOR; ctx.beginPath();
      ctx.arc(l.start.x, l.start.y, 8, 0, Math.PI * 2); ctx.arc(l.end.x, l.end.y, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.strokeStyle = "#000";
      ctx.strokeText(`#${i + 1}`, l.start.x + 15, l.start.y); ctx.fillText(`#${i + 1}`, l.start.x + 15, l.start.y);
    });
    const a = document.createElement("a"); a.href = tc.toDataURL("image/png"); a.download = "analyzed_micro.png"; a.click();
  };

  return (
    <div className="flex flex-col h-screen">
      <nav className="flex-none border-b border-white/[0.06] px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 no-underline text-dark-50">
            <div className="w-7 h-7 bg-gradient-to-br from-gold-400 to-gold-500 rounded flex items-center justify-center text-sm font-bold text-dark-800 font-mono">M</div>
            <span className="font-semibold text-sm tracking-tight">MetallurgyTools</span>
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-dark-200 text-xs">{"\ud83d\udd2c"} {t.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-dark-800 rounded-lg p-0.5 border border-white/10">
            {[100, 200, 500].map(m => (
              <button key={m} onClick={() => setMag(m)}
                className={`px-3 py-1 rounded text-xs font-medium border-none cursor-pointer font-sans transition-all ${mag === m ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300 hover:text-dark-50"}`}>
                {m}X
              </button>
            ))}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleUpload} />
          <button onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-dark-200 transition-colors flex items-center gap-1.5 font-sans">
            {"\ud83d\udcc1"} {t.upload}
          </button>
          <div className="flex items-center bg-white/[0.05] rounded-full p-0.5 border border-white/10">
            <button onClick={() => switchLang("tr")} className={`px-2 py-0.5 rounded-full text-[10px] font-medium border-none cursor-pointer font-sans ${lang === "tr" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>TR</button>
            <button onClick={() => switchLang("en")} className={`px-2 py-0.5 rounded-full text-[10px] font-medium border-none cursor-pointer font-sans ${lang === "en" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>EN</button>
          </div>
          <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30">{t.free}</span>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative flex flex-col bg-black/40" ref={containerRef}>
          <div className="absolute top-3 left-3 z-10 flex gap-1.5">
            <button onClick={() => setLines(p => p.slice(0, -1))} disabled={!lines.length}
              className="bg-dark-800/90 text-dark-200 px-2.5 py-1.5 rounded text-xs border border-white/10 cursor-pointer font-sans hover:bg-dark-800 disabled:opacity-40">{t.undo}</button>
            <button onClick={() => setLines([])} disabled={!lines.length}
              className="bg-dark-800/90 text-dark-200 px-2.5 py-1.5 rounded text-xs border border-white/10 cursor-pointer font-sans hover:bg-dark-800 disabled:opacity-40">{t.clearAll}</button>
          </div>

          {imageSrc && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex gap-0.5 bg-dark-800/90 p-0.5 rounded-lg border border-white/10">
              <button onClick={() => setView(v => { const ns = v.s / 1.2; const cw2 = canvasSize.w / 2, ch2 = canvasSize.h / 2; return { s: ns, x: v.x + (cw2 - v.x) * (1 - 1 / 1.2), y: v.y + (ch2 - v.y) * (1 - 1 / 1.2) }; })}
                className="p-1.5 hover:bg-white/10 rounded text-dark-200 cursor-pointer bg-transparent border-none text-sm">{"\u2212"}</button>
              <button onClick={fitToScreen} className="px-2 py-1 hover:bg-white/10 rounded text-[10px] font-bold text-dark-200 cursor-pointer bg-transparent border-none font-sans">{t.fit}</button>
              <button onClick={() => setView(v => { const ns = v.s * 1.2; const cw2 = canvasSize.w / 2, ch2 = canvasSize.h / 2; return { s: ns, x: v.x + (cw2 - v.x) * (1 - 1.2), y: v.y + (ch2 - v.y) * (1 - 1.2) }; })}
                className="p-1.5 hover:bg-white/10 rounded text-dark-200 cursor-pointer bg-transparent border-none text-sm">+</button>
            </div>
          )}

          <div className="flex-1 relative overflow-hidden" style={{ cursor: imageSrc ? "crosshair" : "default" }}>
            {!imageSrc ? (
              <div className="flex items-center justify-center h-full text-dark-300">
                <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center">
                  <div className="text-4xl mb-4 opacity-40">{"\ud83d\udd2c"}</div>
                  <p className="text-sm">{t.placeholder}</p>
                </div>
              </div>
            ) : (
              <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel}
                onContextMenu={e => e.preventDefault()} className="block outline-none" />
            )}
          </div>

          <div className="bg-dark-800 text-[10px] text-dark-300 px-3 py-1.5 border-t border-white/[0.06] flex justify-between">
            <span>{t.instructions}</span>
            <div className="flex gap-4">
              <span>{t.mag}: {mag}X</span>
              <span>Zoom: {(view.s * 100).toFixed(0)}%</span>
              <span>Calib: {calib.detected ? <span className="text-green-400">{t.calibAuto} ({calib.barPx}px)</span> : <span className="text-yellow-500">{t.calibDefault}</span>}</span>
            </div>
          </div>
        </div>

        <div className="w-80 bg-white/[0.02] border-l border-white/[0.06] flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/[0.06]">
            <div className="text-[10px] text-gold-400 uppercase font-bold tracking-wider mb-1">{t.grainSize}</div>
            <div className="text-4xl font-black text-dark-50 font-mono">G = {stats.G}</div>
            <div className="mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-dark-200 border border-white/10">{stats.cat}</div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-dark-800 p-2.5 rounded border border-white/[0.06]">
                <div className="text-[10px] text-dark-300 uppercase">{t.avgDiam}</div>
                <div className="text-base font-mono text-dark-50">{stats.avgD} <span className="text-xs text-dark-300">{"\u03bcm"}</span></div>
              </div>
              <div className="bg-dark-800 p-2.5 rounded border border-white/[0.06]">
                <div className="text-[10px] text-dark-300 uppercase">{t.avgArea}</div>
                <div className="text-base font-mono text-dark-50">{stats.avgA} <span className="text-xs text-dark-300">{"\u03bcm\u00b2"}</span></div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-dark-800 rounded-lg p-3 border border-white/[0.06]">
              <div className="text-gold-400 font-bold text-[10px] uppercase tracking-wider mb-2">{t.criteria}</div>
              <table className="w-full text-xs">
                <thead><tr className="text-dark-300 border-b border-white/[0.06]">
                  <th className="text-left py-1.5 font-medium">{t.grade}</th>
                  <th className="text-center py-1.5 font-medium">{t.reqMin}</th>
                  <th className="text-center py-1.5 font-medium">{t.status}</th>
                </tr></thead>
                <tbody>
                  {WIRE_ROD_CRITERIA.map(c => {
                    const pass = lines.length > 0 && stats.G >= c.minG;
                    return (
                      <tr key={c.name} className="border-b border-white/[0.03]">
                        <td className="py-1.5 text-dark-100">{c.name}</td>
                        <td className="py-1.5 text-center text-dark-200">{c.minG}</td>
                        <td className="py-1.5 text-center">
                          {!lines.length ? <span className="text-dark-300">{"\u2014"}</span> :
                            pass ? <span className="text-green-400 font-bold">{t.pass}</span> :
                            <span className="text-red-400 font-bold">{t.fail}</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-dark-800 rounded-lg border border-white/[0.06] overflow-hidden">
              <div className="px-3 py-2 border-b border-white/[0.06]">
                <div className="text-[10px] text-dark-200 font-bold uppercase tracking-wider">{t.measurements}</div>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-dark-800"><tr className="text-dark-300">
                    <th className="px-3 py-1.5 text-left">#</th>
                    <th className="px-3 py-1.5 text-left">{t.diameter}</th>
                    <th className="px-3 py-1.5 text-left">{t.area}</th>
                    <th className="px-3 py-1.5 text-right">{t.action}</th>
                  </tr></thead>
                  <tbody>
                    {!lines.length ? (
                      <tr><td colSpan={4} className="px-3 py-6 text-center text-dark-300 italic text-[11px]">{t.noData}</td></tr>
                    ) : lines.map((l, i) => {
                      const d = l.lenPx / calib.pxPerUm;
                      const a = (Math.PI * d * d) / 4;
                      return (
                        <tr key={l.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                          <td className="px-3 py-1.5 font-mono text-dark-300">{i + 1}</td>
                          <td className="px-3 py-1.5 text-dark-50 font-medium">{d.toFixed(1)}</td>
                          <td className="px-3 py-1.5 text-dark-200">{a.toFixed(1)}</td>
                          <td className="px-3 py-1.5 text-right">
                            <button onClick={() => setLines(p => p.filter(x => x.id !== l.id))}
                              className="text-red-400 hover:text-red-300 bg-transparent border-none cursor-pointer text-sm">{"\u2715"}</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {lines.length > 0 && (
                    <tfoot className="sticky bottom-0 bg-dark-800 border-t border-white/10 font-bold">
                      <tr>
                        <td className="px-3 py-1.5 text-gold-400">AVG</td>
                        <td className="px-3 py-1.5 text-dark-50">{stats.avgD.toFixed(1)}</td>
                        <td className="px-3 py-1.5 text-dark-200">{stats.avgA.toFixed(1)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-white/[0.06] flex gap-2">
            <button onClick={exportReport} disabled={!lines.length}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-dark-200 py-2 rounded text-xs cursor-pointer font-sans disabled:opacity-40">{t.exportTxt}</button>
            <button onClick={exportImage} disabled={!imageSrc}
              className="flex-1 bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 font-bold py-2 rounded text-xs cursor-pointer font-sans border-none disabled:opacity-40">{t.exportPng}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
