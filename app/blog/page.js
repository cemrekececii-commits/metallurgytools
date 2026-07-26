// ─────────────────────────────────────────────────────────────────────────────
// app/blog/page.js — SERVER COMPONENT
//
// Liste artık sunucuda hazırlanıyor. Önceden tüm sayfa "use client" idi ve
// yazılar useEffect içinde /api/blog'dan çekiliyordu → ilk HTML'de yalnız
// spinner vardı, hiçbir makale başlığı/özeti/linki yoktu. Bu, JS
// çalıştırmayan ajanlar için blog hub'ını tamamen görünmez kılıyordu ve
// tekil yazılara giden dahili link keşfini de engelliyordu.
//
// Etkileşim (arama kutusu, etiket filtresi, dil değişimi) BlogList.jsx
// içinde aynen korunmuştur.
// ─────────────────────────────────────────────────────────────────────────────
import { readBlogs } from "@/lib/blogStorage";
import { localizePost } from "@/lib/blogView";
import { SITE_URL, ORG_ID, WEBSITE_ID, breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import BlogList from "./BlogList";

export const dynamic = "force-dynamic";

const SSR_LANG = "tr";

export default async function BlogListPage() {
  let posts = [];
  try {
    const blogs = await readBlogs();
    posts = blogs
      .filter((b) => b && b.status === "published")
      .map((b) => localizePost(b, SSR_LANG))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch {
    posts = [];
  }

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    name: "MetallurgyTools — Teknik Makaleler",
    description:
      "Metalurji mühendisliği, çelik üretimi, hasar analizi ve mekanik test konularında derinlemesine teknik içerikler.",
    url: `${SITE_URL}/blog`,
    inLanguage: "tr-TR",
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    blogPost: posts.slice(0, 50).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date,
      ...(p.summary ? { description: p.summary } : {}),
      ...(p.tags?.length ? { keywords: p.tags.join(", ") } : {}),
      author: { "@id": ORG_ID },
    })),
  };

  const crumbLd = breadcrumbLd([
    { name: "Ana Sayfa", path: "" },
    { name: "Blog", path: "/blog" },
  ]);

  return (
    <>
      <JsonLd data={[blogLd, crumbLd]} />
      <BlogList initialPosts={posts} initialLang={SSR_LANG} />
    </>
  );
}
