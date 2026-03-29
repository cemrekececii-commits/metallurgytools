// app/(public)/mechanical-tests/page.tsx
// Ücretsiz erişim - auth gerektirmez

import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mekanik Test Rehberi | MetallurgyTools",
  description:
    "Çekme testi, darbe testi, sertlik ölçümü, katlama testi, DWTT ve basma testi hakkında kapsamlı mühendislik rehberleri. ASTM, EN ISO standartları ve metalürjik yorumlama.",
};

const tests = [
  {
    id: 1,
    slug: "cekme-testi",
    title: "Çekme Testi",
    titleEn: "Tensile Test",
    icon: "↕",
    standards: ["ASTM E8/E8M", "EN ISO 6892-1"],
    summary:
      "Akma dayanımı, çekme dayanımı, uzama ve kesit daralması belirlenir. Mühendislik–gerçek gerilme dönüşümü ve n, r değerleri.",
    tags: ["Rp0.2", "Rm", "A%", "Z%", "n-değeri"],
    color: "from-blue-900 to-blue-800",
    accent: "#3B82F6",
  },
  {
    id: 2,
    slug: "darbe-testi",
    title: "Darbe Testi",
    titleEn: "Charpy Impact Test",
    icon: "⚡",
    standards: ["ISO 148-1", "ASTM E23"],
    summary:
      "Kırılma geçiş sıcaklığı (DBTT), üst plato enerjisi ve kırık yüzeyi analizi. Tane boyutu ve mikroalaşım elementi etkisi.",
    tags: ["DBTT", "USE", "% Shear", "CVN"],
    color: "from-orange-900 to-orange-800",
    accent: "#F97316",
  },
  {
    id: 3,
    slug: "sertlik-olcumu",
    title: "Sertlik Ölçümü",
    titleEn: "Hardness Testing",
    icon: "◈",
    standards: ["ASTM E10", "ASTM E18", "ASTM E92", "ISO 18265"],
    summary:
      "Vickers, Brinell ve Rockwell yöntemleri. UTS–sertlik korelasyonu, HAZ haritalama ve dönüşüm tabloları.",
    tags: ["HV", "HBW", "HRC", "HV0.1"],
    color: "from-slate-800 to-slate-700",
    accent: "#94A3B8",
  },
  {
    id: 4,
    slug: "katlama-egme-testi",
    title: "Katlama / Eğme Testi",
    titleEn: "Bend Test",
    icon: "⌒",
    standards: ["EN ISO 7438", "ASTM E290"],
    summary:
      "Kılavuzlu eğme, mandrel çapı/kalınlık oranı seçimi ve yüzey çatlak değerlendirmesi. Kaynak yeterliliği uygulamaları.",
    tags: ["d/t Oranı", "180°", "ASME IX"],
    color: "from-emerald-900 to-emerald-800",
    accent: "#10B981",
  },
  {
    id: 5,
    slug: "dwtt",
    title: "DWTT Testi",
    titleEn: "Drop Weight Tear Test",
    icon: "▼",
    standards: ["API 5L Annex G", "ASTM E436"],
    summary:
      "Boru hattı çeliklerinde kırılma yayılımı kontrolü. ≥%85 kesme yüzeyi kriteri, tasarım sıcaklığı ve çentik geometrisi etkisi.",
    tags: ["% Shear Area", "SAT", "Pipeline", "X65/X70"],
    color: "from-red-900 to-red-800",
    accent: "#EF4444",
  },
  {
    id: 6,
    slug: "basma-testi",
    title: "Basma Testi",
    titleEn: "Compression Test",
    icon: "⬛",
    standards: ["ASTM E9", "EN ISO 604"],
    summary:
      "Akma gerilmesi ölçümü, fıçılaşma düzeltmesi ve sürtünme etkisi. Hadde takviyesi için akış gerilmesi eğrileri.",
    tags: ["σ_flow", "Barreling", "Reibung", "Gleeble"],
    color: "from-purple-900 to-purple-800",
    accent: "#A855F7",
  },
];

export default function MechanicalTestsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.08)_0%,_transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-6 py-20 relative">
          <p className="text-blue-400 text-sm font-mono tracking-widest uppercase mb-4">
            Mechanical Testing Guide
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Mekanik Test <span className="text-blue-400">Rehberi</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            ASTM ve EN ISO standartları çerçevesinde altı temel mekanik test yönteminin
            metalürjik temelleri, numune geometrisi, test prosedürü ve sonuç yorumlaması.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-mono text-gray-500">
            <span className="border border-gray-700 rounded px-2 py-1">ASTM E8/E8M</span>
            <span className="border border-gray-700 rounded px-2 py-1">ISO 148-1</span>
            <span className="border border-gray-700 rounded px-2 py-1">ASTM E10/E18/E92</span>
            <span className="border border-gray-700 rounded px-2 py-1">API 5L Annex G</span>
            <span className="border border-gray-700 rounded px-2 py-1">EN ISO 7438</span>
          </div>
        </div>
      </section>

      {/* Test Cards Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <Link
              key={test.id}
              href={`/mechanical-tests/${test.slug}`}
              className="group relative rounded-2xl border border-gray-800 bg-gray-900 p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Subtle gradient overlay on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(ellipse at top left, ${test.accent}10 0%, transparent 60%)`,
                }}
              />

              <div className="relative">
                {/* Icon + Number */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl" style={{ color: test.accent }}>
                    {test.icon}
                  </span>
                  <span className="text-xs font-mono text-gray-600">
                    {String(test.id).padStart(2, "0")}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-white mb-1">{test.title}</h2>
                <p className="text-xs font-mono text-gray-500 mb-3">{test.titleEn}</p>

                {/* Standards */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {test.standards.map((std) => (
                    <span
                      key={std}
                      className="text-xs font-mono px-2 py-0.5 rounded border"
                      style={{
                        borderColor: test.accent + "40",
                        color: test.accent,
                        backgroundColor: test.accent + "10",
                      }}
                    >
                      {std}
                    </span>
                  ))}
                </div>

                {/* Summary */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{test.summary}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {test.tags.map((tag) => (
                    <span key={tag} className="text-xs text-gray-600 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="mt-5 flex items-center text-xs font-mono text-gray-600 group-hover:text-gray-300 transition-colors">
                  <span>Detaylı incele</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <section className="border-t border-gray-800 max-w-6xl mx-auto px-6 py-8">
        <p className="text-xs text-gray-600 font-mono text-center">
          Tüm içerikler ücretsiz erişime açıktır · MetallurgyTools · metallurgytools.com
        </p>
      </section>
    </main>
  );
}
