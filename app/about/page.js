'use client';

import { useLang } from '@/lib/LanguageContext';
import { useState } from 'react';

const TR = {
  title: 'Hakkımızda',
  subtitle: 'Entegre Demir-Çelik Tesislerinden Gelen Kolektif Mühendislik Deneyimi',
  expertTitle: 'Çok Disiplinli Metalurji Mühendisliği Topluluğu',
  expertYears: '20+ Yıl BOF & EAF Teknolojisi, Üretim Prosesleri ve Nihai Mamül Testlerinde Saha Deneyimi',
  expertDesc: 'MetallurgyTools; BOF ve EAF teknolojileriyle entegre demir-çelik tesislerinde yirmi yılı aşkın saha deneyimine sahip, üretim prosesleri ve nihai mamül testleri konularında uzmanlaşmış mühendislerin bir araya gelmesiyle oluşturulmuş bir kolektif çalışmanın ürünüdür. Platform; sürekli döküm, sıcak hadde, ikincil metalurji ve mekanik test laboratuvarlarından elde edilen gerçek proses verilerine dayandırılmıştır. Her hesaplama aracı, hakemli literatür ve uluslararası standartlarla çapraz doğrulanmış olup mühendislik pratiğinin gereksinimlerini karşılayacak biçimde tasarlanmıştır.',

  expertiseTitle: 'Kolektif Uzmanlık Alanları',
  expertiseItems: [
    'BOF & EAF çelik üretimi; ikincil metalurji ve pota fırını prosesleri',
    'Sürekli döküm (bloom, slab, billet); katılaşma ve segregasyon kontrolü',
    'Sıcak haddeleme: düz ürünler, kangal, tel çubuk, nervürlü çubuk',
    'Mekanik testler: çekme, Charpy darbe, DWTT, sertlik (Vickers/Brinell/Rockwell), bükme',
    'Hasar analizi & SEM-EDS mikroyapısal karakterizasyon',
    'Kalite kontrol sistemleri & API/ASTM/ISO/EN standart uygunluğu',
    'Özel çelikler: DP600, S700MC, API 5L/5CT, IF, HSLA, mikro alaşımlı çelikler'
  ],

  academicBg: 'Akademik & Kurumsal Altyapı',

  whyTitle: 'MetallurgyTools Neden Geliştirildi?',
  whyItems: [
    'Gerçek üretim kısıtlamalarını dikkate almayan, standart dışı jenerik hesaplama araçlarına duyulan mesleki ihtiyaçtan doğmuştur',
    'Her hesaplama modülü, entegre çelik tesislerinde yürütülen üretim denemeleri ve mekanik test verilerine karşı doğrulanmıştır',
    'Araçlar; hızlı veri girişi, saydam hesaplama mantığı ve uluslararası standart çıktısı sağlayacak biçimde, mühendislik iş akışları gözetilerek tasarlanmıştır'
  ],

  statsTitle: 'Platform İstatistikleri',
  stats: [
    { label: 'Profesyonel Mühendislik Aracı', value: '11' },
    { label: 'Referans Alınan Uluslararası Standartlar', value: 'ASTM / ISO / API / EN' },
    { label: 'Doğrulamada Kullanılan Test Veri Noktası', value: '50.000+' },
    { label: 'Dil Desteği', value: 'TR / EN / ZH / JA' }
  ],

  citationTitle: 'Araştırma ve Eğitimde Kullanım — Atıf Biçimi',
  citationText: 'MetallurgyTools Engineering Collective (2024). MetallurgyTools: Professional Metallurgical Engineering Calculation Platform. Available at: https://metallurgytools.com',
  copyCitation: 'Alıntıyı Kopyala',
  citationCopied: 'Kopyalandı!',

  validationTitle: 'Doğrulama Metodolojisi',
  validationItems: [
    'Her hesaplama modülü hakemli bilimsel literatüre ve uluslararası standartlara dayalıdır',
    'Uygulanabilir durumlarda ölçüm belirsizliği ve güven aralıkları belirtilmiştir',
    'Çıktılar mühendislik tahmini niteliğindedir; kritik uygulamalarda laboratuvar testleriyle doğrulanması esastır',
    'Veri izlenebilirliği ASTM, ISO, API ve EN standartları çerçevesinde sağlanmaktadır'
  ],

  researchTitle: 'Odak Alanları',
  researchItems: [
    'Çelik mikroyapı–mekanik özellik ilişkileri ve faz dönüşümü kinetiği',
    'İnklüzyon mühendisliği & ikincil metalurji optimizasyonu',
    'Kırılma mekaniği, DBTT ve düşük sıcaklık tokluğu',
    'Korozyon direnci değerlendirmesi ve servis uygunluk analizi',
    'Kaynaklanabilirlik & ısıdan etkilenen bölge (HAZ) karakterizasyonu',
    'Faz dönüşümleri, CCT/TTT diyagramları ve ısıl işlem optimizasyonu'
  ],

  contactTitle: 'Geri Bildirim & İletişim',
  feedbackCTA: 'Geri Bildirim Formu',
  suggestTool: 'Yeni Araç Öner',
  linkedinProfile: 'LinkedIn Profili'
};

