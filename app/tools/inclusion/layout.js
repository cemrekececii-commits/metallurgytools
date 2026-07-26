import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd, webAppLd } from "@/lib/seo";

const PATH = "/tools/inclusion";

export const metadata = buildMetadata({
  titleTR: "ASTM E45 İnklüzyon Sınıflandırma Aracı",
  titleEN: "ASTM E45 Inclusion Classification (Type A/B/C/D)",
  descTR:
    "ASTM E45 Metot A inklüzyon sınıflandırıcı: Tip A (sülfür), B (alümina), C (silikat), D (globüler oksit) derecelendirme, ince/kalın seri ayrımı ve kabul kriterleri. API 5L, S700MC, DP600, IF çelikleri için değerlendirme.",
  descEN:
    "ASTM E45 Method A inclusion rating: Type A (sulfide), B (alumina), C (silicate), D (globular oxide) with thin/heavy series and acceptance criteria for API 5L, S700MC, DP600 and IF steels.",
  path: PATH,
  keywords: [
    "ASTM E45", "inklüzyon sınıflandırma", "inclusion rating",
    "Tip A sülfür", "Type B alumina", "silikat inklüzyon", "globüler oksit",
    "ince seri kalın seri", "thin heavy series", "inclusion acceptance criteria",
    "çelik temizlik değerlendirmesi", "ISO 4967", "DS metodu",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webAppLd({
            name: "ASTM E45 İnklüzyon Sınıflandırıcı — Inclusion Classifier",
            path: PATH,
            description:
              "ASTM E45 Metot A'ya göre Tip A/B/C/D inklüzyon derecelendirme ve kabul kriteri kontrolü. ASTM E45 Method A inclusion rating tool.",
            subCategory: "Metallography / Steel Cleanliness",
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Araçlar", path: "/tools" },
            { name: "İnklüzyon Sınıflandırma", path: PATH },
          ]),
        ]}
      />
      {children}
    </>
  );
}
