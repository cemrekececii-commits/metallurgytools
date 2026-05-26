const SITE_URL = "https://www.metallurgytools.com";
const URL = `${SITE_URL}/tools/hardness`;

export const metadata = {
  title: "ASTM E140 Sertlik Dönüştürme Aracı (HRC, HV, HBW, HRB)",
  description:
    "ASTM E140 / ISO 18265 sertlik dönüşüm aracı. HRC, Vickers (HV), Brinell (HBW), Rockwell B/A/D ve süperficial 15N/30N/45N skalaları arasında karşılıklı dönüşüm. Karbon çeliği, düşük alaşımlı çelik, yapı çeliği ve SV&T çelik için ayrı tablolar; mukavemet tahmini (UTS).",
  keywords: [
    "ASTM E140", "ISO 18265", "sertlik dönüşümü", "hardness conversion",
    "HRC HV dönüşüm", "Vickers Brinell çevirim", "HBW HRC tablo",
    "Rockwell C Vickers", "süperficial sertlik", "sertlik mukavemet",
    "carbon steel hardness", "Q&T steel hardness",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "ASTM E140 Sertlik Dönüştürme — HRC ↔ HV ↔ HBW",
    description: "Sertlik skalaları arasında standartlara dayalı karşılıklı dönüşüm ve mukavemet tahmini.",
    url: URL,
    type: "website",
    locale: "tr_TR",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "ASTM E140 Hardness Converter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ASTM E140 Sertlik Dönüştürme",
    description: "HRC, HV, HBW, HRB ve süperficial skalalar arasında dönüşüm + mukavemet referansı.",
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
            "name": "ASTM E140 Sertlik Dönüştürme Aracı",
            "url": URL,
            "applicationCategory": "EngineeringApplication",
            "applicationSubCategory": "Hardness Conversion",
            "operatingSystem": "Web",
            "description": "ASTM E140 / ISO 18265 sertlik dönüşüm aracı. HRC, HV, HBW, HRB ve süperficial skalalar arasında dönüşüm.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "isPartOf": { "@id": `${SITE_URL}/#website` },
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
              { "@type": "ListItem", "position": 3, "name": "Sertlik Dönüştürme", "item": URL },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
