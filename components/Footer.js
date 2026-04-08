"use client";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

const TR = {
  whyLabel: "Neden MetallurgyTools?",
  whyTitle: "Deneyim, Saha Verisi\nve İstatistiksel Analiz",
  whyDesc:
    "Entegre demir-çelik tesisinde 18 yılı aşkın saha çalışması, 50.000'i aşkın mekanik test sonucu ve sistematik veri incelemelerine dayanan istatistik temelli deney tasarımı yaklaşımıyla geliştirilmiştir.",

  methLabel: "Metodoloji",
  methItems: [
    "Her hesaplama yöntemi saha test verileri ve literatürle çapraz doğrulanmıştır",
    "Ampirik korelasyonlar (Pickering-Gladman, Hollomon, Mintz) gerçek üretim koşullarında istatistiksel olarak sınanmıştır",
    "Standart yorumlamaları ASTM, EN ISO, API ve VDA belgelerine sadık kalınarak hazırlanmıştır",
    "Ölçüm belirsizliği ve hata analizi ISO/IEC 17025 çerçevesinde değerlendirilmiştir",
  ],

  expertLabel: "Uzmanlık Alanları",

  disclaimer:
    "Bu platformdaki hesaplama araçları ve bilgi içerikleri mühendislik rehberliği amacıyla sunulmaktadır. Kritik tasarım ve güvenlik kararlarında güncel standartlara ve yetkili mühendislik değerlendirmesine başvurulması zorunludur. Tüm ampirik korelasyonlar belirtilen geçerlilik aralıklarında kullanılmalıdır.",
  disclaimerLabel: "Önemli Not:",

  tagline: "Uzman Metalurji Ekibi tarafından geliştirilmiştir",
  rights: "Tüm hakları saklıdır",

  links: [
    { href: "/mechanical-tests", label: "Mekanik Testler" },
    { href: "/knowledge",        label: "Bilgi Bankası"   },
    { href: "/tools",            label: "Araçlar"         },
    { href: "/pricing",          label: "Fiyatlandırma"   },
  ],
};

const EN = {
  whyLabel: "Why MetallurgyTools?",
  whyTitle: "Experience, Field Data\nand Statistical Analysis",
  whyDesc:
    "Built on 18+ years of field work in an integrated steel plant, 50,000+ mechanical test results, and a statistically-based experimental design approach rooted in systematic data analysis.",

  methLabel: "Methodology",
  methItems: [
    "Every calculation method is cross-validated against field test data and peer-reviewed literature",
    "Empirical correlations (Pickering-Gladman, Hollomon, Mintz) statistically tested under real production conditions",
    "Standard interpretations prepared in strict accordance with ASTM, EN ISO, API and VDA documents",
    "Measurement uncertainty and error analysis evaluated within the ISO/IEC 17025 framework",
  ],

  expertLabel: "Areas of Expertise",

  disclaimer:
    "The calculation tools and content on this platform are provided for engineering guidance purposes. For critical design and safety decisions, reference to current standards and authorized engineering assessment is mandatory. All empirical correlations must be used within their stated validity ranges.",
  disclaimerLabel: "Important Note:",

  tagline: "Developed by Expert Metallurgy Team",
  rights: "All rights reserved",

  links: [
    { href: "/mechanical-tests", label: "Mechanical Tests" },
    { href: "/knowledge",        label: "Knowledge Base"   },
    { href: "/tools",            label: "Tools"            },
    { href: "/pricing",          label: "Pricing"          },
  ],
};

const TAGS = [
  "S315MC–S700MC", "DP600", "API X42–X80", "IF Steel",
  "DD11–DD14", "Armour Steel", "Wire Rod", "BOF/Continuous Casting",
  "TMCP Rolling", "Charpy/DWTT", "SEM-EDS", "UT Level 2",
];

export default function Footer() {
  const { lang } = useLang();
  const t = lang === "tr" ? TR : EN;

  return (
    <footer className="bg-dark-900 border-t border-white/[0.06]">

      {/* Görsel Şerit / Photo Strip */}
      <div className="relative h-52 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&auto=format&fit=crop&q=80"
          alt={lang === "tr" ? "Entegre demir-çelik tesisi" : "Integrated steel plant"}
          className="w-full h-full object-cover"
          style={{ opacity: 0.35 }}
        />
        {/* Overlay gradients */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(3,7,18,0.7) 0%,rgba(3,7,18,0.15) 40%,rgba(3,7,18,0.7) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(3,7,18,0.6) 0%,transparent 30%,transparent 70%,rgba(3,7,18,0.6) 100%)" }} />
        {/* Centered stat overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-12">
          {[
            { val: "18+", label: lang === "tr" ? "Yıl Saha Deneyimi" : "Years Field Experience" },
            { val: "50K+", label: lang === "tr" ? "Mekanik Test Verisi" : "Mechanical Test Records" },
            { val: "12+", label: lang === "tr" ? "Uluslararası Standart" : "International Standards" },
          ].map(({ val, label }) => (
            <div key={val} className="text-center">
              <div className="text-3xl font-bold font-mono text-gold-400 drop-shadow-lg">{val}</div>
              <div className="text-xs text-dark-50/80 mt-1 font-mono tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Güvenilirlik / Credibility */}
      <div className="bg-dark-800/60 border-b border-white/[0.06] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>

            {/* Kolon 1 — Neden / Why */}
            <div>
              <p className="text-gold-400 font-mono text-[11px] tracking-[0.1em] uppercase mb-3">
                {t.whyLabel}
              </p>
              <h3 className="text-dark-50 text-lg font-bold mb-3 leading-snug whitespace-pre-line">
                {t.whyTitle}
              </h3>
              <p className="text-dark-300 text-sm leading-relaxed">
                {t.whyDesc}
              </p>
            </div>

            {/* Kolon 2 — Metodoloji / Methodology */}
            <div>
              <p className="text-gold-400 font-mono text-[11px] tracking-[0.1em] uppercase mb-3">
                {t.methLabel}
              </p>
              <ul className="space-y-2 list-none p-0 m-0">
                {t.methItems.map((item, i) => (
                  <li key={i} className="flex gap-2 text-dark-300 text-[13px] leading-relaxed">
                    <span className="text-gold-400 mt-0.5 shrink-0">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolon 3 — Uzmanlık / Expertise */}
            <div>
              <p className="text-gold-400 font-mono text-[11px] tracking-[0.1em] uppercase mb-3">
                {t.expertLabel}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[11px] border border-gold-400/20 text-dark-300 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Sorumluluk Reddi / Disclaimer */}
          <div className="mt-8 px-5 py-4 bg-gold-400/[0.04] border border-gold-400/15 rounded-lg">
            <p className="text-dark-400 text-xs leading-relaxed m-0">
              <span className="text-gold-400 font-semibold">{t.disclaimerLabel} </span>
              {t.disclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* Alt çizgi / Bottom bar */}
      <div className="px-6 py-6 max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md flex items-center justify-center font-bold font-mono text-dark-800 text-sm"
               style={{ background: "linear-gradient(135deg, #d4af37, #b8962e)" }}>
            M
          </div>
          <span className="text-dark-400 text-[13px]">
            MetallurgyTools · {t.tagline}
          </span>
        </div>

        <div className="flex gap-5">
          {t.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-dark-400 text-xs font-mono no-underline hover:text-gold-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-dark-400/60 text-[11px] font-mono m-0">
          © {new Date().getFullYear()} MetallurgyTools · {t.rights}
        </p>
      </div>

    </footer>
  );
}
