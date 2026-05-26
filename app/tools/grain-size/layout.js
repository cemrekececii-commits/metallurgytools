const SITE_URL = "https://www.metallurgytools.com";
const URL = `${SITE_URL}/tools/grain-size`;

export const metadata = {
  title: "ASTM E112 Tane Boyutu Analiz Aracı (G, μm, Hall-Petch)",
  description:
    "ASTM E112 tane boyutu hesaplama aracı: G sayısı, ortalama tane çapı (μm) ve Hall-Petch akma dayanımı tahmini. Kesitsel (lineer kesişim) ve planimetrik (Jeffries) yöntemler için. Optik mikrograflarda metalografik analiz ve mikroyapı karakterizasyonu.",
  keywords: [
    "ASTM E112", "tane boyutu hesabı", "grain size calculator",
    "G sayısı tane çapı", "Hall-Petch", "Jeffries planimetrik",
    "kesitsel yöntem", "lineer intercept", "metalografi tane boyutu",
    "IF steel grain size", "HSLA tane boyutu",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "ASTM E112 Tane Boyutu Analiz Aracı",
    description: "G sayısı, ortalama tane çapı ve Hall-Petch ile akma dayanımı tahmini.",
    url: URL,
    type: "website",
    locale: "tr_TR",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "ASTM E112 Grain Size Analyzer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ASTM E112 Tane Boyutu Analizi",
    description: "G sayısı, çap (μm) ve Hall-Petch akma dayanımı tahmini.",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "ASTM E112 Tane Boyutu Analiz Aracı",
            "url": URL,
            "applicationCategory": "EngineeringApplication",
            "applicationSubCategory": "Metallography",
            "operatingSystem": "Web",
            "description": "ASTM E112 tane boyutu hesaplama aracı: kesitsel ve planimetrik yöntemler.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": SITE_URL },
              { "@type": "ListItem", "position": 2, "name": "Araçlar", "item": `${SITE_URL}/tools` },
              { "@type": "ListItem", "position": 3, "name": "Tane Boyutu", "item": URL },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
