"use client";
import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { TOOL_ROUTES, STARTER_LIMIT } from "@/lib/planUtils";

// ─── Banner shown inside tool page ───────────────────────────────────────────
function UsageBanner({ usageLeft, plan }) {
  if (plan === "professional") return null;
  const pct = (usageLeft / STARTER_LIMIT) * 100;
  const color = usageLeft <= 1 ? "#ef4444" : usageLeft <= 2 ? "#f97316" : "#3b82f6";

  return (
    <div style={{ background: "#0f172a", borderBottom: "1px solid #1e293b", padding: "8px 20px", display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
      <div style={{ flex: 1, maxWidth: 200 }}>
        <div style={{ height: 4, background: "#1e293b", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2, transition: "width .3s" }} />
        </div>
      </div>
      <span style={{ color: "#94a3b8" }}>
        Bu araç için <strong style={{ color }}>{usageLeft}</strong> / {STARTER_LIMIT} kullanım hakkı kaldı
      </span>
      <Link href="/pricing" style={{ background: "#2563eb", color: "#fff", borderRadius: 6, padding: "4px 12px", fontWeight: 600, textDecoration: "none", fontSize: 12 }}>
        Yükselt →
      </Link>
    </div>
  );
}

// ─── Overlay when limit is reached ───────────────────────────────────────────
function LimitOverlay({ toolName }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#000000cc", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 16, padding: "40px 36px", maxWidth: 460, textAlign: "center", boxShadow: "0 25px 50px #000000aa" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 22, margin: "0 0 10px" }}>Kullanım Limiti Doldu</h2>
        <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: "0 0 8px" }}>
          <strong style={{ color: "#e2e8f0" }}>{toolName}</strong> aracı için ücretsiz {STARTER_LIMIT} kullanım hakkınız tükenmiştir.
        </p>
        <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, margin: "0 0 28px" }}>
          Professional plan ile tüm araçlara sınırsız erişim, aylık 1 ücretsiz danışmanlık oturumu ve öncelikli destek.
        </p>

        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "16px 20px", marginBottom: 24, textAlign: "left" }}>
          <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>✅ Professional Plan — ₺415 / ay</div>
          {["Tüm araçlara sınırsız erişim", "Aylık 1 ücretsiz danışmanlık oturumu", "Öncelikli teknik destek", "Yeni araçlara erken erişim"].map(f => (
            <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
              <span style={{ color: "#34d399", flexShrink: 0 }}>✓</span>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>{f}</span>
            </div>
          ))}
        </div>

        <Link href="/pricing" style={{ display: "block", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", borderRadius: 10, padding: "13px 24px", fontWeight: 700, fontSize: 15, textDecoration: "none", marginBottom: 12 }}>
          Professional Plana Geç
        </Link>
        <Link href="/" style={{ color: "#475569", fontSize: 13, textDecoration: "none" }}>Ana Sayfaya Dön</Link>
      </div>
    </div>
  );
}

// ─── Main ToolGate hook/wrapper ───────────────────────────────────────────────
export function useToolGate() {
  const { isSignedIn, isLoaded } = useUser();
  const pathname  = usePathname();
  const router    = useRouter();
  const [state, setState] = useState({ checked: false, allowed: null, usageLeft: null, plan: null, toolId: null });

  const check = useCallback(async () => {
    if (!isLoaded) return;
    if (!isSignedIn) { router.push(`/login?redirect=${encodeURIComponent(pathname)}`); return; }

    // Determine toolId from pathname (strip slug for hasar-vakalari)
    const base    = "/" + pathname.split("/").slice(1, pathname.includes("/tools/hasar-vakalari") ? 3 : undefined).join("/");
    const cleanBase = base.replace(/\/[^/]+$/, "") || base;
    const toolId  = TOOL_ROUTES[pathname] || TOOL_ROUTES[base] || TOOL_ROUTES[cleanBase];

    if (!toolId) { setState({ checked: true, allowed: true, usageLeft: null, plan: null, toolId: null }); return; }

    try {
      const res  = await fetch(`/api/user/usage?tool=${toolId}`);
      const data = await res.json();
      setState({ checked: true, allowed: data.allowed !== false, usageLeft: data.usageLeft, plan: data.reason === "pro" ? "professional" : "starter", toolId });
    } catch {
      setState({ checked: true, allowed: true, usageLeft: null, plan: null, toolId });
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  useEffect(() => { check(); }, [check]);

  const recordUse = useCallback(async () => {
    if (!state.toolId) return { allowed: true };
    try {
      const res  = await fetch("/api/user/usage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool: state.toolId }) });
      const data = await res.json();
      setState(prev => ({ ...prev, usageLeft: data.usageLeft, allowed: data.allowed !== false }));
      return data;
    } catch { return { allowed: true }; }
  }, [state.toolId]);

  return { ...state, recordUse };
}

// ─── Drop-in wrapper component ────────────────────────────────────────────────
export default function ToolGate({ toolName, children }) {
  const gate = useToolGate();

  if (!gate.checked) return null; // or a skeleton

  return (
    <>
      {gate.checked && !gate.allowed && <LimitOverlay toolName={toolName || "Bu araç"} />}
      <UsageBanner usageLeft={gate.usageLeft} plan={gate.plan} />
      {children}
    </>
  );
}
