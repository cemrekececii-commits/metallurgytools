export const metadata = {
  title: "Metallurgy Blog — Steel Production, Failure Analysis & Mechanical Testing",
  description:
    "Metalurji mühendisliği, çelik üretimi (BOF, sürekli döküm, haddeleme), hasar analizi, mekanik test ve mikroyapı karakterizasyonu üzerine derinlemesine teknik makaleler. API, HSLA, DP600, S700MC, IF, ST37-ST52 çelikleri.",
  keywords: [
    "metalurji blogu", "çelik üretimi", "hasar analizi blog",
    "wire rod hatalar", "bobin defects", "kütük çatlağı",
    "metallurgy blog", "steel failure analysis", "DP600", "S700MC", "API 5L"
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "MetallurgyTools Blog — Teknik Makaleler",
    description: "Metalurji mühendisliği, çelik üretimi, hasar analizi ve mekanik test konularında derinlemesine teknik içerikler.",
    type: "website",
  },
};

export default function BlogLayout({ children }) {
  return children;
}
