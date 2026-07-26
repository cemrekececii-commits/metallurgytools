import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { siteGraphLd, CLAIMS } from "@/lib/seo";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import Navbar from "@/components/Navbar";
import TrialBanner from "@/components/TrialBanner";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import "./globals.css";

// ─────────────────────────────────────────────────────────────────────────────
// metadataBase: tüm relative og:image / canonical URL'leri için tek doğruluk
// kaynağı. www subdomain'i production'da resmi adres olduğu için canonical
// www'lu olmalı. Aksi halde Google "www" ve "non-www" varyantlarını ayrı
// URL'ler olarak görür → duplicate content / sinyal dağılması.
// ─────────────────────────────────────────────────────────────────────────────
const SITE_URL = "https://www.metallurgytools.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MetallurgyTools – Professional Steel Metallurgy Calculators",
    template: "%s | MetallurgyTools"
  },
  description: "Free professional metallurgical engineering tools: Fe-C phase diagram, ASTM E112 grain size analyzer, API 570 corrosion calculator, hardness converter, CCT/TTT interpreter, weld preheat calculator, DWTT, inclusion atlas, SEM-EDS analysis. Built by steel plant metallurgists for API, DP600, S700MC, IF, ST37–ST52 steels.",
  keywords: [
    // Core EN
    "metallurgy tools", "steel calculator", "Fe-C phase diagram", "ASTM E112", "grain size calculator",
    "corrosion rate calculator", "API 570", "hardness converter", "HRC HV HB conversion",
    "carbon equivalent calculator", "weld preheat", "EN 1011-2", "DBTT prediction",
    "CCT diagram", "TTT diagram", "inclusion classification", "ASTM E45",
    "DWTT calculator", "SEM-EDS peak overlap", "tensile specimen calculator",
    "ultrasonic testing", "failure analysis", "wire rod defects", "coil defects",
    // Core TR
    "metalurji araçları", "çelik hesaplama", "faz diyagramı", "tane boyutu",
    "sertlik çevirici", "kaynak ön ısıtma", "korozyon hızı", "karbon eşdeğeri",
    "hasar analizi", "kırılma mekaniği", "darbe testi", "DWTT", "çekme testi",
    "metalografik analiz", "inklüzyon analizi", "SEM-EDS",
    // Grade-specific (high-intent long-tail)
    "S700MC", "DP600", "API 5L", "API 5CT", "IF steel", "ST37", "ST44", "ST52",
    "HSLA çelik", "düşük alaşımlı çelik", "yüksek mukavemetli çelik",
    "wire rod", "kangal", "bobin", "slab", "kütük çatlağı",
    // Industry / domain
    "metallurgical engineering", "steel metallurgy", "integrated steel plant",
    "İsdemir", "Erdemir", "BOF", "EAF", "sürekli döküm", "haddeleme"
  ],
  authors: [{ name: "MetallurgyTools" }],
  creator: "MetallurgyTools",
  publisher: "MetallurgyTools",
  openGraph: {
    title: "MetallurgyTools – Professional Steel Metallurgy Calculators",
    // Nicel iddia lib/seo.js → CLAIMS'ten gelir (tek doğruluk kaynağı).
    description: `Free professional-grade metallurgical engineering tools. Fe-C phase diagram, grain size analyzer, corrosion calculator, hardness converter, CCT/TTT, DWTT, inclusion atlas, failure analysis cases. Built by metallurgists processing ${CLAIMS.testsPerYearLabel.en} across ${CLAIMS.experienceLabel.en}.`,
    url: SITE_URL,
    siteName: "MetallurgyTools",
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "MetallurgyTools – Professional steel metallurgy calculators and failure analysis tools",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MetallurgyTools – Professional Steel Metallurgy Calculators",
    description: "Free professional metallurgical engineering tools built by steel plant experts. ASTM E112, ASTM E140, API 570, EN 1011-2, ASTM E45.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    // Bilingual i18n şu an için query/UI seviyesinde tutuluyor → her iki
    // x-default ve dil sürümü kök URL'e işaret eder. Eğer ileride
    // /tr/* ve /en/* segmentlerine geçilirse buralar güncellenmeli.
    languages: {
      "x-default": SITE_URL,
      "tr-TR": SITE_URL,
      "en-US": SITE_URL,
    },
  },
  // Site sahipliği doğrulama (Search Console / Bing Webmaster Tools)
  // Aşağıdaki env değerlerini Vercel → Environment Variables altına ekle.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
      "yandex-verification": process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
    },
  },
  category: "Engineering",
  applicationName: "MetallurgyTools",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="tr">
        <head>
          {/* Google Consent Mode v2 — default DENIED (KVKK/ePrivacy uyumlu).
              Kullanıcı consent verene kadar GA/Clarity gibi analitik araçlar
              cookie/storage'a yazamaz. Banner kabul edilince update edilir. */}
          <Script id="consent-default" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                wait_for_update: 500
              });
            `}
          </Script>

          {/* Analitik script'leri (GA4 + Clarity) yalnızca consent verildiyse
              yüklenir. Bu component client tarafında çalışır. */}

          {/* JSON-LD birleşik graf: Organization + WebSite + ProfessionalService
              + SoftwareApplication. Tek @graph içinde yayınlanır; @id
              referansları aynı belgede çözülür. Kaynak: lib/seo.js
              (tek doğruluk noktası — sameAs, knowsAbout, hizmet kataloğu).

              next/script yerine düz <script>: JSON-LD çalıştırılmaz, yalnız
              okunur. beforeInteractive stratejisi bu içerik için gereksizdi
              ve script'i client bundle'a bağlıyordu. */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraphLd()) }}
          />

          {/* llms.txt keşfi — LLM ajanlarının site özet dosyasını bulması için.
              [Doğrulanmadı] llms.txt henüz resmî bir W3C/IETF standardı değildir;
              yaygınlaşan bir topluluk konvansiyonudur. */}
          <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
          <link rel="alternate" type="text/plain" href="/llms-full.txt" title="llms-full.txt" />
        </head>
        <body>
          {/* Consent-gated analitik script enjekte eder (client-only) */}
          <AnalyticsScripts />
          <ThemeProvider>
            <LanguageProvider>
              <TrialBanner />
              <Navbar />
              {children}
              <Footer />
              {/* KVKK / ePrivacy çerez consent banner */}
              <CookieConsent />
            </LanguageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
