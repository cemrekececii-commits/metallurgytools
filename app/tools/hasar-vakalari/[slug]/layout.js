import { CASE_BY_SLUG } from "@/components/hasar/CaseData";

const SITE_URL = "https://www.metallurgytools.com";

export async function generateMetadata({ params }) {
  const c = CASE_BY_SLUG[params.slug];
  if (!c) {
    return {
      title: "Vaka bulunamadı",
      robots: { index: false, follow: true },
    };
  }
  const title = `#${c.no} ${c.tr} | Hasar Vakaları`;
  const description = `${c.tr} — ${c.sikayet}. Metalografik tespitler, kök neden analizi ve proses kontrolleri. SEM-EDS, optik mikroskopi ve mekanik test bulgularıyla detaylı vaka çalışması.`;
  const url = `${SITE_URL}/tools/hasar-vakalari/${params.slug}`;
  return {
    title,
    description,
    keywords: c.tags,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      locale: "tr_TR",
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Layout({ children }) {
  return children;
}
