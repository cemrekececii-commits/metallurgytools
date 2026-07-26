"use client";

/**
 * components/CookiePrefsButton.jsx
 * Çerez tercihleri banner'ını yeniden açmak için reusable buton.
 */
export default function CookiePrefsButton({ className = "" }) {
  return (
    <button
      type="button"
      onClick={() => {
        try { window.dispatchEvent(new Event("mt:open-cookie-prefs")); } catch {}
      }}
      className={
        className ||
        "mt-4 px-4 py-2 border border-gold-400 text-gold-400 rounded hover:bg-gold-400/10"
      }
    >
      Çerez tercihlerimi yönet
    </button>
  );
}
