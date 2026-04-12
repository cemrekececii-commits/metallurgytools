"use client";
import { useState, useMemo, useEffect } from "react";
import { Settings, Activity, Crosshair, Plus, Trash2, Thermometer, Globe } from "lucide-react";
import { MATERIALS, PROBES, BLOCKS, calculateEchoes } from "@/lib/ut-physics";
import { utTranslations } from "@/lib/ut-i18n";
import AScanDisplay from "./AScanDisplay";
import PhysicalView from "./PhysicalView";
import FormulasView from "./FormulasView";
import TheoryView from "./TheoryView";

export default function UTSimulator({ lang: externalLang }) {
  // State
  const [activeTab, setActiveTab] = useState("simulation");
  const [material, setMaterial] = useState(MATERIALS.STEEL);
  const [probe, setProbe] = useState(PROBES.ANGLE_45);
  const [probeDir, setProbeDir] = useState(1);
  const [block, setBlock] = useState(BLOCKS.FLAW);

  const [materialVelocity, setMaterialVelocity] = useState(3240);
  const [velocity, setVelocity] = useState(3240);
  const [range, setRange] = useState(100);
  const [delay, setDelay] = useState(0);
  const [gain, setGain] = useState(40);

  const [probePos, setProbePos] = useState(50);
  const [probeIndex, setProbeIndex] = useState(0);
  const [flaws, setFlaws] = useState([
    { id: 1, x: 120, y: 15, size: 3 },
    { id: 2, x: 160, y: 25, size: 2 },
  ]);

  const [gate, setGate] = useState({ start: 20, width: 40, threshold: 20 });

  // Advanced Calibration State
  const [temperature, setTemperature] = useState(20);
  const [surfaceLoss, setSurfaceLoss] = useState(0);

  // Display Zoom State
  const [zoomX, setZoomX] = useState(1);
  const [zoomY, setZoomY] = useState(1);

  // Cursor State
  const [cursorsEnabled, setCursorsEnabled] = useState(false);
  const [cursors, setCursors] = useState({ c1: 20, c2: 40 });

  // Language
  const [internalLang, setInternalLang] = useState("tr");
  const lang = externalLang || internalLang;
  const [saInput, setSaInput] = useState(50);

  const t = utTranslations[lang] || utTranslations.tr;

  // Update velocity when material or probe changes
  useEffect(() => {
    const v = probe.type === "L" ? material.vL : material.vT;
    setMaterialVelocity(v);
    setVelocity(v);
  }, [material, probe]);

  // Hover State
  const [hoveredFlawId, setHoveredFlawId] = useState(null);

  const echoes = useMemo(
    () =>
      calculateEchoes({
        probe, probeDir, material, materialVelocity, block,
        probePos, probeIndex, flaws, velocity, delay, gain,
        range, temperature, surfaceLoss,
      }),
    [probe, probeDir, material, materialVelocity, block, probePos, probeIndex, flaws, velocity, delay, gain, range, temperature, surfaceLoss]
  );

  // Measurement logic
  const measurements = useMemo(() => {
    const inGate = echoes.filter(
      (e) =>
        e.distance >= gate.start &&
        e.distance <= gate.start + gate.width &&
        e.amplitude >= gate.threshold
    );

    if (inGate.length === 0) return null;

    const maxEcho = inGate.reduce((max, e) => (e.amplitude > max.amplitude ? e : max), inGate[0]);

    const S = maxEcho.distance;
    let D = 0, d = 0, leg = 1;

    if (probe.angle > 0) {
      const theta = (probe.angle * Math.PI) / 180;
      D = S * Math.sin(theta);
      const rawDepth = S * Math.cos(theta);
      const T = block.thickness;
      leg = Math.floor(rawDepth / T) + 1;
      const rem = rawDepth % T;
      d = leg % 2 !== 0 ? rem : T - rem;
    } else {
      d = S;
    }

    return { S, D, d, amp: maxEcho.amplitude, leg };
  }, [echoes, gate, probe, block]);

  // Calculate Cursor Deltas
  const deltaS = Math.abs(cursors.c1 - cursors.c2);
  const deltaT = (deltaS * 2 * 1000) / velocity;

  const handleAddFlawBySA = () => {
    let newX = probePos;
    let newY = saInput;

    if (probe.angle > 0) {
      const theta = (probe.angle * Math.PI) / 180;
      const PA = saInput * Math.sin(theta);
      const rawDepth = saInput * Math.cos(theta);
      const T = block.thickness;
      const leg = Math.floor(rawDepth / T) + 1;
      const rem = rawDepth % T;
      const RA = leg % 2 !== 0 ? rem : T - rem;

      newX = probePos + PA;
      newY = RA;
    }

    setFlaws([...flaws, { id: Date.now(), x: Number(newX.toFixed(1)), y: Number(newY.toFixed(1)), size: 2 }]);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-neutral-900 border-r border-neutral-800 flex flex-col shadow-xl z-10">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="text-blue-500" />
            <div>
              <h1 className="font-bold text-lg leading-tight">{t.title}</h1>
              <p className="text-xs text-neutral-400">{t.subtitle}</p>
            </div>
          </div>
          {!externalLang && (
            <button
              onClick={() => setInternalLang(lang === "tr" ? "en" : "tr")}
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors"
              title="Change Language"
            >
              <Globe size={16} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {/* Cihaz Ayarları */}
          <section>
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Settings size={14} /> {t.deviceCalib}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label={t.gain} value={gain} onChange={setGain} step={1} />
              <NumberInput label={t.range} value={range} onChange={setRange} step={10} />
              <NumberInput label={t.velocity} value={velocity} onChange={setVelocity} step={10} />
              <NumberInput label={t.delay} value={delay} onChange={setDelay} step={0.1} />
            </div>
          </section>

          {/* Kapı (Gate) Ayarları */}
          <section>
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">{t.gate}</h2>
            <div className="space-y-3">
              <RangeInput label={t.start} value={gate.start} onChange={(v) => setGate({ ...gate, start: v })} max={range} />
              <RangeInput label={t.width} value={gate.width} onChange={(v) => setGate({ ...gate, width: v })} max={range} />
              <RangeInput label={t.threshold} value={gate.threshold} onChange={(v) => setGate({ ...gate, threshold: v })} max={100} />
            </div>
          </section>

          {/* Prob ve Malzeme */}
          <section>
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">{t.hardware}</h2>
            <div className="space-y-3">
              <Select
                label={t.material}
                value={material.id}
                onChange={(id) => setMaterial(Object.values(MATERIALS).find((m) => m.id === id) || MATERIALS.STEEL)}
                options={Object.values(MATERIALS).map((m) => ({ value: m.id, label: m.name }))}
              />
              <Select
                label={t.probe}
                value={probe.id}
                onChange={(id) => setProbe(Object.values(PROBES).find((p) => p.id === id) || PROBES.ANGLE_45)}
                options={Object.values(PROBES).map((p) => ({ value: p.id, label: p.name, color: p.color }))}
              />
              {probe.angle > 0 && (
                <NumberInput
                  label={t.probeIndex}
                  value={probeIndex}
                  onChange={setProbeIndex}
                  step={1}
                />
              )}
              <Select
                label={t.block}
                value={block.id}
                onChange={(id) => setBlock(Object.values(BLOCKS).find((b) => b.id === id) || BLOCKS.FLAW)}
                options={Object.values(BLOCKS).map((b) => ({ value: b.id, label: b.name }))}
              />
              {block.id === "flaw" && (
                <NumberInput
                  label={t.blockThickness}
                  value={block.thickness}
                  onChange={(v) => setBlock({ ...block, thickness: Math.max(5, v) })}
                  step={5}
                />
              )}
              {block.id === "k1" && (
                <div className="mt-2 p-2 bg-neutral-800 rounded text-xs text-neutral-300 space-y-1">
                  <div className="font-semibold text-neutral-400 mb-1">{t.k1Params}</div>
                  <div className="flex justify-between"><span>{t.radius}:</span> <span>100 mm</span></div>
                  <div className="flex justify-between"><span>{t.thickness}:</span> <span>25 mm</span></div>
                </div>
              )}
              {block.id === "k2" && (
                <div className="mt-2 p-2 bg-neutral-800 rounded text-xs text-neutral-300 space-y-1">
                  <div className="font-semibold text-neutral-400 mb-1">{t.k2Params}</div>
                  <div className="flex justify-between"><span>{t.radii}:</span> <span>25 mm, 50 mm</span></div>
                  <div className="flex justify-between"><span>{t.thickness}:</span> <span>12.5 mm</span></div>
                </div>
              )}
            </div>
          </section>

          {/* Gelişmiş & Çevre */}
          <section>
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Thermometer size={14} /> {t.advEnv}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label={t.temp} value={temperature} onChange={setTemperature} step={5} />
              <NumberInput label={t.surfLoss} value={surfaceLoss} onChange={setSurfaceLoss} step={1} />
            </div>
            <div className="mt-2 text-[10px] text-neutral-500 leading-tight">
              {t.tempNote}
            </div>
          </section>

          {/* Hata Düzenleyici */}
          {block.id === "flaw" && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t.flaws}</h2>
                <button onClick={() => setFlaws([...flaws, { id: Date.now(), x: 100, y: 15, size: 2 }])} className="text-blue-400 hover:text-blue-300">
                  <Plus size={16} />
                </button>
              </div>

              {/* SA ile Hata Ekleme */}
              <div className="mb-3 bg-neutral-950 border border-neutral-700 p-2 rounded flex items-end gap-2">
                <div className="flex-1">
                  <NumberInput label={t.addFlawSA} value={saInput} onChange={setSaInput} step={1} />
                </div>
                <button
                  onClick={handleAddFlawBySA}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded h-[30px] font-medium transition-colors"
                >
                  {t.calcAdd}
                </button>
              </div>

              <div className="space-y-2">
                {flaws.map((f) => (
                  <div
                    key={f.id}
                    className={`p-2 rounded flex items-center gap-2 text-sm transition-colors border ${hoveredFlawId === f.id ? "bg-neutral-700 border-yellow-500/50" : "bg-neutral-800 border-transparent"}`}
                    onPointerEnter={() => setHoveredFlawId(f.id)}
                    onPointerLeave={() => setHoveredFlawId(null)}
                  >
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <input type="number" value={f.x} onChange={(e) => setFlaws(flaws.map((fl) => fl.id === f.id ? { ...fl, x: Number(e.target.value) } : fl))} className="bg-neutral-950 px-1 rounded w-full border border-neutral-700 text-center" title={t.xPos} />
                      <input type="number" value={f.y} onChange={(e) => setFlaws(flaws.map((fl) => fl.id === f.id ? { ...fl, y: Number(e.target.value) } : fl))} className="bg-neutral-950 px-1 rounded w-full border border-neutral-700 text-center" title={t.yDepth} />
                      <input type="number" value={f.size} onChange={(e) => setFlaws(flaws.map((fl) => fl.id === f.id ? { ...fl, size: Number(e.target.value) } : fl))} className="bg-neutral-950 px-1 rounded w-full border border-neutral-700 text-center" title={t.size} />
                    </div>
                    <button onClick={() => setFlaws(flaws.filter((fl) => fl.id !== f.id))} className="text-red-400 hover:text-red-300">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-900 shrink-0">
          <button
            onClick={() => setActiveTab("simulation")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "simulation" ? "text-blue-400 border-b-2 border-blue-400 bg-neutral-800/50" : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30"}`}
          >
            {t.tabSimulation}
          </button>
          <button
            onClick={() => setActiveTab("formulas")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "formulas" ? "text-blue-400 border-b-2 border-blue-400 bg-neutral-800/50" : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30"}`}
          >
            {t.tabFormulas}
          </button>
          <button
            onClick={() => setActiveTab("theory")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "theory" ? "text-blue-400 border-b-2 border-blue-400 bg-neutral-800/50" : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30"}`}
          >
            {t.tabTheory}
          </button>
        </div>

        {activeTab === "simulation" ? (
          <>
            {/* A-Scan Area */}
            <div className="flex-1 relative flex flex-col p-4 min-h-0">
              {/* Readouts */}
              <div className="absolute top-6 left-6 flex gap-4 z-10">
                {cursorsEnabled && (
                  <>
                    <Readout label="ΔS" value={deltaS} unit="mm" color="text-purple-400" unitColor="text-purple-300" />
                    <Readout label="Δt" value={deltaT} unit="µs" color="text-orange-400" unitColor="text-orange-300" />
                  </>
                )}
              </div>
              <div className="absolute top-6 right-6 flex gap-4 z-10">
                <Readout label={t.sa} value={measurements?.S} unit="mm" />
                <Readout label={t.pa} value={measurements?.D} unit="mm" />
                <Readout label={t.ra} value={measurements?.d} unit="mm" />
                <Readout label={t.amp} value={measurements?.amp} unit="%" />
                {probe.angle > 0 && <Readout label={t.leg} value={measurements?.leg} unit="" />}
              </div>

              <div className="flex-1 bg-[#001100] border-2 border-neutral-700 rounded-lg overflow-hidden relative shadow-inner">
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

            {/* Physical Simulation Area */}
            <div className="h-[297px] bg-neutral-900 border-t border-neutral-800 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                  <Crosshair size={16} /> {t.physSim}
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setProbeDir((d) => (d === 1 ? -1 : 1))}
                    className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 py-1 rounded transition-colors border border-neutral-700"
                  >
                    {t.flipProbe}
                  </button>
                  <div className="text-xs text-neutral-500">
                    {t.probePos}: {probePos.toFixed(1)} mm
                  </div>
                </div>
              </div>
              <div className="flex-1 relative bg-neutral-950 rounded border border-neutral-800 overflow-hidden">
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
                />
              </div>
            </div>
          </>
        ) : activeTab === "formulas" ? (
          <FormulasView lang={lang} />
        ) : (
          <TheoryView lang={lang} />
        )}
      </div>
    </div>
  );
}

// UI Components
function NumberInput({ label, value, onChange, step }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs text-neutral-400 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step}
        className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 transition-colors"
      />
    </div>
  );
}

function RangeInput({ label, value, onChange, max }) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between text-xs text-neutral-400 mb-1">
        <label>{label}</label>
        <span>{value.toFixed(0)}</span>
      </div>
      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="flex flex-col">
      <label className="text-xs text-neutral-400 mb-1">{label}</label>
      <div className="relative flex items-center">
        {selectedOption?.color && (
          <div
            className="absolute left-2.5 w-2.5 h-2.5 rounded-full pointer-events-none"
            style={{ backgroundColor: selectedOption.color }}
          />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-neutral-950 border border-neutral-700 rounded py-1.5 pr-8 text-sm focus:outline-none focus:border-blue-500 transition-colors w-full appearance-none ${selectedOption?.color ? "pl-7" : "pl-2"}`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="absolute right-2.5 pointer-events-none text-neutral-500 text-[10px]">
          ▼
        </div>
      </div>
    </div>
  );
}

function Readout({ label, value, unit, color = "text-green-400", unitColor = "text-green-400" }) {
  return (
    <div className="bg-neutral-900/80 backdrop-blur border border-neutral-700 rounded p-2 min-w-[80px] flex flex-col items-center shadow-lg">
      <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className={`font-mono text-xl font-bold ${color}`}>
          {value !== undefined && value !== null ? value.toFixed(1) : "--"}
        </span>
        {unit && (
          <span className={`text-[10px] font-medium px-1 py-0.5 rounded bg-neutral-800/80 border border-neutral-700/50 ${unitColor}`}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
