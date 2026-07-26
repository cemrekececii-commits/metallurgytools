"use client";

/**
 * components/AnalyticsScripts.jsx
 * ────────────────────────────────────────────────────────────────────
 * GA4 ve Microsoft Clarity yalnızca kullanıcı analytics consent verdiyse
 * yüklenir. Google Consent Mode v2 default 'denied' başlangıçta set edilir
 * — böylece GA yüklü olsa bile cookie/storage'a yazma engellenir.
 *
 * Mimari:
 *   1) Layout SSR-side default Consent Mode 'denied' bayrağını yazar
 *      (inline script, beforeInteractive).
 *   2) Bu component client tarafında localStorage'dan consent okur.
 *   3) Consent varsa GA4 + Clarity script'leri inject eder.
 *   4) Consent runtime'da değişirse (CookieConsent event'i) yeniden
 *      enjekte/yapılandırılır.
 */

import { useEffect, useState } from "react";
import Script from "next/script";

const GA_ID      = "G-P1R7MB65WK";
const CLARITY_ID = "w8jv2xdiqq";

function readConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("mt_cookie_consent_v1");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export default function AnalyticsScripts() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(!!readConsent()?.analytics);
    sync();
    const onChange = () => sync();
    window.addEventListener("mt:consent-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("mt:consent-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  if (!allowed) return null;

  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          // Consent verildi: storage'ı 'granted' yap
          gtag('consent', 'update', {
            analytics_storage: 'granted'
          });
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true
          });
        `}
      </Script>

      {/* Microsoft Clarity */}
      <Script id="clarity-init" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","${CLARITY_ID}");
        `}
      </Script>
    </>
  );
}
