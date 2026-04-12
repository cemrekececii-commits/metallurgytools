"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { useUser } from "@clerk/nextjs";
import { STARTER_LIMIT } from "@/lib/planUtils";

const FEATURES_TR = {
  starter: [
    `Her araç için ${STARTER_LIMIT} kullanım hakkı`,
    "Tüm hesaplama araçlarına erişim",
    "Hasar analizi atlasına erişim",
    "Danışmanlık: 1 kez ücretsiz (kayıt sonrası)",
    "Temel teknik destek",
  ],
  pro: [
    "Tüm araçlara SINIRSIIZ erişim",
    "Hasar analizi atlasına tam erişim",
    "Aylık 1 ücretsiz danışmanlık oturumu",
    "Öncelikli teknik destek",
    "Yeni araçlara erken erişim",
    "30 günlük aktif abonelik",
  ],
};

const FEATURES_EN = {
  starter: [
    `${STARTER_LIMIT} uses per tool`,
    "Access to all calculation tools",
    "Failure analysis atlas access",
    "Consultation: 1 free session after registration",
    "Basic technical support",
  ],
  pro: [
    "UNLIMITED access to all tools",
    "Full failure analysis atlas access",
    "1 free consultation session per month",
    "Priority technical support",
    "Early access to new tools",
    "30-day active subscription",
  ],
};

