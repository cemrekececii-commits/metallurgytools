import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@/lib/seo";

export const metadata = {
  title: "Mekanik Test Yöntemleri: Çekme, Darbe (Charpy) ve DWTT",
  description:
    "Mekanik test yöntemlerinin metalurjik temelleri: ASTM E8/EN ISO 6892-1 çekme testi (akma, çekme dayanımı, plastik instabilite, gerinme sertleşmesi katsayısı n, Lüders gerinimi), Charpy darbe testi ile DBTT geçişi, ASTM E436 DWTT testi ile gevrek kırılma davranışı ve gerçek üretim akışında pratik yorumlamalar.",
  keywords: [
    "çekme testi", "ASTM E8", "EN ISO 6892-1", "tensile test",
    "Charpy darbe", "DBTT", "DWTT", "ASTM E436", "ASTM E23",
    "plastik instabilite", "akma dayanımı", "gerinme sertleşmesi",
    "Lüders bandı", "gevrek kırılma", "mechanical testing"
  ],
  alternates: { canonical: "/knowledge/mechanical-testing" },
  openGraph: {
    title: "Mekanik Test Yöntemleri — Çekme, Charpy, DWTT",
    description: "ASTM ve EN ISO standartlarına göre çekme, darbe ve DWTT testlerinin metalurjik yorumu.",
    type: "article",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          techArticleLd({
            headline: "Mekanik Test Yöntemleri: Çekme, Darbe (Charpy) ve DWTT",
            path: "/knowledge/mechanical-testing",
            description:
              "ASTM E8/ISO 6892-1 çekme, Charpy darbe ve ASTM E436 DWTT testlerinin metalurjik temelleri.",
            keywords: ["mekanik test", "çekme testi", "Charpy", "DWTT", "ASTM E8"],
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Bilgi Tabanı", path: "/knowledge" },
            { name: "Mekanik Test Yöntemleri", path: "/knowledge/mechanical-testing" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
