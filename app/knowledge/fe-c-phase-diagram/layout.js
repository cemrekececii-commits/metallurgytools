import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@/lib/seo";

export const metadata = {
  title: "Fe-C Faz Diyagramı: Ötektoid Reaksiyon, Faz Bölgeleri, Kaldıraç Kuralı",
  description:
    "Demir-sementit (Fe-Fe₃C) denge diyagramının kapsamlı analizi: ötektoid noktası (0.76 %C, 727°C), ferrit (α), östenit (γ), sementit (Fe₃C), perlit ve ledebürit bölgeleri, A1/A3/Acm kritik sıcaklıkları, kaldıraç kuralı ile faz fraksiyonu hesabı ve soğuma yolu analizi.",
  keywords: [
    "Fe-C faz diyagramı", "demir karbon diyagramı", "Fe-Fe3C",
    "ötektoid reaksiyon", "ötektoid çelik", "hipoötektoid", "hiperötektoid",
    "ferrit östenit sementit", "perlit", "kaldıraç kuralı",
    "A1 A3 Acm", "iron carbon phase diagram", "eutectoid"
  ],
  alternates: { canonical: "/knowledge/fe-c-phase-diagram" },
  openGraph: {
    title: "Fe-C Faz Diyagramı — Kapsamlı Mühendislik Rehberi",
    description: "Ötektoid reaksiyon, faz bölgeleri, kaldıraç kuralı ve soğuma yolu analizi.",
    type: "article",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          techArticleLd({
            headline: "Fe-C Faz Diyagramı: Ötektoid Reaksiyon, Faz Bölgeleri, Kaldıraç Kuralı",
            path: "/knowledge/fe-c-phase-diagram",
            description:
              "Fe-Fe₃C denge diyagramı: ötektoid nokta, ferrit/östenit/sementit bölgeleri, A1/A3/Acm sıcaklıkları ve kaldıraç kuralı.",
            keywords: ["Fe-C faz diyagramı", "iron carbon diagram", "ötektoid", "kaldıraç kuralı"],
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Bilgi Tabanı", path: "/knowledge" },
            { name: "Fe-C Faz Diyagramı", path: "/knowledge/fe-c-phase-diagram" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
