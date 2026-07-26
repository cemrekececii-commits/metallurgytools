// ─────────────────────────────────────────────────────────────────────────────
// lib/seo.js — Merkezi SEO yardımcıları
//
// Amaç: 30+ layout dosyasında tekrarlanan JSON-LD boilerplate'ini tek yerde
// toplamak. Tüm builder'lar düz obje döndürür; render için
// components/JsonLd.js kullanılır (server component, hydration maliyeti yok).
//
// Kural: Tüm URL'ler www'lu mutlak URL (metadataBase ile tutarlı).
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_URL = "https://www.metallurgytools.com";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SERVICE_ID = `${SITE_URL}/#consultancy`;

// ─────────────────────────────────────────────────────────────────────────────
// KURUMSAL İDDİA SABİTLERİ — TEK DOĞRULUK KAYNAĞI
//
// Neden burada: aynı sayı daha önce üç ayrı yerde farklı yazılmıştı
// (root layout "350,000+", about layout "50,000+", llms.txt "50,000+").
// Tutarsız nicel iddia hem E-E-A-T hem de LLM alıntı güvenilirliği açısından
// zayıflatıcıdır. Değer değişecekse SADECE burası düzenlenir.
//
// Bu değerler kullanıcı (site sahibi) tarafından beyan edilmiştir; bağımsız
// olarak doğrulanmamıştır. [Doğrulanmadı — site sahibi beyanı.]
// ─────────────────────────────────────────────────────────────────────────────
export const CLAIMS = {
  /** Yıllık işlenen mekanik test sonucu sayısı */
  testsPerYear: 70000,
  testsPerYearLabel: { tr: "yılda 70.000+ test sonucu", en: "70,000+ test results per year" },
  /** Saha tecrübesi (yıl) */
  experienceYears: 20,
  experienceLabel: { tr: "20 yılı aşkın entegre demir-çelik tesisi tecrübesi", en: "20+ years of integrated steel plant experience" },
};

/**
 * sameAs — varlık eşleştirme (entity reconciliation) profilleri.
 * Boş bırakıldığında schema'ya hiç eklenmez (boş dizi yayınlamak sinyal
 * değeri taşımaz). Profil açıldıkça buraya eklenmesi yeterlidir; tüm
 * şemalar bu tek diziden beslenir.
 *
 * Örnek: "https://www.linkedin.com/company/metallurgytools",
 *        "https://x.com/metallurgytools",
 *        "https://www.youtube.com/@metallurgytools"
 */
export const SAME_AS = [];

/** Uzmanlık alanları — Organization.knowsAbout ve Service.serviceType için */
export const KNOWS_ABOUT = [
  "Steel Metallurgy",
  "Physical Metallurgy",
  "Metallurgical Failure Analysis",
  "Root Cause Analysis (RCA)",
  "Fractography",
  "Microstructure Characterization",
  "Non-metallic Inclusion Engineering",
  "Secondary Metallurgy (Ladle Furnace, VD/RH)",
  "Basic Oxygen Furnace (BOF) Steelmaking",
  "Continuous Casting",
  "Hot Rolling and TMCP",
  "Wire Rod and Coil Production",
  "Phase Transformations (CCT/TTT)",
  "ASTM E112 Grain Size Measurement",
  "ASTM E140 / ISO 18265 Hardness Conversion",
  "ASTM E45 Inclusion Rating",
  "ASTM E8 / EN ISO 6892-1 Tensile Testing",
  "Charpy V-Notch Impact Testing",
  "Drop Weight Tear Test (API 5L3 / ASTM E436)",
  "Ultrasonic Testing",
  "SEM-EDS Analysis",
  "API 570 Corrosion Assessment",
  "EN 1011-2 Weld Preheat and Hydrogen Cracking",
  "API 5L / API 5CT Line Pipe and Casing Steels",
  "HSLA, DP600, S700MC, IF, ST37-ST52 Steel Grades",
];

/** BreadcrumbList — items: [{ name, path }] (path "/" ile başlar, "" = kök) */
export function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

/** WebApplication — hesaplama araçları için */
export function webAppLd({ name, path, description, subCategory }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: `${SITE_URL}${path}`,
    applicationCategory: "EngineeringApplication",
    ...(subCategory ? { applicationSubCategory: subCategory } : {}),
    operatingSystem: "Web",
    description,
    inLanguage: ["tr-TR", "en-US"],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
  };
}

