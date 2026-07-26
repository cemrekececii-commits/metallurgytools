import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbLd } from "@/lib/seo";

const PATH = "/tools/hasar-vakalari";
const URL = `${SITE_URL}${PATH}`;

export const metadata = {
  title: "Hasar Vakaları — Üretim Kusurları Atlası | Failure Analysis Case Atlas",
  description:
    "Kangal, bobin, kütük ve slab ürünlerinde 25 gerçek üretim kusuru vakası: white layer martensite, tane sınırı çatlağı (GBC), chevron çatlak, laminasyon, tufal/kabuk, kızıl oksit. Metalografik tespitler, SEM-EDS bulguları, kök neden analizi ve proses kontrolleri. 25 real production defect cases with metallographic findings and root-cause analysis for wire rod and flat products.",
  keywords: [
    "hasar analizi", "failure analysis", "üretim kusurları", "production defects",
    "wire rod defects", "coil defects", "white layer martensite", "GBC",
    "grain boundary cracking", "chevron crack", "laminasyon", "lamination",
    "kabuk", "tufal", "kızıl oksit", "red scale", "kangal", "bobin",
    "SEM-EDS", "kök neden analizi", "root cause analysis", "metalografi",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Hasar Vakaları — Üretim Kusurları Atlası",
    description:
      "25 gerçek üretim kusuru vakası: wire rod ve bobin ürünlerinde metalografik analizler, kök nedenler ve önleme yöntemleri.",
    url: URL,
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Failure Analysis Case Atlas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hasar Vakaları — Failure Analysis Case Atlas",
    description: "25 üretim kusuru vakası: metalografik tespitler ve kök neden analizleri.",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Hasar Vakaları — Üretim Kusurları Atlası",
            url: URL,
            description:
              "Kangal ve yassı ürünlerde üretim kusurlarının vaka bazlı metalografik analizi.",
            inLanguage: ["tr-TR", "en-US"],
            isPartOf: { "@id": `${SITE_URL}/#website` },
          },
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Araçlar", path: "/tools" },
            { name: "Hasar Vakaları", path: PATH },
          ]),
        ]}
      />
      {children}
    </>
  );
}
