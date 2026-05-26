// ─────────────────────────────────────────────────────────────────────────────
// sitemap.xml — Next.js App Router otomatik servis eder.
// Tüm URL'leri www subdomain'inde tutuyoruz (robots ve metadataBase ile
// tutarlı olması Google için kritik).
//
// İçerik: ana sayfa + statik bilgi sayfaları + 16 hesaplama aracı +
// 6 mekanik test alt sayfası + 7 knowledge makalesi + blog ve
// hasar-vakalari listeleri.
//
// Blog post slug'ları ve hasar-vakalari slug'ları runtime'da
// `/api/blog` ve `data/hasarVakalari` üzerinden geliyor; bu sayfalar
// listede yer aldığı için Google kolayca link discovery yapar. Eğer
// statik export'ta dynamic sitemap istenirse generateMetadata + KV
// integration ekleyerek genişletilebilir.
// ─────────────────────────────────────────────────────────────────────────────
export default function sitemap() {
  const baseUrl = "https://www.metallurgytools.com";
  const lastModified = new Date();

  const staticPages = [
    { url: baseUrl,                                  changeFrequency: "weekly",  priority: 1.00 },
    { url: `${baseUrl}/about`,                       changeFrequency: "monthly", priority: 0.60 },
    { url: `${baseUrl}/pricing`,                     changeFrequency: "monthly", priority: 0.60 },
    { url: `${baseUrl}/methodology`,                 changeFrequency: "monthly", priority: 0.55 },
    { url: `${baseUrl}/knowledge`,                   changeFrequency: "weekly",  priority: 0.85 },
    { url: `${baseUrl}/mechanical-tests`,            changeFrequency: "weekly",  priority: 0.85 },
    { url: `${baseUrl}/blog`,                        changeFrequency: "daily",   priority: 0.80 },
  ];

  // ── Hesaplama araçları ──────────────────────────────────────────────────────
  const tools = [
    { slug: "hardness",         priority: 0.95 },
    { slug: "carbon-equivalent",priority: 0.95 },
    { slug: "grain-size",       priority: 0.95 },
    { slug: "phase-diagram",    priority: 0.90 },
    { slug: "cct-ttt",          priority: 0.90 },
    { slug: "preheat",          priority: 0.90 },
    { slug: "corrosion",        priority: 0.85 },
    { slug: "dbtt",             priority: 0.85 },
    { slug: "inclusion",        priority: 0.85 },
    { slug: "sem-eds",          priority: 0.85 },
    { slug: "unit-converter",   priority: 0.80 },
    { slug: "tensile-specimen", priority: 0.80 },
    { slug: "inclusion-atlas",  priority: 0.90 },
    { slug: "ultrasonic",       priority: 0.92 },
    { slug: "dwtt",             priority: 0.90 },
    { slug: "hasar-vakalari",   priority: 0.95 },
  ];

  const toolPages = tools.map(({ slug, priority }) => ({
    url: `${baseUrl}/tools/${slug}`,
    changeFrequency: "monthly",
    priority,
    lastModified,
  }));

  // ── Mekanik test rehberleri ────────────────────────────────────────────────
  const mechanicalTests = [
    "cekme-testi",       // tensile
    "darbe-testi",       // Charpy impact
    "sertlik-olcumu",    // hardness measurement
    "katlama-egme-testi",// bend
    "dwtt",              // drop-weight tear test
    "basma-testi",       // compression
  ];
  const mechanicalTestPages = mechanicalTests.map((slug) => ({
    url: `${baseUrl}/mechanical-tests/${slug}`,
    changeFrequency: "monthly",
    priority: 0.80,
    lastModified,
  }));

  // ── Knowledge makaleleri ───────────────────────────────────────────────────
  const knowledgeArticles = [
    "hardness-testing",
    "fe-c-phase-diagram",
    "steel-microstructures",
    "corrosion-mechanisms",
    "mechanical-testing",
    "grain-size-hall-petch",
  ];
  const knowledgePages = knowledgeArticles.map((slug) => ({
    url: `${baseUrl}/knowledge/${slug}`,
    changeFrequency: "monthly",
    priority: 0.85,
    lastModified,
  }));

  return [
    ...staticPages.map((p) => ({ ...p, lastModified })),
    ...toolPages,
    ...mechanicalTestPages,
    ...knowledgePages,
  ];
}
