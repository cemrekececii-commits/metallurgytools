const SITE_URL = "https://www.metallurgytools.com";
const URL = `${SITE_URL}/tools/phase-diagram`;

export const metadata = {
  title: "Fe-C Faz Diyagramı İnteraktif Aracı (Ötektoid, Kaldıraç Kuralı)",
  description:
    "İnteraktif Fe-C (demir-sementit) faz diyagramı aracı. Karbon içeriği ve sıcaklığa göre faz fraksiyonları, A1/A3/Acm kritik sıcaklıkları, kaldıraç kuralı ile ferrit / östenit / sementit / perlit oranları. Ötektoid (0.76 %C, 727°C), hipoötektoid ve hiperötektoid çelikler için faz analizi.",
  keywords: [
    "Fe-C faz diyagramı", "iron carbon phase diagram",
    "ötektoid reaksiyon", "kaldıraç kuralı", "lever rule",
    "A1 A3 Acm kritik sıcaklık", "faz fraksiyonu hesabı",
    "ferrit östenit", "perlit sementit", "Fe-Fe3C",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Fe-C Faz Diyagramı İnteraktif Aracı",
    description: "Faz fraksiyonları, kaldıraç kuralı ve kritik sıcaklıklar.",
    url: URL,
    type: "website",
    locale: "tr_TR",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Fe-C Phase Diagram" }],
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
            "name": "Fe-C Faz Diyagramı İnteraktif Aracı",
            "url": URL,
            "applicationCategory": "EngineeringApplication",
            "applicationSubCategory": "Thermodynamics",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          }),
        }}
      />
      {children}
    </>
  );
}
