// ─────────────────────────────────────────────────────────────────────────────
// /collaborate — iş birliği başvuru sayfası metadata + JSON-LD.
//
// Sayfa kimlik doğrulaması gerektirmez ve indekslemeye açıktır; robots.js'te
// disallow listesinde DEĞİLDİR. Form gönderimi POST /api/collaboration
// üzerinden yapılır, /api/ robots'ta kapalıdır ve rate-limit uygulanır.
// ─────────────────────────────────────────────────────────────────────────────
import { SITE_URL, WEBSITE_ID, ORG_ID, breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

const URL = `${SITE_URL}/collaborate`;

export const metadata = {
  title: "İş Birliği Başvurusu — Metalurji, Yapay Zeka, Yazılım ve Otomasyon",
  description:
    "Metalurji bilgisini yazılım, yapay zeka ve endüstriyel otomasyonla birleştiren projelerde iş birliği çağrısı: mikroyapı ve fraktografi görüntü analizi, mekanik test verisi otomasyonu, proses–özellik tahmin modelleri, laboratuvar süreç otomasyonu ve alan-özgü LLM uygulamaları. Mühendis, araştırmacı, geliştirici ve kurumlardan başvuru kabul edilir.",
  keywords: [
    "metalurji yazılım iş birliği", "malzeme bilimi yapay zeka", "metalurji makine öğrenmesi",
    "mikroyapı görüntü analizi", "laboratuvar otomasyonu", "endüstriyel veri analizi",
    "metallurgy software collaboration", "materials informatics", "machine learning steel",
    "research collaboration metallurgy", "open source metallurgy tools",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "İş Birliği Başvurusu — MetallurgyTools",
    description:
      "Derin metalurji bilgisi ile yazılım, yapay zeka ve otomasyonu bir araya getiren ortak projeler için başvuru.",
    url: URL,
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    siteName: "MetallurgyTools",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "MetallurgyTools İş Birliği" }],
  },
  twitter: { card: "summary_large_image", title: "İş Birliği Başvurusu — MetallurgyTools" },
};

const collaboratePageLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${URL}#collaboratepage`,
  url: URL,
  name: "İş Birliği Başvurusu",
  description:
    "Metalurji, yapay zeka, yazılım ve otomasyon alanlarında ortak proje, açık kaynak katkı, akademik yayın ve danışmanlık iş birliği başvuru sayfası.",
  inLanguage: "tr-TR",
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": ORG_ID },
};

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          collaboratePageLd,
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "İş Birliği", path: "/collaborate" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
