"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

const LABELS = {
  tr: { heading: "Son Teknik Makaleler", all: "Tümü →", viewAll: "Tüm Makaleleri Gör", ago: (d) => `${d}g önce`, today: "Bugün", months: (m) => `${m}ay önce` },
  en: { heading: "Latest Technical Articles", all: "All →", viewAll: "View All Articles", ago: (d) => `${d}d ago`, today: "Today", months: (m) => `${m}mo ago` },
  zh: { heading: "最新技术文章", all: "全部 →", viewAll: "查看所有文章", ago: (d) => `${d}天前`, today: "今天", months: (m) => `${m}个月前` },
  ja: { heading: "最新技術記事", all: "すべて →", viewAll: "全記事を見る", ago: (d) => `${d}日前`, today: "今日", months: (m) => `${m}ヶ月前` },
};

function timeAgo(iso, lang) {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = (Date.now() - d) / 1000;
  const lbl = LABELS[lang] || LABELS.en;
  if (diff < 86400) return lbl.today;
  const days = Math.floor(diff / 86400);
  if (days < 30) return lbl.ago(days);
  return lbl.months(Math.floor(days / 30));
}

export default function BlogSidebar() {
  const { lang } = useLang();
  const lbl = LABELS[lang] || LABELS.en;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`/api/blog?lang=${lang}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(
            data
              .filter(p => p.status === "published")
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
          );
        }
      })
      .catch(() => {});
  }, [lang]);

  if (posts.length === 0) return null;

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-mono font-bold text-gold-400 uppercase tracking-widest">
          {lbl.heading}
        </h3>
        <Link href="/blog" className="text-[11px] text-dark-400 hover:text-gold-400 transition-colors no-underline">
          {lbl.all}
        </Link>
      </div>

      {/* Posts */}
      <div className="space-y-0.5">
        {posts.map((post, i) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block group no-underline"
          >
            <div className="flex gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors">
              <span className="text-[11px] font-mono text-gold-400/50 mt-0.5 w-4 shrink-0 select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-dark-200 group-hover:text-dark-50 transition-colors leading-snug line-clamp-2 font-medium">
                  {post.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {post.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 rounded-full bg-gold-400/[0.07] text-gold-400/70 text-[10px] font-mono">
                      {tag}
                    </span>
                  ))}
                  <span className="text-[10px] text-dark-500">{timeAgo(post.date, lang)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-4 pt-4 border-t border-white/[0.06]">
        <Link
          href="/blog"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-white/10 text-dark-300 hover:text-gold-400 hover:border-gold-400/30 text-[12px] font-medium transition-all no-underline"
        >
          <span>📝</span>
          {lbl.viewAll}
        </Link>
      </div>
    </aside>
  );
}
