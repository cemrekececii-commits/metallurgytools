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

// μm value of scale bar at each magnification
const SCALE_CONFIGS = { 100: 100, 200: 80, 500: 30 };

const MEAS_COLOR  = "#4ade80";   // green  — grain measurements
const CALIB_COLOR = "#f59e0b";   // amber  — calibration line

function getGrainCategory(g) {
  if (g < 1) return "Extra Coarse";
  if (g < 4) return "Coarse";
  if (g < 6) return "Medium";
  if (g < 10) return "Fine";
  return "Very Fine";
}

function calcStats(lines, pxPerUm) {
  if (!lines.length || !pxPerUm) return { count: 0, avgD: 0, avgA: 0, G: 0, cat: "N/A" };
  const diams  = lines.map(l => l.lenPx / pxPerUm);
  const avgD   = diams.reduce((s, d) => s + d, 0) / diams.length;
  const avgDmm = avgD / 1000;
  const areas  = diams.map(d => (Math.PI * d * d) / 4);
  const avgA   = areas.reduce((s, a) => s + a, 0) / areas.length;
  let G = 0;
  if (avgDmm > 0) { const Na = 1 / (avgDmm * avgDmm); G = 3.322 * Math.log10(Na) - 2.954; }
  return { count: lines.length, avgD: +avgD.toFixed(2), avgA: +avgA.toFixed(2), G: +G.toFixed(2), cat: getGrainCategory(G) };
}

const TR = {
  title: "ASTM E112 Tane Boyutu Analizörü",
  upload: "Görüntü Yükle", undo: "Geri Al", clearAll: "Tümünü Sil", fit: "SIĞDIR",
  grainSize: "ASTM TANE BOYUTU NUMARASI", avgDiam: "ORT. ÇAP", avgArea: "ORT. ALAN",
  criteria: "TEL ÇUBUK KABUL KRİTERLERİ", grade: "Kalite / Tip", reqMin: "Min G", status: "Durum",
  measurements: "ÖLÇÜM VERİLERİ", noData: "Henüz ölçüm yapılmadı. Görüntü üzerinde çizgi çekin.",
  diameter: "Çap (μm)", area: "Alan (μm²)", action: "İşlem",
  exportTxt: "Rapor (TXT)", exportPng: "Görüntü (PNG)",
  calibBtn: "Ölçek Çubuğunu Kalibre Et",
  calibActive: "🎯 Ölçek çubuğunun üzerine çizgi çekin…",
  calibDone: "Kalibre Edildi",
  calibNone: "⚠ Kalibre Edilmedi",
  calibHint: "Doğru μm ölçümü için önce ölçek çubuğunu kalibre edin.",
  calibInfo: (px, um, pxPerUm) => `${px}px = ${um}μm → ${pxPerUm.toFixed(3)} px/μm`,
  instructions: "Sol Tık: Ölçüm | Sağ Tık: Kaydır | Tekerlek: Zoom",
  free: "ÜCRETSİZ",
  placeholder: "Analiz için mikroyapı görüntüsü yükleyin",
  pass: "GEÇTİ", fail: "KALDI",
  scaleLabel: "Büyütme",
};
const EN = {
  title: "ASTM E112 Grain Size Analyzer",
  upload: "Upload Image", undo: "Undo", clearAll: "Clear All", fit: "FIT",
  grainSize: "ASTM GRAIN SIZE NUMBER", avgDiam: "AVG DIAMETER", avgArea: "AVG AREA",
  criteria: "WIRE ROD ACCEPTANCE CRITERIA", grade: "Grade / Type", reqMin: "Req. Min G", status: "Status",
  measurements: "MEASUREMENT DATA", noData: "No grains measured yet. Drag on image to measure.",
  diameter: "Diameter (μm)", area: "Area (μm²)", action: "Action",
  exportTxt: "Export TXT", exportPng: "Export PNG",
  calibBtn: "Calibrate Scale Bar",
  calibActive: "🎯 Draw a line over the scale bar…",
  calibDone: "Calibrated",
  calibNone: "⚠ Not Calibrated",
  calibHint: "Calibrate the scale bar first for accurate μm measurements.",
  calibInfo: (px, um, pxPerUm) => `${px}px = ${um}μm → ${pxPerUm.toFixed(3)} px/μm`,
  instructions: "L-Click: Measure | R-Click: Pan | Wheel: Zoom",
  free: "FREE",
  placeholder: "Upload a microstructure image to begin analysis",
  pass: "PASS", fail: "FAIL",
  scaleLabel: "Magnification",
};

