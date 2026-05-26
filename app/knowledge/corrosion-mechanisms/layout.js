export const metadata = {
  title: "Korozyon Mekanizmaları ve Korozyon Hızı Hesabı — API 570, NACE",
  description:
    "Elektrokimyasal korozyon temelleri (anodik/katodik reaksiyonlar, Pourbaix diyagramı, Tafel ekstrapolasyonu), korozyon türleri (üniform, çukurcuk, galvanik, gerilim korozyonu çatlaması, MIC), API 570 uzun/kısa dönem korozyon hızı hesabı, Barlow formülü ile minimum gerekli kalınlık, koruma stratejileri.",
  keywords: [
    "elektrokimyasal korozyon", "korozyon hızı hesabı", "API 570",
    "Barlow formülü", "minimum gerekli kalınlık", "LTCR STCR",
    "korozyon türleri", "çukurcuk korozyonu", "gerilim korozyonu çatlaması",
    "MIC", "NACE", "katodik koruma", "corrosion mechanisms"
  ],
  alternates: { canonical: "/knowledge/corrosion-mechanisms" },
  openGraph: {
    title: "Korozyon Mekanizmaları ve Hız Hesabı",
    description: "Elektrokimyasal temeller, korozyon türleri, hız hesaplama ve koruma stratejileri.",
    type: "article",
  },
};

export default function Layout({ children }) {
  return children;
}
