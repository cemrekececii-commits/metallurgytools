import { CASE_BY_SLUG } from "@/components/hasar/CaseData";

export async function generateMetadata({ params }) {
  const c = CASE_BY_SLUG[params.slug];
  if (!c) return { title: "Vaka bulunamadı" };
  return {
    title: `#${c.no} ${c.tr} | Hasar Vakaları — MetallurgyTools`,
    description: `${c.tr} — ${c.sikayet}. Tespitler, nedenler ve proses kontrolleri.`,
    keywords: c.tags,
  };
}

export default function Layout({ children }) {
  return children;
}
