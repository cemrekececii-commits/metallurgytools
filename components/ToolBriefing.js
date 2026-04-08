"use client";

/**
 * ToolBriefing — Reusable how-to briefing component for all tool pages.
 * Corporate blue accent palette with gold highlights.
 *
 * Props:
 *   title    — string  ("Nasıl Kullanılır?" / "How to Use")
 *   steps    — array of { icon, color, title, desc }
 *   formulas — (optional) array of { label, color } for bottom formula strip
 */
export default function ToolBriefing({ title, steps, formulas }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="mt-10 rounded-2xl overflow-hidden" style={{ background: "rgb(15 23 42)", border: "1px solid #1e293b" }}>
      {/* Header bar */}
      <div className="flex items-center gap-3 px-6 py-4" style={{ background: "rgba(30,41,59,0.6)", borderBottom: "1px solid rgba(30,48,80,0.5)" }}>
        <div className="p-1.5 rounded-lg" style={{ background: "rgba(59,130,246,0.15)" }}>
          <svg className="w-5 h-5" style={{ color: "#60a5fa" }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold tracking-wide" style={{ color: "#e2e8f0" }}>{title}</h3>
        <div className="ml-auto flex gap-1.5">
          {steps.map((s, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: s.color, opacity: 0.7 }} />
          ))}
        </div>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
        {steps.map((step, idx) => {
          const cols = steps.length <= 4 ? 2 : 3;
          return (
            <div
              key={idx}
              className="relative p-5 flex gap-4"
              style={{
                borderRight: (idx + 1) % cols !== 0 ? "1px solid #1e293b" : "none",
                borderBottom: idx < steps.length - cols ? "1px solid #1e293b" : "none",
              }}
            >
              {/* Left accent */}
              <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full" style={{ background: step.color, opacity: 0.5 }} />

              {/* Icon circle */}
              <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30` }}>
                {step.icon}
              </div>

              <div className="min-w-0">
                <div className="font-semibold text-sm mb-1" style={{ color: "#e2e8f0" }}>{step.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>{step.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom formula strip (optional) */}
      {formulas && formulas.length > 0 && (
        <div className="px-6 py-3 flex flex-wrap gap-3 items-center justify-center" style={{ background: "rgba(2,6,23,0.5)", borderTop: "1px solid #1e293b" }}>
          {formulas.map((f, i) => (
            <span key={i} className="font-mono text-xs px-3 py-1 rounded-full"
              style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30` }}>
              {f.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
