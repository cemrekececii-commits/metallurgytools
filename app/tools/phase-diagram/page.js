"use client";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function PhaseDiagramTool() {
  const [carbon, setCarbon] = useState(0.4);
  const [temperature, setTemperature] = useState(25);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tools/phase-diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carbon, temperature }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-dark-200 hover:text-gold-400 transition-colors text-sm no-underline">← Dashboard</Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="font-semibold">📊 Fe-C Phase Diagram Simulator</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Fe-C Phase Diagram Simulator</h1>
        <p className="text-dark-300 text-sm mb-8">
          Interactive iron-cementite equilibrium diagram with lever rule calculations and phase fraction computation.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-dark-100">INPUT</h2>

            <div>
              <label className="text-xs text-dark-300 flex justify-between mb-2">
                <span>Carbon Content (wt%)</span>
                <span className="font-mono text-gold-400">{carbon.toFixed(2)}%</span>
              </label>
              <input type="range" min="0" max="6.67" step="0.01" value={carbon}
                onChange={(e) => setCarbon(+e.target.value)}
                className="w-full accent-gold-400" />
              <div className="flex justify-between text-[10px] text-dark-300 mt-1">
                <span>0 (Pure Fe)</span>
                <span>0.77 (Eutectoid)</span>
                <span>4.3 (Eutectic)</span>
                <span>6.67 (Fe₃C)</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-dark-300 flex justify-between mb-2">
                <span>Temperature (°C)</span>
                <span className="font-mono text-gold-400">{temperature}°C</span>
              </label>
              <input type="range" min="20" max="1600" step="5" value={temperature}
                onChange={(e) => setTemperature(+e.target.value)}
                className="w-full accent-gold-400" />
              <div className="flex justify-between text-[10px] text-dark-300 mt-1">
                <span>20°C</span>
                <span>727°C (A₁)</span>
                <span>1147°C (Eutectic)</span>
                <span>1600°C</span>
              </div>
            </div>

            <button onClick={handleCalculate} disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 cursor-pointer hover:shadow-lg hover:shadow-gold-400/20 transition-all border-none font-sans disabled:opacity-50">
              {loading ? "Computing..." : "Calculate Phase Fractions"}
            </button>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark-100 mb-4">PHASE ANALYSIS</h2>
            {result ? (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-dark-800 rounded-lg p-4">
                  <div className="text-xs text-dark-300 font-mono mb-2">PHASES PRESENT</div>
                  <div className="text-lg font-semibold text-gold-400">{result.phases}</div>
                </div>
                {result.fractions && (
                  <div className="bg-dark-800 rounded-lg p-4 space-y-2">
                    <div className="text-xs text-dark-300 font-mono mb-2">PHASE FRACTIONS (Lever Rule)</div>
                    {Object.entries(result.fractions).map(([phase, fraction]) => (
                      <div key={phase} className="flex items-center gap-3">
                        <span className="text-sm text-dark-100 w-24">{phase}</span>
                        <div className="flex-1 bg-dark-700 rounded-full h-3 overflow-hidden">
                          <div className="bg-gradient-to-r from-gold-400 to-gold-500 h-full rounded-full transition-all"
                            style={{ width: `${(fraction * 100).toFixed(1)}%` }} />
                        </div>
                        <span className="text-sm font-mono text-gold-400 w-16 text-right">
                          {(fraction * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="bg-dark-800 rounded-lg p-4">
                  <pre className="text-sm text-dark-100 whitespace-pre-wrap font-mono leading-relaxed">{result.details}</pre>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-dark-300">
                <div className="text-4xl mb-3">📊</div>
                <div className="text-sm">Set C% and temperature to analyze</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
