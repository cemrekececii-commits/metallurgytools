"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

function formatDate(iso, lang) {
  if (!iso) return "";
  const d = new Date(iso);
  const locale = lang === "tr" ? "tr-TR" : lang === "zh" ? "zh-CN" : lang === "ja" ? "ja-JP" : "en-GB";
  return d.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" });
}

const UI = {
  tr: { heading: "Teknik Makaleler", desc: "Metalurji mühendisliği, çelik üretimi, hasar analizi ve mekanik test konularında derinlemesine teknik içerikler.", search: "Makale ara...", all: "Tümü", notFound: "Makale bulunamadı.", readMin: "dk okuma", home: "Ana Sayfa" },
  en: { heading: "Technical Articles", desc: "In-depth technical content on metallurgical engineering, steel production, failure analysis, and mechanical testing.", search: "Search articles...", all: "All", notFound: "No articles found.", readMin: "min read", home: "Home" },
  zh: { heading: "技术文章", desc: "金属冶金工程、钢铁生产、失效分析和力学测试的深度技术内容。", search: "搜索文章...", all: "全部", notFound: "未找到文章。", readMin: "分钟阅读", home: "首页" },
  ja: { heading: "技術記事", desc: "冶金工学、鉄鋼生産、破損分析、機械試験に関する詳細な技術コンテンツ。", search: "記事を検索...", all: "すべて", notFound: "記事が見つかりません。", readMin: "分で読む", home: "ホーム" },
};

export default function BlogListPage() {
  const { lang } = useLang();
  const ui = UI[lang] || UI.en;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/blog?lang=${lang}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
          const tags = [...new Set(data.flatMap(p => p.tags || []))].sort();
          setAllTags(tags);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lang]);

  const filtered = posts.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !search
      || p.title?.toLowerCase().includes(q)
      || p.summary?.toLowerCase().includes(q)
      || p.tags?.some(t => t.toLowerCase().includes(q));
    const matchTag = !activeTag || p.tags?.includes(activeTag);
    return matchSearch && matchTag;
  });

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-dark-400 mb-3">
          <Link href="/" className="hover:text-gold-400 transition-colors no-underline text-dark-400">{ui.home}</Link>
          <span>/</span>
          <span className="text-dark-200">Blog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-dark-50 mb-3">{ui.heading}</h1>
        <p className="text-dark-300 max-w-2xl">{ui.desc}</p>
      </div>

      {/* Search + Filter */}
      <div className="mb-8 flex flex-col gap-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={ui.search}
          className="w-full sm:w-96 px-4 py-2.5 rounded-lg bg-dark-700 border border-white/10 text-dark-50 placeholder-dark-400 focus:outline-none focus:border-gold-400/50 text-sm"
        />
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border font-sans ${
                activeTag === null
                  ? "bg-gold-400/10 border-gold-400/40 text-gold-400"
                  : "bg-white/[0.04] border-white/10 text-dark-300 hover:text-dark-100"
              }`}
            >
              {ui.all}
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border font-sans ${
                  activeTag === tag
                    ? "bg-gold-400/10 border-gold-400/40 text-gold-400"
                    : "bg-white/[0.04] border-white/10 text-dark-300 hover:text-dark-100"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Articles */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-dark-400">{ui.notFound}</div>
      ) : (
        <div className="space-y-6">
          {filtered.map(post => (
            <article
              key={post.id}
              className="group bg-dark-800/60 border border-white/[0.07] rounded-xl overflow-hidden hover:border-gold-400/20 transition-all duration-200"
            >
              <Link href={`/blog/${post.slug}?lang=${lang}`} className="no-underline flex flex-col sm:flex-row">
                {post.coverImage && (
                  <div className="sm:w-56 sm:shrink-0 h-44 sm:h-auto overflow-hidden bg-dark-700">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                      style={{ transition: "transform 0.4s ease, opacity 0.3s ease" }}
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    {/* Language badge if showing fallback */}
                    {post.lang && post.lang !== lang && (
                      <span className="inline-block mr-2 mb-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-mono">
                        {post.lang.toUpperCase()}
                      </span>
                    )}
                    {post.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="inline-block mr-1.5 mb-2 px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 text-[11px] font-mono font-semibold">
                        {tag}
                      </span>
                    ))}
                    <h2 className="text-lg font-semibold text-dark-50 group-hover:text-gold-400 transition-colors leading-snug mb-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-dark-300 leading-relaxed line-clamp-3">{post.summary}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-4 text-[12px] text-dark-400">
                    <span>{formatDate(post.date, lang)}</span>
                    <span>·</span>
                    <span>{post.readingTime} {ui.readMin}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
