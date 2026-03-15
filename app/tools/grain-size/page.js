"use client";
import { useState, useRef } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function GrainSizeTool() {
  const { user } = useUser();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Store for API
    setImage(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    try {
      // Convert to base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(image);
      });

      const res = await fetch("/api/tools/grain-size", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          mimeType: image.type,
          method: "comparison", // or "intercept"
        }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Tool Nav */}
      <nav className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-dark-200 hover:text-gold-400 transition-colors text-sm no-underline"
          >
            ← Dashboard
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="font-semibold">🔬 Ferrite Grain Size Analyzer</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Ferrite Grain Size Analyzer
          </h1>
          <p className="text-dark-300 text-sm">
            Upload an optical micrograph to measure grain size per ASTM E112.
            Supports comparison and intercept methods.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark-100 mb-4">
              INPUT
            </h2>

            {/* Upload area */}
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center cursor-pointer hover:border-gold-400/30 transition-colors mb-4"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Micrograph"
                  className="max-h-48 mx-auto rounded"
                />
              ) : (
                <>
                  <div className="text-3xl mb-2">📎</div>
                  <div className="text-dark-200 text-sm">
                    Click to upload micrograph
                  </div>
                  <div className="text-dark-300 text-xs mt-1">
                    PNG, JPG, TIFF — max 10MB
                  </div>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Options */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs text-dark-300 block mb-1">
                  Measurement Method
                </label>
                <select className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none">
                  <option value="comparison">Comparison (ASTM E112)</option>
                  <option value="intercept">Intercept (Heyn)</option>
                  <option value="planimetric">Planimetric (Jeffries)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-dark-300 block mb-1">
                  Magnification
                </label>
                <select className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none">
                  <option>100x</option>
                  <option>200x</option>
                  <option>500x</option>
                  <option>1000x</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-dark-300 block mb-1">
                  Etchant
                </label>
                <select className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none">
                  <option>Nital 2%</option>
                  <option>Nital 5%</option>
                  <option>Picral</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!image || loading}
              className={`w-full py-3 rounded-lg text-sm font-semibold transition-all font-sans border-none ${
                image && !loading
                  ? "bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 cursor-pointer hover:shadow-lg hover:shadow-gold-400/20"
                  : "bg-white/5 text-dark-300 cursor-not-allowed"
              }`}
            >
              {loading ? "Analyzing..." : "Analyze Grain Size"}
            </button>
          </div>

          {/* Result Panel */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark-100 mb-4">
              RESULTS
            </h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm mb-4">
                {error}
              </div>
            )}

            {result ? (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-dark-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold font-mono text-gold-400">
                      {result.grainSizeNumber}
                    </div>
                    <div className="text-xs text-dark-300 mt-1">
                      ASTM G Number
                    </div>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold font-mono text-gold-400">
                      {result.avgDiameter}
                    </div>
                    <div className="text-xs text-dark-300 mt-1">
                      Avg Diameter (μm)
                    </div>
                  </div>
                </div>

                <div className="bg-dark-800 rounded-lg p-4">
                  <div className="text-xs text-dark-300 mb-2 font-mono">
                    ANALYSIS DETAILS
                  </div>
                  <pre className="text-sm text-dark-100 whitespace-pre-wrap font-mono leading-relaxed">
                    {result.details}
                  </pre>
                </div>

                <button className="w-full py-2.5 rounded-lg text-sm font-medium border border-white/10 bg-transparent text-dark-50 hover:border-gold-400/30 transition-colors cursor-pointer font-sans">
                  Export Report (CSV)
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-dark-300">
                <div className="text-4xl mb-3">🔬</div>
                <div className="text-sm">
                  Upload a micrograph and click Analyze
                </div>
                <div className="text-xs text-dark-300 mt-1">
                  Results will appear here
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
