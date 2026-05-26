const SITE_URL = "https://www.metallurgytools.com";
const URL = `${SITE_URL}/tools/carbon-equivalent`;

export const metadata = {
  title: "Karbon Eşdeğeri Hesaplayıcı — CE(IIW), Pcm, CET, CEN (Kaynak Kabiliyeti)",
  description:
    "EN 1011-2 ve AWS D1.1 standartlarına göre karbon eşdeğeri hesaplama: CE(IIW), Pcm (Ito-Bessyo), CET (Yurioka) ve CEN formülleri. HSLA, API 5L X60-X80, S355, S420, S700MC çelikleri için kaynak kabiliyeti ve soğuk çatlak (HACC) risk değerlendirmesi.",
  keywords: [
    "karbon eşdeğeri", "carbon equivalent", "CE IIW", "Pcm",
    "CET Yurioka", "CEN", "EN 1011-2", "AWS D1.1",
    "kaynak kabiliyeti", "weldability", "soğuk çatlak", "HACC",
    "API 5L kaynak", "S355 weldability", "HSLA weldability",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Karbon Eşdeğeri Hesaplayıcı — Kaynak Kabiliyeti Değerlendirmesi",
    description: "CE(IIW), Pcm, CET, CEN formülleri ile soğuk çatlak risk analizi.",
    url: URL,
    type: "website",
    locale: "tr_TR",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Carbon Equivalent Calculator" }],
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
            "name": "Karbon Eşdeğeri Hesaplayıcı",
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