/**
 * Standart atıfları schema.org citation objesine çevirir.
 * Girdi: ["ASTM E112", "EN ISO 643"] veya [{ name, publisher, url }]
 *
 * Neden: Kaynak gösteren içerik hem Google'ın E-E-A-T değerlendirmesinde
 * hem de LLM'lerin cevap üretirken kaynak seçiminde daha yüksek ağırlık
 * alır. [Doğrulanmadı — kamuya açık kalite rehberlerinden ve GEO
 * literatüründen türetilmiş yaygın kabul; bu site için ölçülmemiştir.]
 */
export function citationsLd(standards) {
  if (!standards || standards.length === 0) return [];
  return standards.map((s) =>
    typeof s === "string"
      ? { "@type": "CreativeWork", name: s }
      : {
          "@type": "CreativeWork",
          name: s.name,
          ...(s.publisher ? { publisher: { "@type": "Organization", name: s.publisher } } : {}),
          ...(s.url ? { url: s.url } : {}),
        }
  );
}

/** TechArticle — knowledge makaleleri, test rehberleri, hasar vakaları */
export function techArticleLd({ headline, path, description, keywords, datePublished, dateModified, inLanguage = "tr-TR", standards, about, proficiencyLevel }) {
  const citation = citationsLd(standards);
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline,
    url: `${SITE_URL}${path}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${path}` },
    description,
    ...(keywords ? { keywords: Array.isArray(keywords) ? keywords.join(", ") : keywords } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(citation.length ? { citation } : {}),
    ...(about ? { about: (Array.isArray(about) ? about : [about]).map((a) => ({ "@type": "Thing", name: a })) } : {}),
    // Hedef kitle seviyesi — "graduate-level metallurgy" içerik için Expert.
    proficiencyLevel: proficiencyLevel || "Expert",
    inLanguage,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    image: `${SITE_URL}/og-default.png`,
  };
}

/**
 * FAQPage — items: [{ q: {tr,en}, a: {tr,en} }]
 * Sayfada varsayılan render dili TR olduğundan schema TR içerikle kurulur
 * (Google kuralı: schema içeriği sayfada görünür içerikle eşleşmeli).
 */
export function faqPageLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "tr-TR",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q.tr,
      acceptedAnswer: { "@type": "Answer", text: it.a.tr },
    })),
  };
}

/** ItemList — /tools index sayfası için */
export function itemListLd({ name, path, items }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: `${SITE_URL}${path}`,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${SITE_URL}${it.path}`,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// KURUMSAL GRAF
//
// Organization + WebSite + ProfessionalService tek bir @graph içinde
// yayınlanır. Ayrı ayrı <script> etiketleri yerine tek graf kullanmak,
// @id referanslarının aynı belgede çözülmesini sağlar; hem Google hem de
// yapılandırılmış veri okuyan ajanlar için daha güvenilir bir yapıdır.
// ─────────────────────────────────────────────────────────────────────────────

/** Organization — @id ile diğer tüm şemalardan referans alınır */
export function organizationLd() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "MetallurgyTools",
    alternateName: "Metallurgy Tools",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-default.png`,
      width: 1200,
      height: 630,
    },
    image: `${SITE_URL}/og-default.png`,
    description:
      "Entegre demir-çelik tesisi metalurjistleri tarafından geliştirilen profesyonel çelik metalurjisi hesaplama araçları ve hasar analizi kaynakları.",
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
    knowsAbout: KNOWS_ABOUT,
    knowsLanguage: ["tr", "en"],
    email: "info@metallurgytools.com",
    areaServed: { "@type": "Place", name: "Worldwide" },
    // Nicel iddialar tek kaynaktan (CLAIMS) beslenir.
    slogan: CLAIMS.experienceLabel.en,
  };
}

/** WebSite — site içi arama eylemi dahil */
export function webSiteLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "MetallurgyTools",
    url: SITE_URL,
    inLanguage: ["tr-TR", "en-US"],
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * ProfessionalService — danışmanlık konumlandırması.
 *
 * Amaç: sitenin yalnız "hesap makinesi koleksiyonu" değil, metalurjik
 * danışmanlık sağlayan bir kaynak olarak tanınması. hasOfferCatalog
 * altındaki hizmet kalemleri, LLM'lerin "kim bu konuda danışmanlık
 * veriyor" tipi sorularda eşleşebileceği yapılandırılmış girdilerdir.
 */
