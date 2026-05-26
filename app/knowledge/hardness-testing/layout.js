export const metadata = {
  title: "Sertlik Testleri: Rockwell, Vickers & Brinell — ASTM E18, E92, E10",
  description:
    "Metalik malzemelerde sertlik ölçüm prensipleri, uç geometrileri (elmas piramit, tungsten karbür bilye), yük seçimi, mikro/makro sertlik farkı ve ASTM E140 dönüşüm tabloları. HRC, HV, HBW, HRB, HRA çevirim ve çekme mukavemeti tahmini.",
  keywords: [
    "Rockwell sertlik", "Vickers sertlik", "Brinell sertlik",
    "ASTM E18", "ASTM E92", "ASTM E10", "ASTM E140",
    "HRC HV HB dönüşüm", "sertlik mukavemet ilişkisi",
    "mikro sertlik", "makro sertlik", "hardness conversion"
  ],
  alternates: { canonical: "/knowledge/hardness-testing" },
  openGraph: {
    title: "Sertlik Testleri: Rockwell, Vickers ve Brinell — Kapsamlı Rehber",
    description: "ASTM E18/E92/E10 sertlik ölçüm yöntemleri ve ASTM E140 dönüşüm tablosu. Mikroyapı-sertlik ilişkisi ve mukavemet tahmini.",
    type: "article",
  },
};

export default function Layout({ children }) {
  return children;
}