const EN = {
  title: 'About',
  subtitle: 'Collective Engineering Knowledge from Integrated Iron & Steel Operations',
  expertTitle: 'A Multidisciplinary Metallurgical Engineering Collective',
  expertYears: '20+ Years of Field Experience in BOF & EAF Steelmaking, Production Processes, and Mechanical Testing',
  expertDesc: 'MetallurgyTools is the product of a collaborative effort by metallurgical engineers with over two decades of hands-on experience in integrated iron and steel plants, specialising in BOF and EAF steelmaking technologies, production process control, and final product mechanical testing. The platform is grounded in real process data from continuous casting, hot rolling, secondary metallurgy, and mechanical test laboratories. Every calculation module has been cross-validated against peer-reviewed literature and international standards, and is designed to meet the practical demands of engineering workflow.',

  expertiseTitle: 'Collective Areas of Expertise',
  expertiseItems: [
    'BOF & EAF steelmaking; secondary metallurgy and ladle furnace refining',
    'Continuous casting (bloom, slab, billet); solidification and segregation control',
    'Hot rolling: flat products, wire rod, rebar, and section mills',
    'Mechanical testing: tensile, Charpy impact, DWTT, hardness (Vickers/Brinell/Rockwell), bend',
    'Failure analysis & SEM-EDS microstructural characterization',
    'Quality management systems & API/ASTM/ISO/EN standard compliance',
    'Advanced steels: DP600, S700MC, API 5L/5CT, IF, HSLA, and microalloyed grades'
  ],

  academicBg: 'Academic & Institutional Background',

  whyTitle: 'Why MetallurgyTools Was Developed',
  whyItems: [
    'Developed in response to a professional need for tools that reflect real production constraints, as opposed to generic calculators disconnected from industrial practice',
    'Every calculation module has been validated against production trial data and mechanical test results from integrated steel plants',
    'Tools are designed around engineering workflows: rapid data entry, transparent calculation logic, and internationally standardised outputs'
  ],

  statsTitle: 'Platform Statistics',
  stats: [
    { label: 'Professional Engineering Tools', value: '11' },
    { label: 'Referenced International Standards', value: 'ASTM / ISO / API / EN' },
    { label: 'Test Data Points Used in Validation', value: '50,000+' },
    { label: 'Language Support', value: 'TR / EN / ZH / JA' }
  ],

  citationTitle: 'Citation Format for Research and Academic Use',
  citationText: 'MetallurgyTools Engineering Collective (2024). MetallurgyTools: Professional Metallurgical Engineering Calculation Platform. Available at: https://metallurgytools.com',
  copyCitation: 'Copy Citation',
  citationCopied: 'Copied!',

  validationTitle: 'Validation Methodology',
  validationItems: [
    'Each calculation module is grounded in peer-reviewed scientific literature and international standards',
    'Measurement uncertainty and confidence intervals are stated where applicable',
    'Outputs represent engineering estimates; independent laboratory verification is required for critical applications',
    'Data traceability is maintained in accordance with ASTM, ISO, API, and EN frameworks'
  ],

  researchTitle: 'Technical Focus Areas',
  researchItems: [
    'Steel microstructure–mechanical property relationships and phase transformation kinetics',
    'Inclusion engineering & secondary metallurgy process optimisation',
    'Fracture mechanics, DBTT, and low-temperature toughness assessment',
    'Corrosion resistance evaluation and fitness-for-service analysis',
    'Weldability & heat-affected zone (HAZ) characterization',
    'Phase transformations, CCT/TTT diagrams, and heat treatment optimisation'
  ],

  contactTitle: 'Feedback & Contact',
  feedbackCTA: 'Feedback Form',
  suggestTool: 'Suggest a Tool',
  linkedinProfile: 'LinkedIn Profile'
};

