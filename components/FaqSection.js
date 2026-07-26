"use client";
// ─────────────────────────────────────────────────────────────────────────────
// components/FaqSection.js — Görünür SSS bölümü (SEO)
//
// FAQPage JSON-LD layout'ta server-side inject edilir (lib/seo.js → faqPageLd).
// Bu component varsayılan dil TR ile SSR'lanır → sorular/cevaplar ilk HTML'de
// crawler'a görünür. Dil değişince client'ta EN'e döner (zh/ja → EN fallback).
// <details>/<summary> kullanımı: Google katlanmış içeriği indeksler.
// ─────────────────────────────────────────────────────────────────────────────
import { useLang } from "@/lib/LanguageContext";

export default function FaqSection({ items, title }) {
  const { lang } = useLang();
  const L = lang === "tr" ? "tr" : "en";
  const heading =
    title || (L === "tr" ? "Sıkça Sorulan Sorular" : "Frequently Asked Questions");

  if (!items?.length) return null;

  return (
    <section
      aria-label={heading}
      className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 pt-4"
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-dark-50 mb-1">
        {heading}
      </h2>
      <p className="text-sm text-dark-200 mb-5">
        {L === "tr"
          ? "Standart referanslı teknik cevaplar — mühendislik değerlendirmesinin yerini tutmaz."
          : "Technical answers with standard references — not a substitute for engineering judgment."}
      </p>
      <div className="space-y-2">
        {items.map((it, i) => (
          <details
            key={i}
            className="group rounded-lg border border-dark-600 bg-dark-700/60 open:bg-dark-700 transition-colors"
          >
            <summary className="cursor-pointer list-none px-4 py-3 flex items-start gap-3 text-dark-50 font-medium text-sm sm:text-base">
              <span className="text-gold-400 mt-0.5 shrink-0 transition-transform group-open:rotate-90">
                ▸
              </span>
              <span>{it.q[L]}</span>
            </summary>
            <div className="px-4 pb-4 pl-11 text-sm leading-relaxed text-dark-100">
              {it.a[L]}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
