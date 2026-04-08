import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const GA_ID = "G-P1R7MB65WK";
const CLARITY_ID = "w8jv2xdiqq";

export const metadata = {
  title: {
    default: "MetallurgyTools – Professional Steel Metallurgy Calculators",
    template: "%s | MetallurgyTools"
  },
  description: "Free professional metallurgical engineering tools: Fe-C phase diagram, ASTM E112 grain size analyzer, API 570 corrosion calculator, hardness converter, CCT/TTT interpreter, weld preheat calculator. Built by steel plant metallurgists.",
  keywords: [
    "metallurgy tools", "steel calculator", "Fe-C phase diagram", "ASTM E112", "grain size calculator",
    "corrosion rate calculator", "API 570", "hardness converter", "HRC HV HB conversion",
    "carbon equivalent calculator", "weld preheat", "EN 1011-2", "DBTT prediction",
    "CCT diagram", "TTT diagram", "inclusion classification", "ASTM E45",
    "metalurji araçları", "çelik hesaplama", "faz diyagramı", "tane boyutu",
    "S700MC", "DP600", "API 5L", "IF steel", "sertlik çevirici",
    "kaynak ön ısıtma", "korozyon hızı", "karbon eşdeğeri",
    "metallurgical engineering", "steel metallurgy", "integrated steel plant"
  ],
  authors: [{ name: "MetallurgyTools" }],
  creator: "MetallurgyTools",
  openGraph: {
    title: "MetallurgyTools – Professional Steel Metallurgy Calculators",
    description: "Free professional-grade metallurgical engineering tools. Fe-C phase diagram, grain size analyzer, corrosion calculator, hardness converter and more. Built on 50,000+ real production data points.",
    url: "https://metallurgytools.com",
    siteName: "MetallurgyTools",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MetallurgyTools – Professional Steel Metallurgy Calculators",
    description: "Free professional metallurgical engineering tools built by steel plant experts.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://metallurgytools.com",
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
