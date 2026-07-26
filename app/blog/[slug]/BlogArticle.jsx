"use client";
// ─────────────────────────────────────────────────────────────────────────────
// BlogArticle — blog detay sayfasının interaktif katmanı.
//
// Değişiklik gerekçesi (SSR/GEO):
//   Önceden tüm sayfa "use client" idi ve gövde useEffect içinde
//   /api/blog/[slug] üzerinden çekiliyordu. Bu durumda ilk HTML'de makale
//   metni bulunmuyordu. JS çalıştırmayan tarayıcı/ajanlar (LLM crawler'ları,
//   bazı sosyal önizleme botları) içeriği hiç görmüyordu.
//
//   Artık post ve related sunucuda hazırlanıp prop olarak geliyor
//   (initialPost / initialRelated / initialLang). Kullanıcı dili
//   değiştirirse eski davranış korunur: ilgili dil için API'den yeniden
//   çekilir. Görsel çıktı ve etkileşimler birebir aynıdır.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { parseMarkdown } from "@/lib/blogView";

function formatDate(iso, lang) {
  if (!iso) return "";
  const d = new Date(iso);
  const locale = lang === "tr" ? "tr-TR" : lang === "zh" ? "zh-CN" : lang === "ja" ? "ja-JP" : "en-GB";
  return d.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" });
}

const UI = {
  tr: { readMin: "dk okuma", share: "Paylaş", copyLink: "Linki Kopyala", copied: "Kopyalandı!", related: "İlgili Makaleler", allPosts: "Tüm makaleler", notFound: "Makale bulunamadı.", home: "Ana Sayfa", fallbackNote: "Bu içerik Türkçe olarak hazırlanmıştır." },
  en: { readMin: "min read", share: "Share", copyLink: "Copy Link", copied: "Copied!", related: "Related Articles", allPosts: "All articles", notFound: "Article not found.", home: "Home", fallbackNote: "This content is available in Turkish." },
  zh: { readMin: "分钟阅读", share: "分享", copyLink: "复制链接", copied: "已复制！", related: "相关文章", allPosts: "所有文章", notFound: "文章未找到。", home: "首页", fallbackNote: "本内容以土耳其语提供。" },
  ja: { readMin: "分で読む", share: "シェア", copyLink: "リンクをコピー", copied: "コピーしました！", related: "関連記事", allPosts: "すべての記事", notFound: "記事が見つかりません。", home: "ホーム", fallbackNote: "このコンテンツはトルコ語で提供されています。" },
};

