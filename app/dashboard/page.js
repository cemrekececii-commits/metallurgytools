"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { STARTER_LIMIT, TOOL_LABELS } from "@/lib/planUtils";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetch("/api/user/me").then(r => r.json()).then(setUserData);
    }
  }, [isLoaded, user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!isLoaded) return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
      Yükleniyor...
    </div>
  );

  const plan = user?.publicMetadata?.plan || "starter";
  const planExpires = user?.publicMetadata?.planExpiresAt;
  const isPro = plan === "professional" && planExpires && new Date(planExpires) > new Date();
  const toolUsage = userData?.toolUsage || {};
  const usedToolCount = Object.keys(toolUsage).length;
  const name = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Mühendis";

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#e2e8f0", fontFamily: "system-ui,sans-serif", paddingTop: 64 }}>

      {/* ── ACCOUNT SUB-BAR (sits below the global fixed Navbar) ── */}
      <div style={{ background: "#111827", borderBottom: "1px solid #1e293b", padding: "0 28px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#64748b", fontSize: 13, fontWeight: 500 }}>
          Panel &mdash; {name}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ background: isPro ? "#052e16" : "#1e1b4b", color: isPro ? "#4ade80" : "#818cf8", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700 }}>
            {isPro ? "PROFESSIONAL" : "STARTER"}
          </span>
          <Link href="/account" style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", borderRadius: 7, padding: "6px 12px", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
            ⚙️ Hesap Ayarları
          </Link>
          <button onClick={handleSignOut} style={{ background: "#450a0a", border: "1px solid #7f1d1d", color: "#f87171", borderRadius: 7, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            🚪 Çıkış Yap
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ── WELCOME ── */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 26, margin: "0 0 6px" }}>
            Hoş geldiniz, {name} 👋
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
            {isPro
              ? `Professional plan — ${planExpires ? `Bitiş: ${new Date(planExpires).toLocaleDateString("tr-TR")}` : "Sınırsız erişim"}`
              : `Starter plan — Her araç için ${STARTER_LIMIT} kullanım hakkı`
            }
          </p>
        </div>

        {/* ── UPGRADE BANNER (starter only) ── */}
        {!isPro && (
          <div style={{ background: "linear-gradient(135deg,#1e3a6e,#1e293b)", border: "1px solid #2563eb44", borderRadius: 12, padding: "20px 24px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Professional Plana Geç</div>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>Tüm araçlara sınırsız erişim · Aylık 1 ücretsiz danışmanlık · ₺415/ay · Shopier güvenli ödeme</div>
            </div>
            <Link href="/pricing" style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", borderRadius: 8, padding: "10px 22px", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              Yükselt →
            </Link>
          </div>
        )}

        {/* ── PRO SUBSCRIPTION INFO ── */}
        {isPro && (
          <div style={{ background: "#052e16", border: "1px solid #166534", borderRadius: 12, padding: "16px 24px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ color: "#4ade80", fontWeight: 700, fontSize: 14, marginBottom: 3 }}>✓ Professional Plan Aktif</div>
              <div style={{ color: "#6ee7b7", fontSize: 13 }}>
                {planExpires
                  ? `Bitiş tarihi: ${new Date(planExpires).toLocaleDateString("tr-TR")} · Yenilemek için fiyatlandırma sayfasını ziyaret edin.`
                  : "Sınırsız erişim aktif."}
              </div>
            </div>
            <Link href="/pricing" style={{ background: "#166534", color: "#4ade80", borderRadius: 8, padding: "8px 18px", fontWeight: 700, fontSize: 13, textDecoration: "none", border: "1px solid #166534" }}>
              Yenile →
            </Link>
          </div>
        )}

        {/* ── STAT CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { label: "Plan", value: isPro ? "Professional" : "Starter", color: isPro ? "#4ade80" : "#818cf8" },
            { label: "Kullanılan Araç", value: usedToolCount, color: "#60a5fa" },
            { label: "Danışmanlık", value: isPro ? "Aylık 1 ücretsiz" : (user?.publicMetadata?.consultationFreeUsed ? "Kullanıldı" : "1 ücretsiz hak"), color: "#f59e0b" },
          ].map(s => (
            <div key={s.label} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 12, padding: "20px 22px" }}>
              <div style={{ color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{s.label}</div>
              <div style={{ color: s.color, fontWeight: 800, fontSize: 22 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── TOOL USAGE TABLE (starter only) ── */}
        {!isPro && Object.keys(toolUsage).length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Araç Kullanım Durumu</h2>
            <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden" }}>
              {Object.entries(toolUsage).map(([toolId, count], i) => {
                const pct = Math.min(100, (count / STARTER_LIMIT) * 100);
                const color = count >= STARTER_LIMIT ? "#ef4444" : count >= 3 ? "#f97316" : "#3b82f6";
                return (
                  <div key={toolId} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 18px", borderBottom: i < Object.keys(toolUsage).length - 1 ? "1px solid #0f172a" : "none" }}>
                    <div style={{ flex: 1, minWidth: 160, color: "#e2e8f0", fontSize: 13 }}>{TOOL_LABELS[toolId]?.tr || toolId}</div>
                    <div style={{ flex: 2, maxWidth: 200 }}>
                      <div style={{ height: 6, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
                      </div>
                    </div>
                    <div style={{ color, fontSize: 13, fontWeight: 600, minWidth: 60, textAlign: "right" }}>
                      {count} / {STARTER_LIMIT}
                    </div>
                    {count >= STARTER_LIMIT && (
                      <Link href="/pricing" style={{ color: "#60a5fa", fontSize: 12, textDecoration: "none" }}>Yükselt</Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── QUICK LINKS ── */}
        <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Hızlı Erişim</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
          {[
            { href: "/tools/carbon-equivalent", icon: "🔥", label: "Karbon Eşdeğeri" },
            { href: "/tools/hardness",           icon: "🔧", label: "Sertlik Dönüşümü" },
            { href: "/tools/grain-size",         icon: "🔬", label: "Tane Boyutu" },
            { href: "/tools/hasar-vakalari",     icon: "📋", label: "Hasar Analizi Atlası" },
            { href: "/mechanical-tests/cekme-testi",  icon: "📊", label: "Çekme Testi" },
            { href: "/mechanical-tests/darbe-testi",  icon: "⚡", label: "Darbe Testi" },
            { href: "/consultation",             icon: "💬", label: "Danışmanlık Talebi" },
            { href: "/account",                  icon: "⚙️", label: "Hesap Ayarları" },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 10, padding: "16px 18px", textDecoration: "none", display: "flex", alignItems: "center", gap: 12, transition: "border-color .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#2563eb"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1e293b"}
            >
              <span style={{ fontSize: 20 }}>{l.icon}</span>
              <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500 }}>{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
