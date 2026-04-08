export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/login", "/signup"],
      },
    ],
    sitemap: "https://metallurgytools.com/sitemap.xml",
    host: "https://metallurgytools.com",
  };
}