export default function BlogArticle({ initialPost, initialRelated = [], initialLang = "tr" }) {
  const { lang } = useLang();
  const ui = UI[lang] || UI.en;

  const [post, setPost] = useState(initialPost);
  const [related, setRelated] = useState(initialRelated);
  const [copied, setCopied] = useState(false);

  const slug = initialPost?.slug;

  // Dil değişimi → sadece o zaman client fetch. İlk render sunucudan gelir.
  useEffect(() => {
    if (!slug || lang === initialLang) return;
    let cancelled = false;

    fetch(`/api/blog/${slug}?lang=${lang}`)
      .then((r) => { if (!r.ok) throw new Error("not found"); return r.json(); })
      .then((data) => { if (!cancelled) setPost(data); })
      .catch(() => {});

    fetch(`/api/blog?lang=${lang}`)
      .then((r) => r.json())
      .then((all) => {
        if (cancelled || !Array.isArray(all)) return;
        const curTags = initialPost?.tags || [];
        const sorted = all
          .filter((p) => p.slug !== slug)
          .sort((a, b) => {
            const aM = (a.tags || []).filter((t) => curTags.includes(t)).length;
            const bM = (b.tags || []).filter((t) => curTags.includes(t)).length;
            return bM - aM;
          });
        setRelated(sorted.slice(0, 3));
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [slug, lang, initialLang, initialPost]);

  const handleShare = (platform) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (platform === "copy") {
      navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title || "")}&url=${encodeURIComponent(url)}`);
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
    }
  };

  if (!post) return (
    <main className="min-h-screen pt-28 flex flex-col items-center justify-center gap-4 text-dark-300">
      <span className="text-5xl">404</span>
      <p>{ui.notFound}</p>
      <Link href="/blog" className="text-gold-400 hover:underline no-underline">← {ui.allPosts}</Link>
    </main>
  );

  return (
    <>
      <main className="min-h-screen pt-20 pb-20">
        {/* Cover */}
        {post.coverImage && (
          <div className="w-full h-48 sm:h-72 overflow-hidden relative">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" style={{ opacity: 0.45 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-dark-400 mt-6 mb-6">
            <Link href="/" className="hover:text-gold-400 no-underline text-dark-400">{ui.home}</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-gold-400 no-underline text-dark-400">Blog</Link>
            <span>/</span>
            <span className="text-dark-200 truncate max-w-[200px]">{post.title}</span>
          </div>

          {/* Fallback language notice */}
          {post.lang && post.lang !== lang && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{ui.fallbackNote}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-50 leading-tight mb-4">{post.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-dark-400 mb-4">
            <span>{formatDate(post.date, lang)}</span>
            <span>·</span>
            <span>{post.readingTime} {ui.readMin}</span>
            {post.tags?.slice(0, 3).map(tag => (
              <Link
                key={tag}
                href={`/blog?lang=${lang}&tag=${encodeURIComponent(tag)}`}
                className="px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 text-[11px] font-mono font-semibold no-underline hover:bg-gold-400/20 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Summary */}
          {post.summary && (
            <div className="border-l-2 border-gold-400 pl-4 mb-8 text-dark-300 italic text-sm leading-relaxed">
              {post.summary}
            </div>
          )}

          {/* Content */}
          <article className="blog-content" dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }} />

          {/* Share */}
          <div className="mt-10 pt-8 border-t border-white/[0.07]">
            <p className="text-xs text-dark-400 uppercase tracking-widest font-mono mb-3">{ui.share}</p>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => handleShare("copy")} className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-dark-300 hover:text-dark-50 text-xs cursor-pointer font-sans transition-colors">
                {copied ? ui.copied : ui.copyLink}
              </button>
              <button onClick={() => handleShare("twitter")} className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-dark-300 hover:text-dark-50 text-xs cursor-pointer font-sans transition-colors">
                Twitter / X
              </button>
              <button onClick={() => handleShare("linkedin")} className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-dark-300 hover:text-dark-50 text-xs cursor-pointer font-sans transition-colors">
                LinkedIn
              </button>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-dark-50 mb-4">{ui.related}</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map(rel => (
                  <Link key={rel.id} href={`/blog/${rel.slug}?lang=${lang}`} className="no-underline group">
                    <div className="bg-dark-800/60 border border-white/[0.07] rounded-lg overflow-hidden hover:border-gold-400/20 transition-all">
                      {rel.coverImage && (
                        <img src={rel.coverImage} alt={rel.title} className="w-full h-28 object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                      )}
                      <div className="p-3">
                        <p className="text-sm font-medium text-dark-100 group-hover:text-gold-400 transition-colors line-clamp-2 leading-snug">{rel.title}</p>
                        <p className="text-[11px] text-dark-400 mt-1">{formatDate(rel.date, lang)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <Link href="/blog" className="text-sm text-dark-400 hover:text-gold-400 transition-colors no-underline">
              ← {ui.allPosts}
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        .blog-content { color: #c9d1d9; line-height: 1.8; font-size: 0.975rem; }
        .blog-h1 { font-size: 1.6rem; font-weight: 700; color: #f0f6fc; margin: 1.8rem 0 0.8rem; }
        .blog-h2 { font-size: 1.25rem; font-weight: 600; color: #e6edf3; margin: 1.6rem 0 0.6rem; padding-bottom: 0.4rem; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .blog-h3 { font-size: 1.05rem; font-weight: 600; color: #d2a935; margin: 1.4rem 0 0.5rem; }
        .blog-content p { margin: 0.75rem 0; }
        .blog-ul, .blog-ol { padding-left: 1.5rem; margin: 0.75rem 0; }
        .blog-ul li, .blog-ol li { margin: 0.3rem 0; }
        .blog-code { background: #0d1117; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem 1.2rem; overflow-x: auto; font-size: 0.85rem; line-height: 1.6; color: #e6edf3; font-family: 'JetBrains Mono', ui-monospace, monospace; margin: 1rem 0; }
        .blog-inline-code { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 0.1em 0.4em; font-size: 0.85em; font-family: ui-monospace, monospace; color: #d2a935; }
        .blog-blockquote { border-left: 3px solid #d2a935; padding-left: 1rem; margin: 1rem 0; color: #8b949e; font-style: italic; }
        .blog-table-wrap { overflow-x: auto; margin: 1rem 0; }
        .blog-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .blog-table th { background: rgba(210,169,53,0.08); color: #d2a935; font-weight: 600; text-align: left; padding: 0.5rem 0.75rem; border: 1px solid rgba(255,255,255,0.08); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; }
        .blog-table td { padding: 0.5rem 0.75rem; border: 1px solid rgba(255,255,255,0.07); color: #c9d1d9; }
        .blog-table tr:hover td { background: rgba(255,255,255,0.02); }
        .blog-content strong { color: #e6edf3; font-weight: 600; }
      `}</style>
    </>
  );
}
