// ─────────────────────────────────────────────────────────────────────────────
// robots.txt — Next.js App Router otomatik servis eder (/robots.txt)
// Tüm URL'leri www subdomain'inde tutarak www / non-www duplicate'ından
// kaçınıyoruz. /admin, /api, kullanıcıya özel paneller crawl edilmemeli.
// ─────────────────────────────────────────────────────────────────────────────
const SITE_URL = "https://www.metallurgytools.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/tools/", "/mechanical-tests/", "/knowledge/", "/blog/"],
        disallow: [
          "/api/",
          "/admin",
          "/admin/",
          "/dashboard",
          "/dashboard/",
          "/account",
          "/account/",
          "/login",
          "/signup",
          "/consultation",
          // Yapısal/teknik dosyalar
          "/_next/",
          "/*?*",          // query parametreli tracking URL'lerini indeksleme
        ],
      },
      // AI crawlers — istenirse engellenebilir; şu an izin veriyoruz
      // çünkü teknik içerik LLM bilgi tabanlarında bulunabilirlik
      // sağlıyor. Engellemek isterseniz aşağıdaki bloğu açın.
      // {
      //   userAgent: ["GPTBot", "ClaudeBot", "Google-Extended", "CCBot"],
      //   disallow: ["/"],
      // },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