export default function GrainSizeAnalyzer() {
  const { lang, switchLang } = useLang();
  const t = lang === "tr" ? TR : EN;

  const [imageSrc,   setImageSrc]   = useState(null);
  const [mag,        setMag]        = useState(200);   // default 200X
  const [lines,      setLines]      = useState([]);
  const [calib,      setCalib]      = useState({ barPx: 0, pxPerUm: null, calibrated: false });
  const [calibMode,  setCalibMode]  = useState(false); // true = next drag = scale bar
  const [view,       setView]       = useState({ s: 1, x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [isDrawing,  setIsDrawing]  = useState(false);
  const [isPanning,  setIsPanning]  = useState(false);
  const [lineStart,  setLineStart]  = useState(null);
  const [lineEnd,    setLineEnd]    = useState(null);

  const lastMouse   = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef   = useRef(null);
  const imgRef      = useRef(typeof window !== "undefined" ? new Image() : null);
  const containerRef = useRef(null);

  const barUm  = SCALE_CONFIGS[mag] || 100;
  const stats  = useMemo(() => calcStats(lines, calib.pxPerUm || 1), [lines, calib.pxPerUm]);

  const toImg = (cx, cy) => ({ x: (cx - view.x) / view.s, y: (cy - view.y) / view.s });

  const fitToScreen = useCallback(() => {
    if (!containerRef.current || !imgRef.current?.complete) return;
    const { width: cw, height: ch } = containerRef.current.getBoundingClientRect();
    const { naturalWidth: iw, naturalHeight: ih } = imgRef.current;
    if (!iw || !ih) return;
    const s = Math.min(cw / iw, ch / ih) * 0.95;
    setView({ s, x: (cw - iw * s) / 2, y: (ch - ih * s) / 2 });
  }, []);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      for (const e of entries) setCanvasSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Fit on image load
  useEffect(() => {
    const img = imgRef.current;
    if (!imageSrc || !img) return;
    const onLoad = () => { setTimeout(fitToScreen, 50); };
    if (img.complete && img.naturalWidth > 0) onLoad();
    else img.onload = onLoad;
  }, [imageSrc, fitToScreen]);

  // When mag changes and calibration was manual, recalibrate with new barUm
  useEffect(() => {
    if (calib.calibrated && calib.barPx > 0) {
      const newBarUm = SCALE_CONFIGS[mag] || 100;
      setCalib(c => ({ ...c, pxPerUm: c.barPx / newBarUm }));
    }
  }, [mag]); // eslint-disable-line

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d");
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

    // Measurement lines (green)
    lines.forEach((line, i) => {
      ctx.beginPath(); ctx.strokeStyle = MEAS_COLOR;
      ctx.moveTo(line.start.x, line.start.y); ctx.lineTo(line.end.x, line.end.y); ctx.stroke();
      ctx.fillStyle = MEAS_COLOR; ctx.beginPath();
      ctx.arc(line.start.x, line.start.y, r, 0, Math.PI * 2);
      ctx.arc(line.end.x,   line.end.y,   r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.strokeStyle = "#000"; ctx.lineWidth = lw * 1.5;
      ctx.strokeText(`#${i + 1}`, line.start.x + 10 / view.s, line.start.y);
      ctx.fillText(`#${i + 1}`,   line.start.x + 10 / view.s, line.start.y);
    });

    // Live drawing line
    if (isDrawing && lineStart && lineEnd) {
      const color = calibMode ? CALIB_COLOR : "#00d4ff";
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = lw * (calibMode ? 2 : 1.5);
      ctx.setLineDash(calibMode ? [8 / view.s, 4 / view.s] : []);
      ctx.moveTo(lineStart.x, lineStart.y); ctx.lineTo(lineEnd.x, lineEnd.y); ctx.stroke();
      ctx.setLineDash([]);
      // Show live px length in calib mode
      if (calibMode) {
        const dx = lineEnd.x - lineStart.x, dy = lineEnd.y - lineStart.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        ctx.fillStyle = CALIB_COLOR; ctx.strokeStyle = "#000"; ctx.lineWidth = lw;
        ctx.font = `bold ${fs}px Arial`;
        ctx.strokeText(`${Math.round(d)}px`, lineEnd.x + 8 / view.s, lineEnd.y);
        ctx.fillText(`${Math.round(d)}px`,   lineEnd.x + 8 / view.s, lineEnd.y);
      }
    }
    ctx.restore();
  }, [lines, lineEnd, calib, view, canvasSize, imageSrc, isDrawing, lineStart, calibMode]);

  // ── Upload ──────────────────────────────────────────────
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result;
      setImageSrc(src);
      if (imgRef.current) imgRef.current.src = src;
      setLines([]);
      setCalib({ barPx: 0, pxPerUm: null, calibrated: false });
      setCalibMode(false);
    };
    reader.readAsDataURL(file);
  };

  // ── Wheel zoom ───────────────────────────────────────────
  const handleWheel = (e) => {
    if (!imageSrc) return;
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    const rect   = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    setView(v => {
      const ns = Math.max(0.1, Math.min(50, v.s * factor));
      const wx = (mx - v.x) / v.s, wy = (my - v.y) / v.s;
      return { s: ns, x: mx - wx * ns, y: my - wy * ns };
    });
  };

  // ── Mouse down ───────────────────────────────────────────
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
    if (isPanning) { setIsPanning(false); lastMouse.current = null; return; }
    if (!isDrawing || !lineStart || !lineEnd) return;

    const dx   = lineEnd.x - lineStart.x, dy = lineEnd.y - lineStart.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (calibMode) {
      // This drag = scale bar calibration
      if (dist > 5) {
        const pxPerUm = dist / barUm;
        setCalib({ barPx: Math.round(dist), pxPerUm, calibrated: true });
      }
      setCalibMode(false);
    } else {
      // Normal measurement
      if (dist > 0.5) {
        setLines(p => [...p, { id: Date.now().toString(), start: lineStart, end: lineEnd, lenPx: dist }]);
      }
    }
    setIsDrawing(false); setLineStart(null); setLineEnd(null);
  };

  // ── Export ───────────────────────────────────────────────
  const exportReport = () => {
    const text = [
      "ASTM E112 GRAIN SIZE REPORT",
      "=".repeat(30),
      `Magnification: ${mag}X`,
      `Scale bar: ${barUm} μm`,
      `Calibration: ${calib.calibrated ? `${calib.barPx}px = ${barUm}μm (${(calib.pxPerUm||0).toFixed(3)} px/μm)` : "NOT CALIBRATED — results in px only"}`,
      "",
      "RESULTS",
      "-------",
      `G = ${stats.G}`,
      `Category: ${stats.cat}`,
      `Avg Diameter: ${stats.avgD} μm`,
      `Avg Area: ${stats.avgA} μm²`,
      `Count: ${stats.count}`,
      "",
      "CRITERIA",
      "--------",
      ...WIRE_ROD_CRITERIA.map(c => `${c.name} (Min G=${c.minG}): ${stats.G >= c.minG ? "PASS" : "FAIL"}`),
      "",
      "RAW DATA",
      "--------",
      ...lines.map((l, i) => `#${i + 1}: ${calib.pxPerUm ? (l.lenPx / calib.pxPerUm).toFixed(2) + " μm" : l.lenPx.toFixed(1) + " px"}`),
    ].join("\n");
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

  // ── Cursor ───────────────────────────────────────────────
  const cursor = !imageSrc ? "default" : calibMode ? "cell" : isPanning ? "grabbing" : "crosshair";

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)", marginTop: "64px" }}>

      {/* ── TOP NAV ── */}
      <nav className="flex-none border-b border-white/[0.06] px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 no-underline text-dark-50">
            <div className="w-7 h-7 bg-gradient-to-br from-gold-400 to-gold-500 rounded flex items-center justify-center text-sm font-bold text-dark-800 font-mono">M</div>
            <span className="font-semibold text-sm tracking-tight">MetallurgyTools</span>
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-dark-200 text-xs">🔬 {t.title}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Magnification */}
          <div className="flex bg-dark-800 rounded-lg p-0.5 border border-white/10">
            {[100, 200, 500].map(m => (
              <button key={m} onClick={() => setMag(m)}
                className={`px-3 py-1 rounded text-xs font-medium border-none cursor-pointer font-sans transition-all ${mag === m ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300 hover:text-dark-50"}`}>
                {m}X
              </button>
            ))}
          </div>

          {/* Upload */}
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleUpload} />
          <button onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-dark-200 transition-colors flex items-center gap-1.5 font-sans">
            📁 {t.upload}
          </button>

          {/* Lang */}
          <div className="flex items-center bg-white/[0.05] rounded-full p-0.5 border border-white/10">
            <button onClick={() => switchLang("tr")} className={`px-2 py-0.5 rounded-full text-[10px] font-medium border-none cursor-pointer font-sans ${lang === "tr" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>TR</button>
            <button onClick={() => switchLang("en")} className={`px-2 py-0.5 rounded-full text-[10px] font-medium border-none cursor-pointer font-sans ${lang === "en" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>EN</button>
          </div>

        </div>
      </nav>

      {/* ── MAIN ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── CANVAS PANEL ── */}
        <div className="flex-1 relative flex flex-col bg-black/40" ref={containerRef}>

          {/* Top-left toolbar */}
          <div className="absolute top-3 left-3 z-10 flex gap-1.5 flex-wrap">
            <button onClick={() => setLines(p => p.slice(0, -1))} disabled={!lines.length}
              className="bg-dark-800/90 text-dark-200 px-2.5 py-1.5 rounded text-xs border border-white/10 cursor-pointer font-sans hover:bg-dark-800 disabled:opacity-40">{t.undo}</button>
            <button onClick={() => setLines([])} disabled={!lines.length}
              className="bg-dark-800/90 text-dark-200 px-2.5 py-1.5 rounded text-xs border border-white/10 cursor-pointer font-sans hover:bg-dark-800 disabled:opacity-40">{t.clearAll}</button>
            <button
              onClick={() => setView(v => {
                const ns = Math.max(0.1, v.s / 1.4);
                const cw2 = canvasSize.w / 2, ch2 = canvasSize.h / 2;
                return { s: ns, x: v.x + (cw2 - v.x) * (1 - 1 / 1.4), y: v.y + (ch2 - v.y) * (1 - 1 / 1.4) };
              })}
              disabled={!imageSrc}
              className="bg-dark-800/90 text-dark-200 px-2.5 py-1.5 rounded text-xs border border-white/10 cursor-pointer font-sans hover:bg-dark-800 disabled:opacity-40"
            >
              {lang === "tr" ? "Uzaklaş" : "Zoom Out"}
            </button>

            {/* Calibration button */}
            {imageSrc && (
              <button
                onClick={() => setCalibMode(c => !c)}
                className={`px-2.5 py-1.5 rounded text-xs border cursor-pointer font-sans transition-all ${
                  calibMode
                    ? "bg-amber-500 text-dark-900 border-amber-400 font-bold animate-pulse"
                    : "bg-dark-800/90 text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
                }`}
              >
                📏 {calibMode ? t.calibActive : calib.calibrated ? `✓ ${t.calibDone}` : t.calibBtn}
              </button>
            )}
          </div>

          {/* Calibration info banner */}
          {imageSrc && !calib.calibrated && !calibMode && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1.5 text-[11px] text-amber-400 font-mono whitespace-nowrap">
              ⚠ {t.calibHint}
            </div>
          )}
          {imageSrc && calib.calibrated && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-1.5 text-[11px] text-green-400 font-mono whitespace-nowrap">
              ✓ {t.calibInfo(calib.barPx, barUm, calib.pxPerUm)}
            </div>
          )}

          {/* Zoom controls */}
          {imageSrc && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex gap-0.5 bg-dark-800/90 p-0.5 rounded-lg border border-white/10">
              <button onClick={() => setView(v => { const ns = v.s / 1.2; const cw2 = canvasSize.w / 2, ch2 = canvasSize.h / 2; return { s: ns, x: v.x + (cw2 - v.x) * (1 - 1 / 1.2), y: v.y + (ch2 - v.y) * (1 - 1 / 1.2) }; })}
                className="p-1.5 hover:bg-white/10 rounded text-dark-200 cursor-pointer bg-transparent border-none text-sm">−</button>
              <button onClick={fitToScreen} className="px-2 py-1 hover:bg-white/10 rounded text-[10px] font-bold text-dark-200 cursor-pointer bg-transparent border-none font-sans">{t.fit}</button>
              <button onClick={() => setView(v => { const ns = v.s * 1.2; const cw2 = canvasSize.w / 2, ch2 = canvasSize.h / 2; return { s: ns, x: v.x + (cw2 - v.x) * (1 - 1.2), y: v.y + (ch2 - v.y) * (1 - 1.2) }; })}
                className="p-1.5 hover:bg-white/10 rounded text-dark-200 cursor-pointer bg-transparent border-none text-sm">+</button>
            </div>
          )}

          {/* Canvas / placeholder */}
          <div className="flex-1 relative overflow-hidden" style={{ cursor }}>
            {!imageSrc ? (
              <div className="h-full overflow-y-auto py-8 px-6">
                <div className="max-w-2xl mx-auto space-y-5">

                  {/* Header + Upload */}
                  <div className="text-center">
                    <div className="text-5xl mb-3">🔬</div>
                    <h2 className="text-xl font-bold text-dark-50 mb-1">
                      {lang === "tr" ? "ASTM E112 Tane Boyutu Analizörü" : "ASTM E112 Grain Size Analyzer"}
                    </h2>
                    <p className="text-dark-300 text-sm mb-5">
                      {lang === "tr"
                        ? "Lineer kesişim yöntemiyle ASTM G tane boyutu numarası hesaplama"
                        : "Calculate ASTM G grain size number via linear intercept method"}
                    </p>
                    <button onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 font-bold px-7 py-3 rounded-xl text-sm hover:shadow-lg hover:shadow-gold-400/20 transition-all font-sans inline-flex items-center gap-2">
                      📁 {lang === "tr" ? "Görüntü Yükle" : "Upload Image"}
                    </button>
                  </div>

                  {/* Steps */}
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                      <span className="text-[10px] text-gold-400 font-mono font-bold uppercase tracking-widest">
                        {lang === "tr" ? "📋 Kullanım Kılavuzu" : "📋 How to Use"}
                      </span>
                    </div>

                    <div className="divide-y divide-white/[0.04]">
                      {[
                        {
                          step: "01", icon: "📁", color: "blue",
                          title: lang === "tr" ? "Görüntü Yükle" : "Upload Image",
                          desc: lang === "tr"
                            ? "JPG, PNG veya TIFF formatında metalografik mikroyapı görüntüsü yükleyin. Görüntüde ölçek çubuğu (skala barı) bulunması gereklidir."
                            : "Upload a metallographic microstructure image (JPG, PNG, or TIFF). The image must contain a scale bar for accurate calibration.",
                          extra: null,
                        },
                        {
                          step: "02", icon: "🔢", color: "gold",
                          title: lang === "tr" ? "Büyütme Seç" : "Select Magnification",
                          desc: lang === "tr"
                            ? "Görüntünün çekildiği büyütmeyi seçin. Bu değer ölçek çubuğunun μm karşılığını belirler."
                            : "Select the magnification used to capture the image. This sets the scale bar μm reference value.",
                          extra: (
                            <div className="mt-2 flex gap-2 flex-wrap">
                              {[["100X","100 μm"],["200X","80 μm"],["500X","30 μm"]].map(([m,v]) => (
                                <span key={m} className="bg-dark-800 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-dark-200">
                                  <span className="text-gold-400">{m}</span> → {v}
                                </span>
                              ))}
                            </div>
                          ),
                        },
                        {
                          step: "03", icon: "📏", color: "amber",
                          title: lang === "tr" ? "Ölçek Çubuğunu Kalibre Et" : "Calibrate Scale Bar",
                          desc: lang === "tr"
                            ? "«📏 Ölçek Çubuğunu Kalibre Et» butonuna tıklayın. İmleç + moduna geçer. Görüntüdeki ölçek çubuğunun tam boyunca bir çizgi çekin. Sistem piksel uzunluğunu otomatik kalibre eder."
                            : "Click «📏 Calibrate Scale Bar». The cursor switches to + mode. Draw a line along the full scale bar length. The system automatically calibrates pixels to μm.",
                          extra: (
                            <div className="mt-2 flex items-center gap-2 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
                              <span className="text-amber-400">⚠</span>
                              <span className="text-[11px] text-amber-300">
                                {lang === "tr"
                                  ? "Kalibrasyon yapılmadan alınan ölçümler μm değil piksel gösterir."
                                  : "Uncalibrated measurements display in pixels, not μm."}
                              </span>
                            </div>
                          ),
                        },
                        {
                          step: "04", icon: "✏️", color: "green",
                          title: lang === "tr" ? "Tane Çaplarını Ölç" : "Measure Grain Diameters",
                          desc: lang === "tr"
                            ? "Sol tıklayıp sürükleyerek tane sınırları boyunca çizgiler çekin. Her çizgi bir tane çapı ölçümüdür. İstatistiksel güvenilirlik için en az 10 ölçüm önerilir."
                            : "Left-click and drag across grain boundaries. Each line = one grain diameter. Minimum 10 measurements recommended for statistical reliability.",
                          extra: (
                            <div className="mt-2 grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                              {[
                                ["green", lang === "tr" ? "Sol Tık → Ölç" : "L-Click → Measure"],
                                ["dark", lang === "tr" ? "Sağ Tık → Kaydır" : "R-Click → Pan"],
                                ["dark", lang === "tr" ? "Tekerlek → Zoom" : "Scroll → Zoom"],
                              ].map(([c, label]) => (
                                <span key={label} className={`bg-dark-800 border rounded px-2 py-1 text-center ${c === "green" ? "border-green-500/30 text-green-400" : "border-white/10 text-dark-300"}`}>
                                  {label}
                                </span>
                              ))}
                            </div>
                          ),
                        },
                        {
                          step: "05", icon: "📊", color: "purple",
                          title: lang === "tr" ? "Sonuçları Değerlendir" : "Evaluate Results",
                          desc: lang === "tr"
                            ? "Sağ panel: ASTM G numarası, ortalama tane çapı (μm), ortalama alan (μm²) ve tel çubuk kalite kriterleri (General Purpose / High Strength / CHQ / Spring Wire) otomatik hesaplanır."
                            : "Right panel: ASTM G number, average grain diameter (μm), average area (μm²), and wire rod criteria (General Purpose / High Strength / CHQ / Spring Wire) — all calculated automatically.",
                          extra: (
                            <div className="mt-2 bg-dark-800 border border-white/[0.06] rounded-lg px-3 py-2 text-[10px] font-mono text-dark-300">
                              <span className="text-gold-400">G</span> = 3.322 × log₁₀(Nₐ) − 2.954 &nbsp;|&nbsp; Nₐ = 1 / d̄²
                            </div>
                          ),
                        },
                      ].map(({ step, icon, color, title, desc, extra }) => {
                        const colors = {
                          blue:   "bg-blue-500/15 border-blue-500/25 text-blue-400",
                          gold:   "bg-gold-400/15 border-gold-400/25 text-gold-400",
                          amber:  "bg-amber-500/15 border-amber-500/25 text-amber-400",
                          green:  "bg-green-500/15 border-green-500/25 text-green-400",
                          purple: "bg-purple-500/15 border-purple-500/25 text-purple-400",
                        };
                        return (
                          <div key={step} className="flex gap-4 p-5">
                            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg shrink-0 ${colors[color]}`}>{icon}</div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold font-mono ${colors[color].split(" ")[2]}`}>ADIM {step}</span>
                                <span className="text-dark-50 text-sm font-semibold">{title}</span>
                              </div>
                              <p className="text-dark-300 text-xs leading-relaxed">{desc}</p>
                              {extra}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ASTM reference */}
                  <div className="bg-white/[0.015] border border-white/[0.05] rounded-xl px-5 py-3 flex gap-3 items-start">
                    <span className="text-base mt-0.5 shrink-0">📋</span>
                    <p className="text-[11px] text-dark-400 leading-relaxed">
                      {lang === "tr"
                        ? "Bu araç ASTM E112 standardına uygun lineer kesişim yöntemi kullanır. Referans: ASTM E112-13 — Standard Test Methods for Determining Average Grain Size."
                        : "This tool applies the linear intercept method per ASTM E112 standard. Reference: ASTM E112-13 — Standard Test Methods for Determining Average Grain Size."}
                    </p>
                  </div>

                </div>
              </div>
            ) : (
              <canvas ref={canvasRef}
                onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}    onMouseLeave={handleMouseUp}
                onWheel={handleWheel}        onContextMenu={e => e.preventDefault()}
                className="block outline-none" />
            )}
          </div>

          {/* Status bar */}
          <div className="bg-dark-800 text-[10px] text-dark-300 px-3 py-1.5 border-t border-white/[0.06] flex justify-between">
            <span>{t.instructions}</span>
            <div className="flex gap-4">
              <span>{t.scaleLabel}: {mag}X · {barUm}μm scale</span>
              <span>Zoom: {(view.s * 100).toFixed(0)}%</span>
              <span>
                {calib.calibrated
                  ? <span className="text-green-400">✓ {(calib.pxPerUm || 0).toFixed(3)} px/μm</span>
                  : <span className="text-amber-400">⚠ {t.calibNone}</span>}
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="w-80 bg-white/[0.02] border-l border-white/[0.06] flex flex-col overflow-hidden">

          {/* Results */}
          <div className="p-5 border-b border-white/[0.06]">
            <div className="text-[10px] text-gold-400 uppercase font-bold tracking-wider mb-1">{t.grainSize}</div>
            <div className="text-4xl font-black text-dark-50 font-mono">G = {stats.G}</div>
            <div className="mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-dark-200 border border-white/10">{stats.cat}</div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-dark-800 p-2.5 rounded border border-white/[0.06]">
                <div className="text-[10px] text-dark-300 uppercase">{t.avgDiam}</div>
                <div className="text-base font-mono text-dark-50">
                  {calib.calibrated ? stats.avgD : "—"} <span className="text-xs text-dark-300">μm</span>
                </div>
              </div>
              <div className="bg-dark-800 p-2.5 rounded border border-white/[0.06]">
                <div className="text-[10px] text-dark-300 uppercase">{t.avgArea}</div>
                <div className="text-base font-mono text-dark-50">
                  {calib.calibrated ? stats.avgA : "—"} <span className="text-xs text-dark-300">μm²</span>
                </div>
              </div>
            </div>
            {!calib.calibrated && lines.length > 0 && (
              <div className="mt-3 bg-amber-500/5 border border-amber-500/20 rounded p-2 text-[10px] text-amber-400">
                ⚠ {t.calibHint}
              </div>
            )}
          </div>

          {/* Scrollable lower panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {/* Wire rod criteria */}
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
                          {!lines.length ? <span className="text-dark-300">—</span> :
                            pass ? <span className="text-green-400 font-bold">{t.pass}</span> :
                            <span className="text-red-400 font-bold">{t.fail}</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Measurement table */}
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
                      const d = calib.pxPerUm ? l.lenPx / calib.pxPerUm : null;
                      const a = d ? (Math.PI * d * d) / 4 : null;
                      return (
                        <tr key={l.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                          <td className="px-3 py-1.5 font-mono text-dark-300">{i + 1}</td>
                          <td className="px-3 py-1.5 text-dark-50 font-medium">{d ? d.toFixed(1) : "—"}</td>
                          <td className="px-3 py-1.5 text-dark-200">{a ? a.toFixed(1) : "—"}</td>
                          <td className="px-3 py-1.5 text-right">
                            <button onClick={() => setLines(p => p.filter(x => x.id !== l.id))}
                              className="text-red-400 hover:text-red-300 bg-transparent border-none cursor-pointer text-sm">✕</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {lines.length > 0 && calib.calibrated && (
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

          {/* Export */}
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
