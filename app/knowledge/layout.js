export const metadata = {
  title: "Metallurgy Knowledge Base | Steel Microstructure & Testing Guides",
  description:
    "Derinlemesine metalurji rehberleri: Fe-C faz diyagramı, çelik mikroyapıları (ferrit, perlit, beynit, martenzit), sertlik testleri, mekanik test yöntemleri, korozyon mekanizmaları, tane boyutu ve Hall-Petch ilişkisi. ASTM ve EN ISO standartlarına göre.",
  keywords: [
    "metalurji bilgi tabanı", "metallurgy knowledge", "Fe-C faz diyagramı",
    "çelik mikroyapısı", "ferrit perlit", "beynit martenzit", "Hall-Petch",
    "tane boyutu", "ASTM E112", "ASTM E140", "sertlik testi",
    "Rockwell Vickers Brinell", "korozyon mekanizmaları", "mekanik test",
    "çekme testi", "darbe testi", "DWTT", "steel metallurgy guide"
  ],
  openGraph: {
    title: "Metallurgy Knowledge Base — Çelik Metalurjisi Rehberleri",
    description: "Fe-C faz diyagramı, çelik mikroyapıları, sertlik ve mekanik test yöntemleri üzerine kapsamlı teknik rehberler.",
    type: "website",
    locale: "tr_TR",
  },
  alternates: { canonical: "/knowledge" },
};

export default function KnowledgeLayout({ children }) {
  return children;
}
