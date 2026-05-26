const SITE_URL = "https://www.metallurgytools.com";
const URL = `${SITE_URL}/tools/corrosion`;

export const metadata = {
  title: "API 570 Korozyon Hızı ve Kalan Ömür Hesaplayıcı",
  description:
    "API 570 basınçlı boru ve pres ekipmanları için korozyon hızı hesabı: uzun dönem (LTCR), kısa dönem (STCR) hızlar, kalan duvar kalınlığı, denetim aralığı (RCAI) ve Barlow formülü ile minimum gerekli kalınlık. ASME B31.3 ve API 510 referansları.",
  keywords: [
    "API 570 korozyon hızı", "corrosion rate calculator",
    "LTCR STCR", "Barlow formula", "minimum gerekli kalınlık",
    "ASME B31.3", "API 510", "kalan ömür hesabı",
    "pressure piping inspection",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "API 570 Korozyon Hızı Hesaplayıcı",
    description: "LTCR/STCR korozyon hızları, kalan duvar kalınlığı ve denetim aralığı.",
    url: URL,
    type: "website",
    locale: "tr_TR",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "API 570 Corrosion Calculator" }],
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
            "name": "API 570 Korozyon Hızı Hesaplayıcı",
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
