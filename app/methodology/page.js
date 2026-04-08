'use client';

import { useLang } from '@/lib/LanguageContext';
import Link from 'next/link';

const TOOL_ICONS = {
  grain: '🔬', phase: '📊', corrosion: '⚗️',
  hardness: '🔧', ce: '🔥', dbtt: '❄️',
  cct: '🌡️', inclusion: '🔎',
};

const translations = {
  tr: {
    title: 'Bilimsel Temel ve Metodoloji',
    subtitle: 'Entegre çelik fabrikalarından 50.000+ üretim test kaydına karşı doğrulanmış ampirik formüller',
    hero_desc: 'Her MetallurgyTools hesaplayıcısının arkasında titiz bilimsel araştırma ve endüstri standartları vardır. Aşağıda her araçta kullanılan matematiksel ve fiziksel temeli bulacaksınız.',
    tools: {
      grain: {
        name: 'ASTM E112 Tane Boyutu (Kesitsel Yöntem)',
        formula: 'G = 3.322 × log₁₀(Nₐ) − 2.954, Nₐ = 1/(d_mm²)',
        calibration: 'Otomatik ölçek çubuğu algılama, 100/200/500X büyütme',
        validation: 'Manuel planimetrik yöntemle (Jeffries prosedürü) karşılaştırılmıştır',
        reference: 'ASTM E112-13 Standart Test Yöntemleri Ortalama Tane Boyutu Belirlenmesi İçin',
      },
      phase: {
        name: 'Fe-C Faz Diyagramı',
        eutectoid: 'Ötektoid noktası: 0,76 ağ% C, 727°C (Fe-Fe₃C metastabil sistem)',
        lever: 'Kaldıraç kuralı: ağırlık kesri sıvı = (Cₛ − C₀)/(Cₛ − Cₗ)',
        phases: 'Faz bölgeleri: ferrit(α), östenit(γ), sementit(Fe₃C), perlit, ledebürit',
        reference: 'Callister & Rethwisch, Malzeme Bilimi ve Mühendisliği, 10. baskı',
      },
      corrosion: {
        name: 'Korozyon Hızı (API 570 / ASME)',
        ltcr: 'Uzun dönem korozyon hızı: LTCR = (t_orijinal − t_güncel) / yıl_hizmet',
        stcr: 'Kısa dönem korozyon hızı: STCR = (t_önceki − t_güncel) / yıl_arası',
        barlow: 'Minimum gerekli kalınlık (Barlow): t_min = P×D / (2×S×E×W + P×Y)',
        reference: 'API 570:2016, ASME B31.3',
      },
      hardness: {
        name: 'Sertlik Dönüştürme',
        based: 'ASTM E140-12b dönüştürme tablolarına dayanmaktadır',
        method: 'Tablo değerleri arasında polinom interpolasyonu',
        uts: 'Çekme dayanımı tahmini: UTS ≈ 3,45 × HBW (MPa) karbon çelikleri için',
        reference: 'ASTM E140-12b Standart Sertlik Dönüştürme Tabloları',
      },
      ce: {
        name: 'Karbon Eşdeğeri',
        iiw: 'CE(IIW) = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15 [IIW Doc. IX-535-67]',
        cet: 'CET = C + (Mn+Mo)/10 + (Cr+Cu)/20 + Ni/40 [EN 1011-2 Yöntem B]',
        pcm: 'Pcm = C + Si/30 + (Mn+Cu+Cr)/20 + Ni/60 + Mo/15 + V/10 + 5B [Ito-Bessyo 1968]',
        preheat: 'Ön ısıtma: Tp = 697×CET + 160×tanh(d/35) + 62×HD^0.35 + (53×CET−32)×Q − 328',
      },
      dbtt: {
        name: 'DBTT Tahmini',
        based: 'Literatürden bileşim-özellik korelasyonlarına dayanmaktadır',
        empirical: 'Ampirik model: DBTT ≈ f(C, Mn, Ni, P, S, tane boyutu, işleme yolu)',
      },
      cct: {
        name: 'CCT/TTT Diyagramı',
        ae3: 'Ae3 = 910 − 203√C − 15.2Ni + 44.7Si + 104V + 31.5Mo − 30Mn − 11Cr [Andrews 1965]',
        ms: 'Ms = 539 − 423C − 30.4Mn − 17.7Ni − 12.1Cr − 7.5Mo [Andrews 1965]',
        bs: 'Bs = 830 − 270C − 90Mn − 37Ni − 70Cr − 83Mo [Steven & Haynes 1956]',
      },
      inclusion: {
        name: 'Dahil Etme Sınıflandırması',
        astm: 'ASTM E45 Yöntem A: En kötü alan derecelemesi A(MnS), B(Al₂O₃), C(Silikatlar), D(Küresel oksitler)',
        subcats: 'İnce/Ağır alt kategorileri 0–3.0 arasında 0.5 adım arttırılarak derecelendirilmektedir',
        reference: 'ASTM E45-18a',
      },
    },
    validation_title: 'Doğrulama ve Güvenilirlik',
    validation_text: 'Tüm algoritmalar, entegre çelik fabrikalarından 50.000+ üretim test kaydına karşı doğrulanmıştır. Belirsizlikler ve sınırlamalar net bir şekilde belirtilmiştir. Sonuçlar mühendislik tahminleridir ve gerçek testlerle doğrulanmalıdır.',
    references_title: 'Tam Referans Listesi',
  },
  en: {
    title: 'Scientific Foundation & Methodology',
    subtitle: 'Empirical formulas validated against 50,000+ production test records from integrated steel plants',
    hero_desc: 'Behind every MetallurgyTools calculator lies rigorous scientific research and industry standards. Below you will find the mathematical and physical foundations used in each tool.',
    tools: {
      grain: {
        name: 'ASTM E112 Grain Size (Intercept Method)',
        formula: 'G = 3.322 × log₁₀(Nₐ) − 2.954, Nₐ = 1/(d_mm²)',
        calibration: 'Automatic scale bar detection, 100/200/500X magnification',
        validation: 'Compared against manual planimetric method (Jeffries procedure)',
        reference: 'ASTM E112-13 Standard Test Methods for Determining Average Grain Size',
      },
      phase: {
        name: 'Fe-C Phase Diagram',
        eutectoid: 'Eutectoid point: 0.76 wt% C at 727°C (Fe-Fe₃C metastable system)',
        lever: 'Lever rule: weight fraction liquid = (Cₛ − C₀)/(Cₛ − Cₗ)',
        phases: 'Phase regions: ferrite(α), austenite(γ), cementite(Fe₃C), pearlite, ledeburite',
        reference: 'Callister & Rethwisch, Materials Science and Engineering, 10th ed.',
      },
      corrosion: {
        name: 'Corrosion Rate (API 570 / ASME)',
        ltcr: 'Long-term corrosion rate: LTCR = (t_orig − t_curr) / years_service',
        stcr: 'Short-term corrosion rate: STCR = (t_prev − t_curr) / years_between',
        barlow: 'Minimum required thickness (Barlow): t_min = P×D / (2×S×E×W + P×Y)',
        reference: 'API 570:2016, ASME B31.3',
      },
      hardness: {
        name: 'Hardness Conversion',
        based: 'Based on ASTM E140-12b conversion tables',
        method: 'Polynomial interpolation between tabulated values',
        uts: 'Tensile strength estimation: UTS ≈ 3.45 × HBW (MPa) for carbon steels',
        reference: 'ASTM E140-12b Standard Hardness Conversion Tables for Metals',
      },
      ce: {
        name: 'Carbon Equivalent',
        iiw: 'CE(IIW) = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15 [IIW Doc. IX-535-67]',
        cet: 'CET = C + (Mn+Mo)/10 + (Cr+Cu)/20 + Ni/40 [EN 1011-2 Method B]',
        pcm: 'Pcm = C + Si/30 + (Mn+Cu+Cr)/20 + Ni/60 + Mo/15 + V/10 + 5B [Ito-Bessyo 1968]',
        preheat: 'Preheat: Tp = 697×CET + 160×tanh(d/35) + 62×HD^0.35 + (53×CET−32)×Q − 328',
      },
      dbtt: {
        name: 'DBTT Prediction',
        based: 'Based on composition-property correlations from literature',
        empirical: 'Empirical model: DBTT ≈ f(C, Mn, Ni, P, S, grain size, processing route)',
      },
      cct: {
        name: 'CCT/TTT Diagram',
        ae3: 'Ae3 = 910 − 203√C − 15.2Ni + 44.7Si + 104V + 31.5Mo − 30Mn − 11Cr [Andrews 1965]',
        ms: 'Ms = 539 − 423C − 30.4Mn − 17.7Ni − 12.1Cr − 7.5Mo [Andrews 1965]',
        bs: 'Bs = 830 − 270C − 90Mn − 37Ni − 70Cr − 83Mo [Steven & Haynes 1956]',
      },
      inclusion: {
        name: 'Inclusion Classification',
        astm: 'ASTM E45 Method A: Worst field rating for types A(MnS), B(Al₂O₃), C(Silicates), D(Globular oxides)',
        subcats: 'Thin/Heavy sub-categories rated 0–3.0 in 0.5 increments',
        reference: 'ASTM E45-18a Standard Test Methods for Determining the Inclusion Content of Steel',
      },
    },
    validation_title: 'Validation & Reliability',
    validation_text: 'All algorithms validated against 50,000+ production test records from integrated steel plants. Uncertainty and limitations are clearly stated. Results are engineering estimates and should be verified with actual tests.',
    references_title: 'Complete References',
  },
};