export default function AboutPage() {
  const { lang } = useLang();
  const t = lang === 'tr' ? TR : EN;
  const [copied, setCopied] = useState(false);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(t.citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="border-b border-white/[0.08] bg-gradient-to-b from-dark-800 to-dark-900/50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-dark-50 mb-2">{t.title}</h1>
          <p className="text-lg text-gold-400">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Expert Profile */}
        <section className="mb-20">
          <div className="bg-dark-800 border border-white/[0.08] rounded-lg p-8 mb-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-dark-50 mb-1">{t.expertTitle}</h2>
                <p className="text-gold-400 font-medium mb-4">{t.expertYears}</p>
                <p className="text-dark-200 leading-relaxed">{t.expertDesc}</p>
              </div>
            </div>
          </div>

          {/* Expertise */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-dark-50 mb-4">{t.expertiseTitle}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {t.expertiseItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-dark-800/50 rounded border border-white/[0.08]">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0"></div>
                  <span className="text-dark-100">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-dark-800/40 border border-gold-400/20 rounded text-dark-200 text-sm">
            <span className="font-semibold text-gold-400">{t.academicBg}: </span>
            {lang === 'tr'
              ? 'Malzeme bilimi ve metalurji mühendisliği alanında lisans ve lisansüstü eğitim; BOF/EAF çelik üretimi, sürekli döküm, sıcak hadde operasyonları ve mekanik test metodolojileri konularında kapsamlı endüstriyel sertifikasyon.'
              : 'Undergraduate and postgraduate education in materials science and metallurgical engineering; extensive industrial certification in BOF/EAF steelmaking, continuous casting, hot rolling operations, and mechanical test methodologies.'}
          </div>
        </section>

        {/* Why MetallurgyTools */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-dark-50 mb-6">{t.whyTitle}</h2>
          <div className="space-y-4">
            {t.whyItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-dark-800/50 rounded border border-white/[0.08]">
                <div className="w-1 bg-gold-500 flex-shrink-0"></div>
                <p className="text-dark-100 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Statistics */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-dark-50 mb-6">{t.statsTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {t.stats.map((stat, idx) => (
              <div key={idx} className="bg-dark-800 border border-white/[0.08] rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-gold-400 mb-2">{stat.value}</div>
                <div className="text-dark-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Citation Box */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-gold-400/10 to-gold-500/5 border border-gold-400/30 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gold-400 mb-4">{t.citationTitle}</h2>
            <div className="bg-dark-900/50 border border-gold-400/20 rounded p-4 mb-4 font-mono text-sm text-dark-100 leading-relaxed">
              {t.citationText}
            </div>
            <button
              onClick={handleCopyCitation}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 hover:bg-gold-500/30 border border-gold-400/50 text-gold-400 rounded transition-colors"
            >
              {copied ? (
                <>
                  <span>✅</span>
                  {t.citationCopied}
                </>
              ) : (
                <>
                  <span>📋</span>
                  {t.copyCitation}
                </>
              )}
            </button>
          </div>
        </section>

        {/* Validation Philosophy */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-dark-50 mb-6">{t.validationTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {t.validationItems.map((item, idx) => (
              <div key={idx} className="p-4 bg-dark-800/50 border border-white/[0.08] rounded">
                <p className="text-dark-100 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Research Areas */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-dark-50 mb-6">{t.researchTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {t.researchItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-dark-800/50 rounded border border-white/[0.08]">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0"></div>
                <span className="text-dark-100 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact & Feedback */}
        <section className="border-t border-white/[0.08] pt-16 pb-8">
          <h2 className="text-2xl font-semibold text-dark-50 mb-8">{t.contactTitle}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <a
              href="/feedback"
              className="p-6 bg-dark-800 border border-white/[0.08] rounded-lg hover:border-gold-400/50 transition-colors text-center"
            >
              <div className="text-dark-50 font-semibold mb-2">{t.feedbackCTA}</div>
              <p className="text-dark-300 text-sm">
                {lang === 'tr' ? 'Teknik geri bildirim ve önerilerinizi iletin' : 'Submit technical feedback and suggestions'}
              </p>
            </a>
            <a
              href="/feedback?type=tool"
              className="p-6 bg-dark-800 border border-white/[0.08] rounded-lg hover:border-gold-400/50 transition-colors text-center"
            >
              <div className="text-dark-50 font-semibold mb-2">{t.suggestTool}</div>
              <p className="text-dark-300 text-sm">
                {lang === 'tr' ? 'Platforma yeni hesaplama modülü önerin' : 'Propose a new calculation module for the platform'}
              </p>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-dark-800 border border-white/[0.08] rounded-lg hover:border-gold-400/50 transition-colors text-center"
            >
              <div className="text-dark-50 font-semibold mb-2">{t.linkedinProfile}</div>
              <p className="text-dark-300 text-sm">
                {lang === 'tr' ? 'Profesyonel ağ için bağlantı kurun' : 'Connect with our engineering network'}
              </p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
