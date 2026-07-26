// ─────────────────────────────────────────────────────────────────────────────
// /about — kurumsal kimlik sayfası metadata + AboutPage JSON-LD.
//
// Nicel iddialar lib/seo.js → CLAIMS'ten gelir. Daha önce burada "18+ years /
// 50,000+", kök layout'ta "350,000+" yazıyordu; çelişkili nicel iddia güven
// sinyalini zayıflatır. Artık tek yerden beslenir.
// ─────────────────────────────────────────────────────────────────────────────
import { SITE_URL, ORG_ID, SERVICE_ID, WEBSITE_ID, CLAIMS, breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

const URL = `${SITE_URL}/about`;

export const metadata = {
  title: "About MetallurgyTools | Professional Metallurgical Engineering",
  description: `Learn about MetallurgyTools. Built by integrated steel plant metallurgists with ${CLAIMS.experienceLabel.en}, processing ${CLAIMS.testsPerYearLabel.en}. Tools calibrated against ASTM, EN ISO, API and VDA standards.`,
  keywords: [
    "metalurji danışmanlık", "hasar analizi danışmanlığı", "metallurgical consulting",
    "failure analysis consultant", "çelik metalurjisi uzmanı", "MetallurgyTools hakkında",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Hakkında — MetallurgyTools",
    description: `${CLAIMS.experienceLabel.tr}; ${CLAIMS.testsPerYearLabel.tr}.`,
    url: URL,
    type: "profile",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    siteName: "MetallurgyTools",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "MetallurgyTools" }],
  },
  twitter: { card: "summary_large_image", title: "Hakkında — MetallurgyTools" },
};

const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${URL}#aboutpage`,
  url: URL,
  name: "About MetallurgyTools",
  inLanguage: "tr-TR",
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": ORG_ID },
  mainEntity: { "@id": ORG_ID },
  // Danışmanlık hizmet grafına açık referans.
  mentions: { "@id": SERVICE_ID },
};

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          aboutLd,
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Hakkında", path: "/about" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