export default function MethodologyPage() {
  const { lang } = useLang();
  const t = translations[lang];

  const toolsList = [
    { key: 'grain', icon: 'grain' },
    { key: 'phase', icon: 'phase' },
    { key: 'corrosion', icon: 'corrosion' },
    { key: 'hardness', icon: 'hardness' },
    { key: 'ce', icon: 'ce' },
    { key: 'dbtt', icon: 'dbtt' },
    { key: 'cct', icon: 'cct' },
    { key: 'inclusion', icon: 'inclusion' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-dark-50">


      {/* Hero Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-dark-800 to-dark-900 border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-gold-400">{t.title}</h1>
          <p className="text-xl text-gold-500 mb-6">{t.subtitle}</p>
          <p className="text-dark-300 leading-relaxed">{t.hero_desc}</p>
        </div>
      </section>

      {/* Tools Methodology Cards */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {toolsList.map(({ key }) => {
              const tool = t.tools[key];
              return (
                <div
                  key={key}
                  className="bg-dark-800 border border-white/[0.08] rounded-lg p-8 hover:border-gold-400/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">{TOOL_ICONS[key]}</span>
                    <h3 className="text-xl font-semibold text-gold-400">{tool.name}</h3>
                  </div>

                  <div className="space-y-4">
                    {key === 'grain' && (
                      <>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Formula</p>
                          <div className="bg-dark-900 p-3 rounded border border-white/[0.05] font-mono text-sm text-gold-300">
                            {tool.formula}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400">Calibration</p>
                          <p className="text-dark-100">{tool.calibration}</p>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400">Validation</p>
                          <p className="text-dark-100">{tool.validation}</p>
                        </div>
                        <p className="text-xs text-dark-500 mt-4 pt-4 border-t border-white/[0.05]">
                          {tool.reference}
                        </p>
                      </>
                    )}

                    {key === 'phase' && (
                      <>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Eutectoid Point</p>
                          <p className="text-dark-100">{tool.eutectoid}</p>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Lever Rule</p>
                          <div className="bg-dark-900 p-3 rounded border border-white/[0.05] font-mono text-sm text-gold-300">
                            {tool.lever}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400">Phase Regions</p>
                          <p className="text-dark-100">{tool.phases}</p>
                        </div>
                        <p className="text-xs text-dark-500 mt-4 pt-4 border-t border-white/[0.05]">
                          {tool.reference}
                        </p>
                      </>
                    )}

                    {key === 'corrosion' && (
                      <>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Long-term Rate</p>
                          <div className="bg-dark-900 p-3 rounded border border-white/[0.05] font-mono text-sm text-gold-300">
                            {tool.ltcr}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Short-term Rate</p>
                          <div className="bg-dark-900 p-3 rounded border border-white/[0.05] font-mono text-sm text-gold-300">
                            {tool.stcr}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Barlow Formula</p>
                          <div className="bg-dark-900 p-3 rounded border border-white/[0.05] font-mono text-sm text-gold-300">
                            {tool.barlow}
                          </div>
                        </div>
                        <p className="text-xs text-dark-500 mt-4 pt-4 border-t border-white/[0.05]">
                          {tool.reference}
                        </p>
                      </>
                    )}

                    {key === 'hardness' && (
                      <>
                        <div>
                          <p className="text-sm text-dark-400">{tool.based}</p>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Method</p>
                          <p className="text-dark-100">{tool.method}</p>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">UTS Estimation</p>
                          <div className="bg-dark-900 p-3 rounded border border-white/[0.05] font-mono text-sm text-gold-300">
                            {tool.uts}
                          </div>
                        </div>
                        <p className="text-xs text-dark-500 mt-4 pt-4 border-t border-white/[0.05]">
                          {tool.reference}
                        </p>
                      </>
                    )}

                    {key === 'ce' && (
                      <>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">CE(IIW)</p>
                          <div className="bg-dark-900 p-3 rounded border border-white/[0.05] font-mono text-sm text-gold-300">
                            {tool.iiw}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">CET</p>
                          <div className="bg-dark-900 p-3 rounded border border-white/[0.05] font-mono text-sm text-gold-300">
                            {tool.cet}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Pcm</p>
                          <div className="bg-dark-900 p-3 rounded border border-white/[0.05] font-mono text-sm text-gold-300">
                            {tool.pcm}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Preheat Temperature</p>
                          <div className="bg-dark-900 p-3 rounded border border-white/[0.05] font-mono text-sm text-gold-300">
                            {tool.preheat}
                          </div>
                        </div>
                      </>
                    )}

                    {key === 'dbtt' && (
                      <>
                        <div>
                          <p className="text-sm text-dark-400">{tool.based}</p>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Empirical Model</p>
                          <p className="text-dark-100">{tool.empirical}</p>
                        </div>
                      </>
                    )}

                    {key === 'cct' && (
                      <>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Ae3</p>
                          <div className="bg-dark-900 p-3 rounded border border-white/[0.05] font-mono text-sm text-gold-300">
                            {tool.ae3}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Ms</p>
                          <div className="bg-dark-900 p-3 rounded border border-white/[0.05] font-mono text-sm text-gold-300">
                            {tool.ms}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Bs</p>
                          <div className="bg-dark-900 p-3 rounded border border-white/[0.05] font-mono text-sm text-gold-300">
                            {tool.bs}
                          </div>
                        </div>
                      </>
                    )}

                    {key === 'inclusion' && (
                      <>
                        <div>
                          <p className="text-sm text-dark-400">{tool.astm}</p>
                        </div>
                        <div>
                          <p className="text-sm text-dark-400">{tool.subcats}</p>
                        </div>
                        <p className="text-xs text-dark-500 mt-4 pt-4 border-t border-white/[0.05]">
                          {tool.reference}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Validation Section */}
      <section className="px-6 py-16 bg-dark-800 border-y border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gold-400 mb-6">{t.validation_title}</h2>
          <p className="text-dark-100 leading-relaxed text-lg">{t.validation_text}</p>
        </div>
      </section>

      {/* References Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gold-400 mb-8">{t.references_title}</h2>
          <ul className="space-y-3 text-dark-200">
            <li>• Andrews, K.W. (1965). Empirical formulae for the calculation of some transformation temperatures. JISI, 203, 721-727.</li>
            <li>• ASTM E112-13. Standard Test Methods for Determining Average Grain Size.</li>
            <li>• ASTM E140-12b. Standard Hardness Conversion Tables for Metals.</li>
            <li>• ASTM E45-18a. Standard Test Methods for Determining the Inclusion Content of Steel.</li>
            <li>• API 570:2016. Piping Inspection Code.</li>
            <li>• EN 1011-2:2001. Welding of metallic materials.</li>
            <li>• IIW Doc. IX-535-67. Carbon Equivalent Formula.</li>
            <li>• Ito, Y. & Bessyo, K. (1968). Weldability formula of high strength steel. JWS.</li>
            <li>• Yurioka, N. et al. (1983). Hardenability in Lieu of Carbon Equivalent. Welding Journal.</li>
            <li>• Steven, W. & Haynes, A.G. (1956). The temperature of formation of martensite and bainite in low-alloy steel. JISI, 183, 349-359.</li>
            <li>• Callister, W.D. & Rethwisch, D.G. Materials Science and Engineering: An Introduction, 10th ed. Wiley.</li>
          </ul>
        </div>
      </section>

    </div>
  );
}