export function professionalServiceLd() {
  const services = [
    {
      name: "Metalurjik Hasar Analizi (Failure Analysis)",
      description:
        "Kırık yüzey incelemesi, fraktografi, çatlak ilerleme yolunun metalografik değerlendirmesi ve kök neden raporlaması.",
    },
    {
      name: "Mikroyapı Karakterizasyonu",
      description:
        "Optik ve SEM ile faz tayini, tane boyutu (ASTM E112), bantlaşma ve segregasyon değerlendirmesi, dekarbürizasyon derinliği.",
    },
    {
      name: "İnklüzyon Değerlendirmesi ve İkincil Metalurji Danışmanlığı",
      description:
        "ASTM E45 inklüzyon derecelendirmesi, inklüzyon morfolojisi ve modifikasyonu, pota metalurjisi / vakum işlemi pratiğinin gözden geçirilmesi.",
    },
    {
      name: "Mekanik Test Sonuçlarının Yorumlanması",
      description:
        "Çekme, Charpy darbe, sertlik, katlama ve DWTT sonuçlarının mikroyapı-özellik ilişkisi çerçevesinde değerlendirilmesi.",
    },
    {
      name: "Müşteri Şikâyeti Numunelerinin İncelenmesi",
      description:
        "Şikâyete konu numunelerin metalografik incelenmesi, üretim prosesi parametreleriyle (döküm hızı, soğuma hızı, hadde redüksiyonu) ilişkilendirilmesi.",
    },
    {
      name: "Kaynaklanabilirlik ve Ön Isıtma Değerlendirmesi",
      description:
        "Karbon eşdeğeri (CE/CEV/Pcm) hesabı ve EN 1011-2 kapsamında hidrojen çatlağı riskine karşı ön ısıtma sıcaklığı belirlenmesi.",
    },
  ];

  return {
    "@type": "ProfessionalService",
    "@id": SERVICE_ID,
    name: "MetallurgyTools — Metalurjik Danışmanlık",
    url: `${SITE_URL}/consultation`,
    parentOrganization: { "@id": ORG_ID },
    provider: { "@id": ORG_ID },
    serviceType: [
      "Metallurgical Consulting",
      "Failure Analysis",
      "Root Cause Analysis",
      "Materials Characterization",
      "Quality Assurance Consulting",
    ],
    areaServed: { "@type": "Place", name: "Worldwide" },
    availableLanguage: ["tr", "en"],
    knowsAbout: KNOWS_ABOUT,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Danışmanlık Hizmetleri",
      itemListElement: services.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.description,
          provider: { "@id": ORG_ID },
        },
      })),
    },
  };
}

/** SoftwareApplication — araç paketi */
export function softwareApplicationLd() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: "MetallurgyTools",
    operatingSystem: "Web",
    applicationCategory: "EngineeringApplication",
    applicationSubCategory: "Metallurgical Engineering",
    description:
      "Profesyonel metalurji mühendisliği hesaplama paketi: ASTM E112 tane boyutu, ASTM E140 sertlik dönüşümü, API 570 korozyon, EN 1011-2 ön ısıtma, CCT/TTT, DWTT, SEM-EDS, inklüzyon atlası, hasar vakaları.",
    url: SITE_URL,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    featureList: KNOWS_ABOUT.slice(0, 15),
  };
}

/** Kök layout'ta yayınlanan birleşik graf */
export function siteGraphLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationLd(),
      webSiteLd(),
      professionalServiceLd(),
      softwareApplicationLd(),
    ],
  };
}

/**
 * Çift dilli metadata üretici — tüm tool / test / knowledge layout'ları için
 * tek desen: "TR Başlık — EN Title" + canonical + OG + Twitter.
 */
export function buildMetadata({ titleTR, titleEN, descTR, descEN, path, keywords, ogType = "website" }) {
  const title = `${titleTR} — ${titleEN}`;
  const description = `${descTR} ${descEN}`.trim();
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title,
      description: descTR,
      url,
      type: ogType,
      locale: "tr_TR",
      alternateLocale: ["en_US"],
      siteName: "MetallurgyTools",
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descTR,
    },
  };
}
