"use client";
import { useState, useEffect } from "react";
import { Settings, Activity, Crosshair, Plus, Trash2, ChevronDown, ChevronUp, FlipHorizontal } from "lucide-react";
import { MATERIALS, PROBES, BLOCKS, calculateEchoes } from "@/lib/ut-physics";
import { utTranslations } from "@/lib/ut-i18n";
import AScanDisplay from "./AScanDisplay";
import PhysicalView from "./PhysicalView";
import FormulasView from "./FormulasView";
import TheoryView from "./TheoryView";

const PROBE_LIST = Object.values(PROBES);
const MATERIAL_LIST = Object.values(MATERIALS);
const BLOCK_LIST = Object.values(BLOCKS);

export default function UTSimulator({ lang = "tr" }) {
  const t = utTranslations[lang] || utTranslations.tr;
  const [activeTab, setActiveTab] = useState("simulation");

  // Device calibration
  const [gain, setGain] = useState(40);
  const [range, setRange] = useState(200);
  const [velocity, setVelocity] = useState(3240);
  const [delay, setDelay] = useState(0);
  const [gate, setGate] = useState({ start: 20, width: 150, threshold: 20 });

  // Hardware
  const [material, setMaterial] = useState(MATERIALS.STEEL);
  const [materialVelocity, setMaterialVelocity] = useState(MATERIALS.STEEL.vT);
  const [probe, setProbe] = useState(PROBES.ANGLE_45);
  const [probeDir, setProbeDir] = useState(1);
  const [probeIndex, setProbeIndex] = useState(0);
  const [block, setBlock] = useState(BLOCKS.FLAW);

  // Advanced
  const [temperature, setTemperature] = useState(20);
  const [surfaceLoss, setSurfaceLoss] = useState(0);

  // Display
  const [zoomX, setZoomX] = useState(1);
  const [zoomY, setZoomY] = useState(1);
  const [cursorsEnabled, setCursorsEnabled] = useState(false);
  const [cursors, setCursors] = useState({ c1: 50, c2: 150 });

  // Physical
  const [probePos, setProbePos] = useState(50);

  // Flaws
  const [flaws, setFlaws] = useState([
    { id: 1, x: 80, y: 15, size: 3 },
    { id: 2, x: 170, y: 22, size: 2 },
  ]);
  const [nextFlawId, setNextFlawId] = useState(3);
  const [hoveredFlawId, setHoveredFlawId] = useState(null);

  // SA-based flaw addition
  const [saInput, setSaInput] = useState("");

  // Sidebar sections
  const [openSections, setOpenSections] = useState({ deviceCalib: true, hardware: true, advEnv: false, flaws: true });

  const toggleSection = (id) => setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  // Sync materialVelocity when material or probe changes
  useEffect(() => {
    const v = probe.type === "L" ? material.vL : material.vT;
    setMaterialVelocity(v);
    setVelocity(v);
  }, [material, probe]);

  // Calculate echoes
  const echoes = calculateEchoes({
    probe, probeDir, material, materialVelocity, block,
    probePos, probeIndex, flaws, velocity, delay, gain,
    range, temperature, surfaceLoss,
  });

  const addFlaw = () => {
    setFlaws((prev) => [...prev, { id: nextFlawId, x: 125, y: 15, size: 3 }]);
    setNextFlawId((n) => n + 1);
  };

  const addFlawBySA = () => {
    const sa = parseFloat(saInput);
    if (isNaN(sa) || sa <= 0) return;
    if (probe.angle === 0) {
      const y = Math.min(sa, block.thickness - 2);
      setFlaws((prev) => [...prev, { id: nextFlawId, x: probePos, y, size: 3 }]);
    } else {
      const theta = (probe.angle * Math.PI) / 180;
      const rawDepth = sa * Math.cos(theta);
      const T = block.thickness;
      const leg = Math.floor(rawDepth / T);
      const rem = rawDepth % T;
      const y = leg % 2 === 0 ? rem : T - rem;
      const x = probePos + probeDir * sa * Math.sin(theta);
      setFlaws((prev) => [...prev, { id: nextFlawId, x: Math.max(5, Math.min(245, x)), y: Math.max(2, Math.min(T - 2, y)), size: 3 }]);
    }
    setNextFlawId((n) => n + 1);
    setSaInput("");
  };

  const removeFlaw = (id) => setFlaws((prev) => prev.filter((f) => f.id !== id));

  const updateFlaw = (id, field, value) => {
    setFlaws((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: parseFloat(value) } : f)));
  };

  const cursorDelta = cursorsEnabled && cursors ? Math.abs(cursors.c2 - cursors.c1) : null;

  const SectionHeader = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-800/50 hover:bg-neutral-800 transition-colors cursor-pointer border-none bg-transparent font-sans"
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon size={13} />}
        <span>{label}</span>
      </div>
      {openSections[id] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
    </button>
  );

  const SliderRow = ({ label, value, min, max, step = 1, onChange, unit = "" }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-neutral-400 mb-1">
        <span>{label}</span>
        <span className="text-neutral-200 font-mono">{typeof value === "number" ? value.toFixed(step < 1 ? 1 : 0) : value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 accent-blue-500 cursor-pointer"
      />
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-64px)] bg-neutral-900 text-white overflow-hidden">
      {/* ─── LEFT SIDEBAR ─── */}
      <div className="w-64 flex-shrink-0 bg-neutral-800 border-r border-neutral-700 overflow-y-auto flex flex-col">

        {/* Device Calibration */}
        <SectionHeader id="deviceCalib" label={t.deviceCalib} icon={Settings} />
        {openSections.deviceCalib && (
          <div className="px-3 py-3 border-b border-neutral-700">
            <SliderRow label={t.gain} value={gain} min={0} max={80} onChange={setGain} unit=" dB" />
            <SliderRow label={t.range} value={range} min={50} max={500} step={10} onChange={setRange} unit=" mm" />
            <SliderRow label={t.velocity} value={velocity} min={1000} max={8000} step={10} onChange={setVelocity} unit=" m/s" />
            <SliderRow label={t.delay} value={delay} min={0} max={50} step={0.5} onChange={setDelay} unit=" µs" />

            <div className="mt-3 pt-3 border-t border-neutral-700">
              <div className="text-xs text-neutral-400 mb-2">{t.gate}</div>
              <SliderRow label={t.start} value={gate.start} min={0} max={range} step={1} onChange={(v) => setGate((g) => ({ ...g, start: v }))} unit=" mm" />
              <SliderRow label={t.width} value={gate.width} min={10} max={range} step={1} onChange={(v) => setGate((g) => ({ ...g, width: v }))} unit=" mm" />
              <SliderRow label={t.threshold} value={gate.threshold} min={5} max={80} onChange={(v) => setGate((g) => ({ ...g, threshold: v }))} unit="%" />
            </div>
          </div>
        )}

        {/* Hardware */}
        <SectionHeader id="hardware" label={t.hardware} icon={Activity} />
        {openSections.hardware && (
          <div className="px-3 py-3 border-b border-neutral-700 space-y-3">
            <div>
              <div className="text-xs text-neutral-400 mb-1">{t.material}</div>
              <select value={material.id} onChange={(e) => setMaterial(MATERIAL_LIST.find((m) => m.id === e.target.value) || MATERIALS.STEEL)}
                className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-xs text-white focus:outline-none cursor-pointer">
                {MATERIAL_LIST.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div>
              <div className="text-xs text-neutral-400 mb-1">{t.matVelocity}</div>
              <input type="number" value={materialVelocity} onChange={(e) => setMaterialVelocity(parseInt(e.target.value) || 3240)}
                className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-xs text-white font-mono focus:outline-none" />
            </div>

            <div>
              <div className="text-xs text-neutral-400 mb-1">{t.probe}</div>
              <select value={probe.id} onChange={(e) => { const p = PROBE_LIST.find((p) => p.id === e.target.value) || PROBES.ANGLE_45; setProbe(p); setProbeIndex(0); }}
                className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-xs text-white focus:outline-none cursor-pointer">
                {PROBE_LIST.map((p) => <option key={p.id} value={p.id} style={{ color: p.color }}>{p.name}</option>)}
              </select>
            </div>

            {probe.angle > 0 && (
              <>
                <SliderRow label={t.probeIndex} value={probeIndex} min={0} max={30} step={0.5} onChange={setProbeIndex} unit=" mm" />
                <button onClick={() => setProbeDir((d) => -d)}
                  className="w-full flex items-center justify-center gap-2 py-1.5 rounded bg-neutral-700 hover:bg-neutral-600 text-xs text-neutral-200 cursor-pointer border-none font-sans transition-colors">
                  <FlipHorizontal size={13} />
                  {t.flipProbe} ({probeDir === 1 ? "→" : "←"})
                </button>
              </>
            )}

            <div>
              <div className="text-xs text-neutral-400 mb-1">{t.block}</div>
              <select value={block.id} onChange={(e) => { const b = BLOCK_LIST.find((b) => b.id === e.target.value) || BLOCKS.FLAW; setBlock(b); setFlaws([]); }}
                className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-xs text-white focus:outline-none cursor-pointer">
                {BLOCK_LIST.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            {block.id === "flaw" && (
              <SliderRow label={t.blockThickness} value={block.thickness} min={10} max={100} step={5} onChange={(v) => setBlock((b) => ({ ...b, thickness: v }))} unit=" mm" />
            )}
          </div>
        )}

        {/* Advanced */}
        <SectionHeader id="advEnv" label={t.advEnv} icon={Crosshair} />
        {openSections.advEnv && (
          <div className="px-3 py-3 border-b border-neutral-700">
            <SliderRow label={t.temp} value={temperature} min={-20} max={300} step={5} onChange={setTemperature} unit="°C" />
            <SliderRow label={t.surfLoss} value={surfaceLoss} min={0} max={20} step={0.5} onChange={setSurfaceLoss} unit=" dB" />
            <p className="text-[10px] text-neutral-500 mt-2 leading-relaxed">{t.tempNote}</p>

            <div className="mt-3 pt-3 border-t border-neutral-700">
              <div className="text-xs text-neutral-400 mb-2">{t.display}</div>
              <SliderRow label={t.zoomX} value={zoomX} min={0.5} max={4} step={0.5} onChange={setZoomX} />
              <SliderRow label={t.zoomY} value={zoomY} min={0.5} max={3} step={0.5} onChange={setZoomY} />
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" checked={cursorsEnabled} onChange={(e) => setCursorsEnabled(e.target.checked)} className="accent-purple-500" />
                <span className="text-xs text-neutral-300">{t.cursors}</span>
              </label>
            </div>
          </div>
        )}

        {/* Flaws */}
        {block.id === "flaw" && (
          <>
            <SectionHeader id="flaws" label={t.flaws} />
            {openSections.flaws && (
              <div className="px-3 py-3 flex-1">
                <button onClick={addFlaw}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-xs text-white cursor-pointer border-none font-sans mb-2 transition-colors">
                  <Plus size={13} /> {t.addFlaw}
                </button>

                <div className="flex gap-1 mb-3">
                  <input type="number" placeholder={t.sa + " (mm)"} value={saInput} onChange={(e) => setSaInput(e.target.value)}
                    className="flex-1 bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none" />
                  <button onClick={addFlawBySA}
                    className="px-2 py-1 rounded bg-green-700 hover:bg-green-600 text-xs text-white cursor-pointer border-none font-sans transition-colors">
                    {t.calcAdd}
                  </button>
                </div>

                <div className="space-y-3">
                  {flaws.map((f) => {
                    const fEcho = echoes.find((e) => e.sourceId === f.id);
                    const SA = fEcho ? (fEcho.distance * 2 / (velocity / 1000)).toFixed(1) : "—";
                    const PA = fEcho ? (fEcho.distance).toFixed(1) : "—";
                    return (
                      <div key={f.id}
                        className={`bg-neutral-700 rounded p-2 border transition-colors ${hoveredFlawId === f.id ? "border-yellow-400" : "border-neutral-600"}`}
                        onMouseEnter={() => setHoveredFlawId(f.id)}
                        onMouseLeave={() => setHoveredFlawId(null)}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-neutral-300 font-mono">#{f.id}</span>
                          <button onClick={() => removeFlaw(f.id)} className="text-red-400 hover:text-red-300 cursor-pointer border-none bg-transparent p-0"><Trash2 size={12} /></button>
                        </div>
                        <div className="grid grid-cols-3 gap-1 mb-2">
                          {[
                            { label: t.xPos, field: "x", min: 5, max: 245 },
                            { label: t.yDepth, field: "y", min: 2, max: block.thickness - 2 },
                            { label: t.size, field: "size", min: 1, max: 10 },
                          ].map(({ label, field, min, max }) => (
                            <div key={field}>
                              <div className="text-[10px] text-neutral-500 text-center mb-0.5">{label}</div>
                              <input type="number" value={f[field]} min={min} max={max}
                                onChange={(e) => updateFlaw(f.id, field, e.target.value)}
                                className="w-full bg-neutral-600 rounded px-1 py-0.5 text-xs text-center text-white font-mono focus:outline-none" />
                            </div>
                          ))}
                        </div>
                        {fEcho && (
                          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                            <div className="bg-neutral-800 rounded px-1.5 py-1 text-center">
                              <div className="text-neutral-500">{t.sa}</div>
                              <div className="text-green-400">{fEcho ? (Math.sqrt(Math.pow(f.x - probePos, 2) + Math.pow(f.y, 2))).toFixed(1) : "—"}</div>
                            </div>
                            <div className="bg-neutral-800 rounded px-1.5 py-1 text-center">
                              <div className="text-neutral-500">{t.amp}</div>
                              <div className="text-yellow-400">{fEcho ? fEcho.amplitude.toFixed(0) : "—"}%</div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Bar */}
        <div className="flex items-center gap-0 border-b border-neutral-700 bg-neutral-800 px-4 pt-2">
          {[
            { id: "simulation", label: t.tabSimulation },
            { id: "formulas", label: t.tabFormulas },
            { id: "theory", label: t.tabTheory },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-medium transition-colors cursor-pointer border-none font-sans rounded-t ${
                activeTab === tab.id
                  ? "bg-neutral-900 text-white border-t border-l border-r border-neutral-600"
                  : "text-neutral-400 hover:text-neutral-200 bg-transparent"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "simulation" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* A-Scan */}
            <div className="bg-black border-b border-neutral-700" style={{ height: "200px" }}>
              <div className="h-full px-4 py-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-neutral-500 font-mono">A-SCAN</span>
                  <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                    <span>{t.gain}: <span className="text-white">{gain} dB</span></span>
                    <span>{t.range}: <span className="text-white">{range} mm</span></span>
                    {cursorsEnabled && cursors && (
                      <span className="text-purple-400">
                        Δ: {Math.abs(cursors.c2 - cursors.c1).toFixed(1)} mm
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-[155px]">
                  <AScanDisplay
                    echoes={echoes}
                    range={range}
                    gate={gate}
                    zoomX={zoomX}
                    zoomY={zoomY}
                    cursorsEnabled={cursorsEnabled}
                    cursors={cursors}
                    onCursorsChange={setCursors}
                    hoveredFlawId={hoveredFlawId}
                    onHoverFlaw={setHoveredFlawId}
                  />
                </div>
              </div>
            </div>

            {/* Physical View */}
            <div className="flex-1 bg-neutral-900 overflow-hidden">
              <div className="h-full p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-neutral-500 font-mono">{t.physSim}</span>
                  <span className="text-xs text-neutral-500 font-mono">
                    {t.probePos}: <span className="text-neutral-300">{probePos.toFixed(1)} mm</span>
                    {probe.angle > 0 && <span className="ml-3">{t.probeIndex}: <span className="text-neutral-300">{probeIndex.toFixed(1)} mm</span></span>}
                  </span>
                </div>
                <div className="h-[calc(100%-28px)]">
                  <PhysicalView
                    block={block}
                    probe={probe}
                    probeDir={probeDir}
                    probePos={probePos}
                    probeIndex={probeIndex}
                    setProbePos={setProbePos}
                    flaws={flaws}
                    hoveredFlawId={hoveredFlawId}
                    onHoverFlaw={setHoveredFlawId}
                    echoes={echoes}
                    velocity={materialVelocity}
                  />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="bg-neutral-800 border-t border-neutral-700 px-4 py-1.5 flex items-center gap-6 text-[11px] font-mono text-neutral-400">
              <span>{material.name}</span>
              <span>|</span>
              <span>{probe.name}</span>
              <span>|</span>
              <span>{block.name}</span>
              <span>|</span>
              <span>vT: <span className="text-neutral-200">{materialVelocity} m/s</span></span>
              {temperature !== 20 && <><span>|</span><span className="text-orange-400">T: {temperature}°C</span></>}
              <span className="ml-auto text-neutral-600">UT Simulator Pro — Level 3 NDT Training</span>
            </div>
          </div>
        )}

        {activeTab === "formulas" && <FormulasView lang={lang} />}
        {activeTab === "theory" && <TheoryView lang={lang} />}
      </div>
    </div>
  );
}
