// ─────────────────────────────────────────────────────────────────────────────
// lib/blogView.js — Saf (fs/kv bağımsız) blog görüntüleme yardımcıları.
//
// Neden ayrı dosya:
//   app/api/blog/[id]/route.js içindeki localizePost() sunucu route'una gömülü
//   olduğundan sayfa (server component) tarafından yeniden kullanılamıyordu.
//   Bu dosya aynı dönüşümü saf fonksiyon olarak sunar; hem server component
//   hem de ileride route tarafından import edilebilir. Davranış birebir aynı
//   tutulmuştur (alan adları, fallback sırası, hasTranslation haritası).
// ─────────────────────────────────────────────────────────────────────────────

export const SUPPORTED_LANGS = ["tr", "en", "zh", "ja"];

/** Çok dilli ham post kaydını tek dilli düz objeye indirger. */
export function localizePost(post, lang = "tr") {
  const useLang = SUPPORTED_LANGS.includes(lang) ? lang : "tr";
  const preferred = post[useLang] || {};
  const fallback = post["tr"] || {};
  return {
    id: post.id,
    slug: post.slug,
    coverImage: post.coverImage,
    tags: post.tags,
    status: post.status,
    date: post.date,
    readingTime: post.readingTime,
    title: preferred.title || fallback.title || "",
    summary: preferred.summary || fallback.summary || "",
    content: preferred.content || fallback.content || "",
    lang: preferred.title ? useLang : "tr",
    hasTranslation: SUPPORTED_LANGS.reduce((acc, l) => {
      acc[l] = !!(post[l]?.title);
      return acc;
    }, {}),
  };
}

/**
 * İlgili yazılar — etiket kesişimi sayısına göre sıralar.
 * Client tarafındaki mevcut mantıkla birebir aynı (bkz. eski useEffect).
 */
export function pickRelated(allLocalized, current, limit = 3) {
  if (!Array.isArray(allLocalized) || !current) return [];
  const curTags = current.tags || [];
  return allLocalized
    .filter((p) => p.slug !== current.slug)
    .sort((a, b) => {
      const aM = (a.tags || []).filter((t) => curTags.includes(t)).length;
      const bM = (b.tags || []).filter((t) => curTags.includes(t)).length;
      return bM - aM;
    })
    .slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────────────────
// Markdown → HTML
// Not: Bu fonksiyon daha önce yalnız client bileşeninde yaşıyordu; artık
// sunucuda da çalıştırılıyor (SSR HTML'de makale gövdesinin bulunması için).
// İçerik zaten API yazma yolunda stripTags() ile temizleniyor; burada da
// &, <, > kaçışı ilk adımda yapılır.
// ─────────────────────────────────────────────────────────────────────────────
export function parseMarkdown(md) {
  if (!md) return "";
  let html = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  html = html.replace(/```[\w]*\n([\s\S]*?)```/g, (_, code) =>
    `<pre class="blog-code"><code>${code.trimEnd()}</code></pre>`);

  html = html.replace(/(\|.+\|\n)+/g, (table) => {
    const rows = table.trim().split("\n");
    let out = '<div class="blog-table-wrap"><table class="blog-table">';
    rows.forEach((row, i) => {
      if (/^\|[-| ]+\|$/.test(row)) return;
      const cells = row.split("|").filter((_, ci) => ci > 0 && ci < row.split("|").length - 1);
      const tag = i === 0 ? "th" : "td";
      out += "<tr>" + cells.map((c) => `<${tag}>${c.trim()}</${tag}>`).join("") + "</tr>";
    });
    return out + "</table></div>";
  });

  html = html
    .replace(/^&gt; (.+)$/gm, '<blockquote class="blog-blockquote">$1</blockquote>')
    .replace(/^### (.+)$/gm, '<h3 class="blog-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="blog-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="blog-h1">$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>')
    .replace(/((?:^- .+\n?)+)/gm, (b) =>
      `<ul class="blog-ul">${b.trim().split("\n").map((l) => `<li>${l.replace(/^- /, "")}</li>`).join("")}</ul>`)
    .replace(/((?:^\d+\. .+\n?)+)/gm, (b) =>
      `<ol class="blog-ol">${b.trim().split("\n").map((l) => `<li>${l.replace(/^\d+\. /, "")}</li>`).join("")}</ol>`)
    .replace(/^(?!<[huo]|<pre|<bloc|<div|<table|<tr|<th|<td)(.+)$/gm, "<p>$1</p>")
    .replace(/\n{3,}/g, "\n\n");

  return html;
}

/**
 * Markdown'ı düz metne indirger — llms-full.txt ve .md ayna route'ları için
 * değil, meta description / özet kırpma gibi yerlerde kullanılır.
 */
export function markdownToPlainText(md, maxLen = 0) {
  if (!md) return "";
  const text = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*`_|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return maxLen > 0 ? text.slice(0, maxLen) : text;
}
