// ─────────────────────────────────────────────────────────────────────────────
// /consultation — danışmanlık hizmetleri sayfası metadata + JSON-LD.
//
// Bu sayfa daha önce robots.js içinde disallow altındaydı ve hiçbir metadata /
// yapılandırılmış veri taşımıyordu. Danışmanlık konumlandırmasının taranabilir
// tek dayanağı olduğu için indekslemeye açıldı; ProfessionalService şemasının
// url alanı da bu sayfayı gösterir.
//
// Form gönderimi POST /api/consultation üzerinden yapılır; /api/ robots'ta
// kapalıdır ve rate-limit uygulanır.
// ─────────────────────────────────────────────────────────────────────────────
import { SITE_URL, WEBSITE_ID, SERVICE_ID, ORG_ID, professionalServiceLd, breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

const URL = `${SITE_URL}/consultation`;

export const metadata = {
  title: "Metalurji Danışmanlık Talebi — Hasar Analizi ve Mikroyapı Değerlendirmesi",
  description:
    "Metalurjik danışmanlık: hasar ve kırılma analizi, mekanik test sonuçlarının yorumlanması, mikroyapı ve faz analizi, inklüzyon değerlendirmesi, sürekli döküm ve sıcak haddeleme proses sorunları, kalite kontrol ve standart uyumu. Türkçe ve İngilizce hizmet.",
  keywords: [
    "metalurji danışmanlık", "hasar analizi hizmeti", "kırılma analizi",
    "mikroyapı analizi hizmeti", "inklüzyon analizi", "kök neden analizi",
    "metallurgical consulting", "failure analysis service", "root cause analysis",
    "SEM-EDS hizmeti", "sürekli döküm danışmanlık", "sıcak haddeleme danışmanlık",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Metalurji Danışmanlık Talebi — MetallurgyTools",
    description:
      "Hasar analizi, mikroyapı karakterizasyonu, inklüzyon değerlendirmesi ve mekanik test yorumlama konularında danışmanlık talebi.",
    url: URL,
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    siteName: "MetallurgyTools",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "MetallurgyTools Danışmanlık" }],
  },
  twitter: { card: "summary_large_image", title: "Metalurji Danışmanlık Talebi — MetallurgyTools" },
};

// Sayfa düzeyinde tam hizmet kataloğu — kök grafta @id ile tanımlı olan
// ProfessionalService varlığının kanonik sayfası burasıdır.
const serviceLd = { "@context": "https://schema.org", ...professionalServiceLd() };

const contactPageLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${URL}#contactpage`,
  url: URL,
  name: "Metalurji Danışmanlık Talebi",
  inLanguage: "tr-TR",
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": SERVICE_ID },
  provider: { "@id": ORG_ID },
};

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          serviceLd,
          contactPageLd,
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Danışmanlık", path: "/consultation" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
