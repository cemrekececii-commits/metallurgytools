const SITE_URL = "https://www.metallurgytools.com";
const URL = `${SITE_URL}/tools/dwtt`;

export const metadata = {
  title: "DWTT Simülasyon Aracı — API 5L Drop-Weight Tear Test (X42-X80)",
  description:
    "API 5L pipeline çelikleri için Drop-Weight Tear Test (DWTT) simülatörü. X42, X52, X60, X65, X70, X80 dereceler için gerekli darbe enerjisi hesabı; akma dayanımı, cidar kalınlığı ve düşme yüksekliğine göre joule değerleri. ASTM E436 ve API 5L Annex G'ye uygun. 55,000 J Pragya makine arayüzü.",
  keywords: [
    "DWTT", "drop weight tear test", "API 5L DWTT",
    "ASTM E436", "API 5L Annex G", "pipeline çelik testi",
    "X70 DWTT", "X65 DWTT", "shear area kırılma yüzeyi",
    "BDWTT", "gevrek-sünek geçiş", "pipe SDWTT",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "DWTT Simülasyon Aracı — Pipeline Steel API 5L",
    description: "X42-X80 dereceler için DWTT enerji hesabı ve kırılma yüzeyi analizi.",
    url: URL,
    type: "website",
    locale: "tr_TR",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "DWTT Simulator" }],
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
            "name": "DWTT Simülasyon Aracı",
            "url": URL,
            "applicationCategory": "EngineeringApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          }),
        }}
      />
      {children}
    </>
  );
}
