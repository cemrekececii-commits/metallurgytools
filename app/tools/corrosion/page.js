"use client";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function CorrosionTool() {
  const [inputs, setInputs] = useState({
    material: "carbon_steel",
    environment: "atmospheric",
    temperature: 25,
    pH: 7,
    chloride: 0,
    co2Partial: 0,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tools/corrosion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const update = (key, val) => setInputs((p) => ({ ...p, [key]: val }));

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-dark-200 hover:text-gold-400 transition-colors text-sm no-underline">
            ← Dashboard
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="font-semibold">⚗️ Corrosion Rate Calculator</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Corrosion Rate Calculator</h1>
        <p className="text-dark-300 text-sm mb-8">
          Estimate corrosion rates for carbon and low-alloy steels across multiple environments.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-dark-100">INPUT PARAMETERS</h2>

            <div>
              <label className="text-xs text-dark-300 block mb-1">Material</label>
              <select value={inputs.material} onChange={(e) => update("material", e.target.value)}
                className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none">
                <option value="carbon_steel">Carbon Steel (A36/S235)</option>
                <option value="low_alloy">Low Alloy Steel (A572/S355)</option>
                <option value="api_5l">API 5L (X52/X65/X70)</option>
                <option value="stainless_304">Stainless 304</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-dark-300 block mb-1">Environment</label>
              <select value={inputs.environment} onChange={(e) => update("environment", e.target.value)}
                className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none">
                <option value="atmospheric">Atmospheric</option>
                <option value="immersion_fresh">Freshwater Immersion</option>
                <option value="immersion_sea">Seawater Immersion</option>
                <option value="co2_sweet">CO₂ (Sweet Corrosion)</option>
                <option value="h2s_sour">H₂S (Sour Corrosion)</option>
                <option value="soil">Soil/Buried</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-dark-300 block mb-1">Temperature (°C)</label>
                <input type="number" value={inputs.temperature} onChange={(e) => update("temperature", +e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-dark-300 block mb-1">pH</label>
                <input type="number" step="0.1" value={inputs.pH} onChange={(e) => update("pH", +e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-dark-300 block mb-1">Chloride (ppm)</label>
                <input type="number" value={inputs.chloride} onChange={(e) => update("chloride", +e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-dark-300 block mb-1">CO₂ Partial (bar)</label>
                <input type="number" step="0.01" value={inputs.co2Partial} onChange={(e) => update("co2Partial", +e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>

            <button onClick={handleCalculate} disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 cursor-pointer hover:shadow-lg hover:shadow-gold-400/20 transition-all border-none font-sans disabled:opacity-50">
              {loading ? "Calculating..." : "Calculate Corrosion Rate"}
            </button>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark-100 mb-4">RESULTS</h2>
            {result ? (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-dark-800 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold font-mono text-gold-400">{result.rate}</div>
                  <div className="text-sm text-dark-300 mt-2">mm/year</div>
                </div>
                <div className="bg-dark-800 rounded-lg p-4">
                  <pre className="text-sm text-dark-100 whitespace-pre-wrap font-mono leading-relaxed">{result.details}</pre>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-dark-300">
                <div className="text-4xl mb-3">⚗️</div>
                <div className="text-sm">Set parameters and calculate</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
