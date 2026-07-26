// ─────────────────────────────────────────────────────────────────────────────
// robots.txt — Next.js App Router otomatik servis eder (/robots.txt)
//
// Politika:
//   • Tüm URL'ler www subdomain'inde (www / non-www duplicate'ından kaçınma)
//   • /admin, /api, /dashboard, /account → genel arama motorları için disallow
//   • AI tarayıcıları (GPTBot, ClaudeBot, Google-Extended, PerplexityBot,
//     CCBot, anthropic-ai, Bytespider, Diffbot, Amazonbot, Applebot-Extended,
//     ChatGPT-User, Bingbot, OAI-SearchBot) → EXPLICIT ALLOW.
//     Sebep: Teknik içeriğin LLM bilgi tabanlarında ve AI Overviews'da
//     bulunabilir olması, uzmanlık görünürlüğü ve marka erişimi açısından
//     stratejik tercih edilmiştir.
//   • AI tarayıcılarına da admin/api yolları kapalıdır (PII koruması).
// ─────────────────────────────────────────────────────────────────────────────
const SITE_URL = "https://www.metallurgytools.com";

// Hassas yollar (her kullanıcı/bot için)
// NOT: /_next/ ve /*?* KASITLI OLARAK KALDIRILDI.
//   • /_next/ → Next.js JS/CSS chunk'ları buradan servis edilir. Disallow
//     edilirse Googlebot client-component sayfalarını RENDER EDEMEZ (38 sayfa
//     "use client"). Google resmi rehberi: JS/CSS kaynaklarını engellemeyin.
//   • /*?* → tüm query-parametreli URL'leri engelliyordu; bu, JSON-LD
//     SearchAction hedefi /blog?search= dahil meşru sayfaları da kapatıyordu.
//     Duplicate kontrolü canonical etiketleriyle yapılır, robots disallow ile değil.
const SENSITIVE_DISALLOW = [
  "/api/",
  "/admin",
  "/admin/",
  "/dashboard",
  "/dashboard/",
  "/account",
  "/account/",
  "/login",
  "/signup",
  // NOT: /consultation KASITLI OLARAK KALDIRILDI.
  //   Danışmanlık hizmetlerini tanıtan tek genel sayfa burasıdır ve kimlik
  //   doğrulaması gerektirmez. Disallow altında kaldığında hem Google hem de
  //   LLM tarayıcıları hizmet kapsamını göremiyordu; ayrıca JSON-LD
  //   ProfessionalService şemasının url alanı taranamayan bir hedefi
  //   gösteriyordu. Form gönderimi POST /api/consultation üzerinden yapılır
  //   ve /api/ zaten disallow listesindedir (rate-limit ayrıca lib/rateLimit.js).
];

// AI / LLM tarayıcıları — explicit allow (admin hariç).
// Kaynaklar: darkvisitors.com, ahrefs.com/blog/ai-bots, openai.com/gptbot,
// anthropic.com/claudebot, perplexity.ai/perplexitybot. [Unverified — UA
// listeleri sağlayıcılar tarafından zaman zaman güncellenir.]
const AI_BOTS = [
  // OpenAI
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  // Google
  "Google-Extended",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Common Crawl (LLM training corpus)
  "CCBot",
  // ByteDance / TikTok
  "Bytespider",
  // Diffbot (knowledge graph)
  "Diffbot",
  // Amazon
  "Amazonbot",
  // Apple
  "Applebot",
  "Applebot-Extended",
  // Microsoft Copilot / Bing
  "Bingbot",
  // Meta
  "FacebookBot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  // You.com
  "YouBot",
  // Cohere
  "cohere-ai",
  // Mistral
  "MistralAI-User",
];

export default function robots() {
  return {
    rules: [
      // ① Genel arama motorları + tüm diğer botlar
      {
        userAgent: "*",
        allow: ["/", "/tools/", "/mechanical-tests/", "/knowledge/", "/blog/", "/consultation"],
        disallow: SENSITIVE_DISALLOW,
      },
      // ② AI tarayıcıları — explicit allow (içerik LLM bilgi tabanlarına geçsin)
      {
        userAgent: AI_BOTS,
        allow: [
          "/",
          "/tools/",
          "/mechanical-tests/",
          "/knowledge/",
          "/blog/",
          "/about",
          "/methodology",
          "/consultation",
          // LLM korpus dosyaları ve Markdown ayna URL'leri
          "/llms.txt",
          "/llms-full.txt",
        ],
        disallow: SENSITIVE_DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
