import { readBlogs } from "@/lib/blogStorage";

// ─────────────────────────────────────────────────────────────────────────────
// Blog post için dinamik metadata.
// page.js "use client" olduğundan client tarafında metadata export edemez.
// Server-side bu layout, slug'a göre KV'den post'u çekip OG/Twitter/title/
// description'ı render-time'da set eder. Sosyal medya kartları ve Google
// SERP başlıkları artık her post için özel olacak.
// ─────────────────────────────────────────────────────────────────────────────

const SITE_URL = "https://www.metallurgytools.com";

export async function generateMetadata({ params }) {
  try {
    const { slug } = params;
    const blogs = await readBlogs();
    const post = blogs.find((b) => b.slug === slug && b.status === "published");

    if (!post) {
      return {
        title: "Makale bulunamadı",
        robots: { index: false, follow: true },
      };
    }

    // Türkçe öncelikli, fallback İngilizce
    const tr = post.tr || {};
    const en = post.en || {};
    const title = tr.title || en.title || slug;
    const summary = tr.summary || en.summary || "";
    const description = summary.slice(0, 300);
    const url = `${SITE_URL}/blog/${slug}`;
    const cover = post.coverImage && /^https?:\/\//.test(post.coverImage)
      ? post.coverImage
      : `${SITE_URL}/og-default.png`;

    return {
      title,
      description,
      keywords: post.tags || [],
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: "article",
        publishedTime: post.date,
        images: [{ url: cover, width: 1200, height: 630, alt: title }],
        locale: "tr_TR",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [cover],
      },
    };
  } catch (e) {
    return { title: "MetallurgyTools Blog" };
  }
}

export default function BlogPostLayout({ children }) {
  return children;
}
