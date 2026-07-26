import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@/lib/seo";

export const metadata = {
  title: "Tane Boyutu ve Hall-Petch İlişkisi — ASTM E112",
  description:
    "Tane boyutu (G), Hall-Petch denklemi (σy = σ0 + k·d^-1/2), ASTM E112 kesitsel yöntem ve planimetrik (Jeffries) yöntemi, tane boyutu-akma dayanımı-tokluk ilişkisi, anormal tane büyümesi, IF ve HSLA çeliklerde tane inceltme mekanizmaları (Nb, Ti, V mikroalaşım).",
  keywords: [
    "tane boyutu", "ASTM E112", "Hall-Petch denklemi",
    "grain size", "kesitsel yöntem", "Jeffries planimetrik",
    "tane inceltme", "anormal tane büyümesi",
    "Nb mikroalaşım", "Ti mikroalaşım", "IF steel grain size",
    "HSLA grain refinement"
  ],
  alternates: { canonical: "/knowledge/grain-size-hall-petch" },
  openGraph: {
    title: "Tane Boyutu ve Hall-Petch — Mukavemet, Tokluk, Mikroyapı",
    description: "ASTM E112 ölçüm yöntemleri ve Hall-Petch ile mekanik özellik ilişkisi.",
    type: "article",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          techArticleLd({
            headline: "Tane Boyutu ve Hall-Petch İlişkisi — ASTM E112",
            path: "/knowledge/grain-size-hall-petch",
            description:
              "ASTM E112 tane boyutu ölçümü, Hall-Petch denklemi ve tane inceltme mekanizmaları.",
            keywords: ["tane boyutu", "grain size", "Hall-Petch", "ASTM E112"],
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Bilgi Tabanı", path: "/knowledge" },
            { name: "Tane Boyutu ve Hall-Petch", path: "/knowledge/grain-size-hall-petch" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