function getS(isDark) {
  return {
    page:   { background: isDark ? "#0a0a0a" : "#f1f5f9", minHeight: "100vh" },
    hero:   { background: isDark ? "linear-gradient(135deg,#0f1e3a,#091225 70%,#0a0a0a)" : "linear-gradient(135deg,#dbeafe,#eff6ff 70%,#f1f5f9)" },
    card:   (highlight) => ({ background: isDark ? (highlight ? "#0f172a" : "#111827") : (highlight ? "#eff6ff" : "#ffffff"), border: highlight ? "2px solid #2563eb" : (isDark ? "1px solid #1e293b" : "1px solid #e2e8f0"), borderRadius: 16, padding: "32px 28px", position: "relative", flex: 1, minWidth: 280, maxWidth: 400 }),
    title:  { color: isDark ? "#f1f5f9" : "#0f172a", fontWeight: 800, fontSize: 32, margin: "0 0 8px", textAlign: "center" },
    sub:    { color: isDark ? "#64748b" : "#6b7280", fontSize: 15, textAlign: "center", marginBottom: 60 },
    planName: { fontWeight: 700, fontSize: 18, marginBottom: 6 },
    price:  { fontSize: 42, fontWeight: 800, margin: "16px 0 4px" },
    period: { fontSize: 14, opacity: .6, marginBottom: 20 },
    feat:   { color: isDark ? "#94a3b8" : "#475569", fontSize: 14, lineHeight: 1.7 },
    btn:    (highlight) => ({ width: "100%", padding: "13px", background: highlight ? "linear-gradient(135deg,#1d4ed8,#2563eb)" : (isDark ? "#1e293b" : "#e2e8f0"), color: highlight ? "#fff" : (isDark ? "#94a3b8" : "#475569"), border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 24 }),
    badge:  { position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#2563eb", color: "#fff", borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" },
  };
}

export default function PricingPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const S = getS(isDark);
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const isTr = lang === "tr";

  const features = isTr ? FEATURES_TR : FEATURES_EN;

  const handleProCheckout = () => {
    if (!isSignedIn) { window.location.href = "/signup?redirect=/pricing"; return; }
    setLoading(true);
    const shopierUrl = "https://www.shopier.com/metallurgytools/45481563";
    const email = user?.emailAddresses?.[0]?.emailAddress || "";
    const url = email ? `${shopierUrl}?buyer_email=${encodeURIComponent(email)}` : shopierUrl;
    window.location.href = url;
  };

  const userPlan = user?.publicMetadata?.plan || "starter";

  return (
    <div style={S.page}>
      <Navbar />

      {/* HERO */}
      <div style={{ ...S.hero, paddingTop: 64 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 50px", textAlign: "center" }}>
          <h1 style={S.title}>{isTr ? "Planlar & Fiyatlandırma" : "Plans & Pricing"}</h1>
          <p style={S.sub}>{isTr ? "Ücretsiz başla, ihtiyacına göre yükselt." : "Start free, upgrade when you need it."}</p>
        </div>
      </div>

      {/* CARDS */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px", display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", marginTop: -30 }}>

        {/* ── STARTER ── */}
        <div style={S.card(false)}>
          <div style={{ color: "#818cf8", ...S.planName }}>{isTr ? "Starter — Ücretsiz" : "Starter — Free"}</div>
          <div style={{ color: isDark ? "#f1f5f9" : "#0f172a", ...S.price }}>₺0</div>
          <div style={{ ...S.period, color: isDark ? "#64748b" : "#94a3b8" }}>{isTr ? "kayıt sonrası" : "after registration"}</div>
          <hr style={{ border: "none", borderTop: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0", margin: "0 0 20px" }} />
          {features.starter.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <span style={{ color: "#818cf8", flexShrink: 0 }}>✓</span>
              <span style={S.feat}>{f}</span>
            </div>
          ))}
          {isSignedIn && userPlan === "starter"
            ? <button style={{ ...S.btn(false), opacity: .6, cursor: "default" }} disabled>{isTr ? "Mevcut Planınız" : "Your Current Plan"}</button>
            : <Link href={isSignedIn ? "/dashboard" : "/signup"} style={{ display: "block", textDecoration: "none" }}>
                <button style={S.btn(false)}>{isTr ? "Ücretsiz Başla" : "Get Started Free"}</button>
              </Link>
          }
        </div>

        {/* ── PROFESSIONAL ── */}
        <div style={S.card(true)}>
          <span style={S.badge}>{isTr ? "⭐ Önerilen" : "⭐ Recommended"}</span>
          <div style={{ color: "#60a5fa", ...S.planName }}>Professional</div>
          <div style={{ color: isDark ? "#f1f5f9" : "#0f172a", ...S.price }}>₺415</div>
          <div style={{ ...S.period, color: isDark ? "#64748b" : "#94a3b8" }}>{isTr ? "/ ay · ≈ $9" : "/ month · ≈ $9"}</div>
          <hr style={{ border: "none", borderTop: "1px solid #1e3a6e", margin: "0 0 20px" }} />
          {features.pro.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <span style={{ color: "#34d399", flexShrink: 0 }}>✓</span>
              <span style={S.feat}>{f}</span>
            </div>
          ))}
          {isSignedIn && userPlan === "professional"
            ? <button style={{ ...S.btn(true), opacity: .6, cursor: "default" }} disabled>{isTr ? "Mevcut Planınız" : "Your Current Plan"}</button>
            : <button style={{ ...S.btn(true), opacity: loading ? 0.7 : 1 }} onClick={handleProCheckout} disabled={loading}>
                {loading ? (isTr ? "Yönlendiriliyor..." : "Redirecting...") : (isTr ? "Professional Plana Geç" : "Go Professional")}
              </button>
          }
          <p style={{ color: "#64748b", fontSize: 11, textAlign: "center", marginTop: 10 }}>
            {isTr ? "Shopier ile güvenli ödeme · SSL şifreli · 30 gün erişim" : "Secure payment via Shopier · SSL encrypted · 30-day access"}
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 640, margin: "0 auto 80px", padding: "0 24px" }}>
        <h2 style={{ color: isDark ? "#f1f5f9" : "#0f172a", fontWeight: 700, fontSize: 20, marginBottom: 24, textAlign: "center" }}>
          {isTr ? "Sık Sorulan Sorular" : "Frequently Asked Questions"}
        </h2>
        {(isTr ? [
          ["Starter planda ne kadar süre kullanabilirim?", `Her araç için ${STARTER_LIMIT} kullanım hakkı vardır. Süre kısıtlaması yoktur.`],
          ["Professional planı iptal edebilir miyim?", "Evet, istediğiniz zaman iptal edebilirsiniz. İptal sonrasında kalan süre boyunca erişiminiz devam eder."],
          ["Danışmanlık hizmeti nedir?", "Deneyimli metalurji mühendisleriyle birebir teknik danışmanlık görüşmesidir. Professional planda ayda 1 kez ücretsizdir."],
          ["Ödeme güvenli mi?", "Tüm ödemeler Shopier altyapısı üzerinden SSL ile şifrelenmiş şekilde güvenli şekilde işlenir."],
          ["Ödeme sonrası planım ne zaman aktif olur?", "Shopier'dan ödeme onayı alındıktan sonra planınız birkaç dakika içinde otomatik olarak aktifleştirilir."],
        ] : [
          ["How long can I use the Starter plan?", `Each tool has ${STARTER_LIMIT} uses. There is no time limit.`],
          ["Can I cancel the Professional plan?", "Yes, at any time. Your access continues for the remaining period after cancellation."],
          ["What is the consultation service?", "One-on-one technical consultation with experienced metallurgical engineers. Free once per month on the Professional plan."],
          ["Is payment secure?", "All payments are processed securely through the Shopier platform with SSL encryption."],
          ["When will my plan activate?", "Your plan activates automatically within a few minutes after payment confirmation from Shopier."],
        ]).map(([q, a], i) => (
          <div key={i} style={{ background: isDark ? "#111827" : "#ffffff", border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 12 }}>
            <div style={{ color: isDark ? "#e2e8f0" : "#0f172a", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{q}</div>
            <div style={{ color: isDark ? "#64748b" : "#6b7280", fontSize: 13, lineHeight: 1.7 }}>{a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
