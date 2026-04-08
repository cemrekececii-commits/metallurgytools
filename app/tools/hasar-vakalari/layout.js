export const metadata = {
  title: "Failure Analysis | Üretim Kusurları Atlası — MetallurgyTools",
  description:
    "Kangal, bobin, kütük ve slab ürünlerinde karşılaşılan üretim kusurlarının vaka bazlı analizi. White layer martensite, GBC, chevron çatlak, laminasyon, tufal/kabuk, kızıl oksit ve daha fazlası.",
  keywords: [
    "hasar analizi", "üretim kusurları", "wire rod defects", "coil defects",
    "white layer martensite", "GBC", "chevron crack", "laminasyon", "kabuk",
    "tufal", "kızıl oksit", "kangal", "bobin", "SEM-EDS", "metalurji",
  ],
  openGraph: {
    title: "Hasar Vakaları — Üretim Kusurları Atlası",
    description: "25 gerçek üretim kusuru vakası: wire rod ve bobin ürünlerinde metalografik analizler, nedenler ve önleme yöntemleri.",
    type: "website",
  },
};

export default function Layout({ children }) {
  return children;
}
