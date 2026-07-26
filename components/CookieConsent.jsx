"use client";

/**
 * components/CookieConsent.jsx
 * ────────────────────────────────────────────────────────────────────
 * KVKK + ePrivacy + GDPR uyumlu cookie consent banner.
 *
 *   - "Reddet" varsayılan (consent yoksa analitik script'ler yüklenmez).
 *   - "Sadece zorunlu" / "Tümünü kabul et" / "Tercihler" — 3 seçenek.
 *   - localStorage'da `mt_cookie_consent_v1` = JSON({analytics, marketing, ts}).
 *   - Google Consent Mode v2 default 'denied', kullanıcı kabul ederse
 *     `update` event'i fırlatılır (window.gtag varsa).
 *   - Banner görünmeden önce GA/Clarity yüklenmez (layout.js'de hasConsent
 *     check'i ile).
 *
 * Trigger:
 *   - İlk ziyarette banner görünür.
 *   - Footer'daki "Çerez Tercihleri" linkine tıklayınca tekrar açılır
 *     (window.dispatchEvent(new Event('mt:open-cookie-prefs'))).
 */

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "mt_cookie_consent_v1";
const VERSION     = 1;

function readConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (!p || p.v !== VERSION) return null;
    return p;
  } catch { return null; }
}

function writeConsent(payload) {
  const out = { v: VERSION, ...payload, ts: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
  // Google Consent Mode v2 — bilgilendirici update
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage:        out.marketing ? "granted" : "denied",
        ad_user_data:      out.marketing ? "granted" : "denied",
        ad_personalization:out.marketing ? "granted" : "denied",
        analytics_storage: out.analytics ? "granted" : "denied",
      });
    }
  } catch { /* ignore */ }
  // Sayfa hot-reload yerine event yayınla — analitik script'ler dinleyebilir
  try { window.dispatchEvent(new CustomEvent("mt:consent-changed", { detail: out })); } catch {}
}

export function hasAnalyticsConsent() {
  const c = readConsent();
  return !!(c && c.analytics);
}

export default function CookieConsent() {
  const [open, setOpen]       = useState(false);
  const [showPrefs, setPrefs] = useState(false);
  const [analytics, setAna]   = useState(false);
  const [marketing, setMkt]   = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setOpen(true);
    } else {
      setAna(!!existing.analytics);
      setMkt(!!existing.marketing);
    }
    const reopen = () => { setOpen(true); setPrefs(true); };
    window.addEventListener("mt:open-cookie-prefs", reopen);
    return () => window.removeEventListener("mt:open-cookie-prefs", reopen);
  }, []);

  const accept = useCallback((all) => {
    writeConsent({
      analytics: all ? true : analytics,
      marketing: all ? true : marketing,
      essential: true,
    });
    setOpen(false);
    setPrefs(false);
  }, [analytics, marketing]);

  const rejectAll = useCallback(() => {
    writeConsent({ analytics: false, marketing: false, essential: true });
    setOpen(false);
    setPrefs(false);
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Çerez tercihleri"
      style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 9999,
        padding: "16px",
        background: "rgba(15, 23, 42, 0.97)",
        backdropFilter: "blur(6px)",
        borderTop: "1px solid rgba(212, 175, 55, 0.25)",
        color: "#e2e8f0",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: 14,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <strong style={{ color: "#d4af37" }}>Çerez Kullanımı (KVKK / ePrivacy)</strong>
          <p style={{ margin: "6px 0 0", lineHeight: 1.5 }}>
            Sitemizin çalışması için zorunlu çerezleri kullanıyoruz. İsteğe bağlı
            olarak analitik (Google Analytics, Microsoft Clarity) ve pazarlama
            çerezlerini kullanmamıza izin verebilirsiniz. Tercihinizi istediğiniz
            zaman <a href="/cerez-politikasi" style={{ color: "#d4af37" }}>Çerez Politikası</a> ve <a href="/gizlilik-politikasi" style={{ color: "#d4af37" }}>Gizlilik Politikası</a> sayfalarımızdan değiştirebilirsiniz.
          </p>
        </div>

        {showPrefs && (
          <div style={{ display: "grid", gap: 8, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.7 }}>
              <input type="checkbox" checked disabled />
              <span>Zorunlu (oturum, güvenlik) — devre dışı bırakılamaz</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={analytics} onChange={(e) => setAna(e.target.checked)} />
              <span>Analitik (Google Analytics 4, Microsoft Clarity)</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={marketing} onChange={(e) => setMkt(e.target.checked)} />
              <span>Pazarlama / kişiselleştirme</span>
            </label>
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={rejectAll}
            style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid rgba(226,232,240,0.2)", background: "transparent", color: "#e2e8f0", cursor: "pointer" }}>
            Sadece zorunlu
          </button>
          <button onClick={() => setPrefs((s) => !s)}
            style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid rgba(226,232,240,0.2)", background: "transparent", color: "#e2e8f0", cursor: "pointer" }}>
            {showPrefs ? "Tercihleri gizle" : "Tercihleri ayarla"}
          </button>
          {showPrefs && (
            <button onClick={() => accept(false)}
              style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #d4af37", background: "transparent", color: "#d4af37", cursor: "pointer" }}>
              Seçimi kaydet
            </button>
          )}
          <button onClick={() => accept(true)}
            style={{ padding: "8px 14px", borderRadius: 6, border: "none", background: "#d4af37", color: "#0f172a", fontWeight: 600, cursor: "pointer" }}>
            Tümünü kabul et
          </button>
        </div>
      </div>
    </div>
  );
}
