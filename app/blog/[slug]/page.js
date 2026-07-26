// ─────────────────────────────────────────────────────────────────────────────
// app/blog/[slug]/page.js — SERVER COMPONENT
//
// Önceki durum: sayfa "use client" idi, makale gövdesi useEffect içinde
// /api/blog/[slug] çağrısıyla çekiliyordu → ilk HTML'de makale metni yoktu.
// JavaScript çalıştırmayan istemciler (LLM crawler'ları, bazı önizleme
// botları) yalnız boş kabuk görüyordu.
//
// Yeni durum: post + related sunucuda hazırlanır, HTML'e gömülür; etkileşimli
// katman BlogArticle.jsx (client) içinde kalır. Dil değiştirildiğinde eski
// fetch davranışı korunur. Görsel çıktı ve kullanıcı akışı değişmemiştir.
//
// JSON-LD de artık sunucuda üretiliyor (BlogPosting + BreadcrumbList),
// böylece yapılandırılmış veri render beklemeden okunabilir.
// ─────────────────────────────────────────────────────────────────────────────
import { readBlogs } from "@/lib/blogStorage";
import { localizePost, pickRelated, markdownToPlainText } from "@/lib/blogView";
import { SITE_URL, ORG_ID, WEBSITE_ID, breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import BlogArticle from "./BlogArticle";

export const dynamic = "force-dynamic";

// Sunucu tarafı varsayılan dil. LanguageContext istemcide TR ile başladığı
// için SSR çıktısı da TR olmalı (hydration uyuşmazlığını önler).
const SSR_LANG = "tr";

export default async function BlogDetailPage({ params }) {
  const { slug } = params;

  let post = null;
  let related = [];

  try {
    const blogs = await readBlogs();
    const published = blogs.filter((b) => b && b.status === "published");
    const raw = published.find((b) => b.slug === slug);

    if (raw) {
      post = localizePost(raw, SSR_LANG);
      related = pickRelated(
        published.map((b) => localizePost(b, SSR_LANG)),
        post,
        3
      );
    }
  } catch {
    // KV/FS erişilemezse client tarafı yine de /api/blog üzerinden dener.
    post = null;
  }

  const url = `${SITE_URL}/blog/${slug}`;

  const articleLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.summary || markdownToPlainText(post.content, 300),
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        datePublished: post.date,
        dateModified: post.date,
        ...(post.coverImage ? { image: post.coverImage } : { image: `${SITE_URL}/og-default.png` }),
        ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
        ...(post.readingTime ? { timeRequired: `PT${post.readingTime}M` } : {}),
        inLanguage: post.lang === "tr" ? "tr-TR" : post.lang,
        author: { "@id": ORG_ID },
        publisher: { "@id": ORG_ID },
        isPartOf: { "@id": WEBSITE_ID },
      }
    : null;

  const crumbLd = post
    ? breadcrumbLd([
        { name: "Ana Sayfa", path: "" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${slug}` },
      ])
    : null;

  return (
    <>
      {post && <JsonLd data={[articleLd, crumbLd]} />}
      <BlogArticle initialPost={post} initialRelated={related} initialLang={SSR_LANG} />
    </>
  );
}
