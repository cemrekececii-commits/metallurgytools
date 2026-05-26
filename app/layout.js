import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const GA_ID = "G-P1R7MB65WK";
const CLARITY_ID = "w8jv2xdiqq";

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
    description: "Free professional-grade metallurgical engineering tools. Fe-C phase diagram, grain size analyzer, corrosion calculator, hardness converter, CCT/TTT, DWTT, inclusion atlas, failure analysis cases. Built on 350,000+ real production data points.",
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
          {/* Google Analytics 4 */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
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

          {/* JSON-LD: Organization + WebSite + SoftwareApplication
              Google'ın siteyi anlayıp zengin sonuçlarda göstermesini kolaylaştırır. */}
          <Script id="ld-organization" type="application/ld+json" strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "https://www.metallurgytools.com/#organization",
                "name": "MetallurgyTools",
                "url": "https://www.metallurgytools.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.metallurgytools.com/og-default.png",
                  "width": 1200,
                  "height": 630
                },
                "sameAs": [],
                "description": "Professional steel metallurgy calculators and failure analysis tools built by integrated steel plant metallurgists.",
                "knowsAbout": [
                  "Steel Metallurgy", "Failure Analysis", "ASTM E112 Grain Size",
                  "ASTM E140 Hardness Conversion", "API 570 Corrosion",
                  "EN 1011-2 Weld Preheat", "CCT/TTT Diagrams", "DWTT Testing",
                  "SEM-EDS Analysis", "Inclusion Classification ASTM E45",
                  "Wire Rod Production", "Hot Rolling", "Continuous Casting"
                ]
              })
            }}
          />
          <Script id="ld-website" type="application/ld+json" strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://www.metallurgytools.com/#website",
                "name": "MetallurgyTools",
                "url": "https://www.metallurgytools.com",
                "inLanguage": ["tr-TR","en-US"],
                "publisher": { "@id": "https://www.metallurgytools.com/#organization" },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://www.metallurgytools.com/blog?search={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              })
            }}
          />
          <Script id="ld-softwareapp" type="application/ld+json" strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "MetallurgyTools",
                "operatingSystem": "Web",
                "applicationCategory": "EngineeringApplication",
                "applicationSubCategory": "Metallurgical Engineering",
                "description": "Professional metallurgical engineering calculator suite: ASTM E112 grain size, ASTM E140 hardness, API 570 corrosion, EN 1011-2 preheat, CCT/TTT, DWTT, SEM-EDS, inclusion atlas, failure analysis cases.",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "url": "https://www.metallurgytools.com"
              })
            }}
          />
        </head>
        <body>
          <ThemeProvider>
            <LanguageProvider>
              <Navbar />
              {children}
              <Footer />
            </LanguageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
