// ─────────────────────────────────────────────────────────────────────────────
// /api/md/[...path] — Markdown ayna uç noktası
//
// next.config.js içindeki rewrite sayesinde şu URL'lerle erişilir:
//   /tools/hardness.md
//   /knowledge/steel-microstructures.md
//   /mechanical-tests/cekme-testi.md
//   /blog/<slug>.md
//   /tools/hasar-vakalari/<slug>.md
//
// Neden: JS çalıştırmayan ajanlar için sayfanın teknik özünün HTML gürültüsü
// olmadan, tek istekte alınabilmesi. Bu, dokümantasyon sitelerinde
// yaygınlaşan bir desendir. HTML sayfaları ve araçların çalışma biçimi
// değişmez; bu uç nokta yalnızca ek bir okuma yoludur.
// ─────────────────────────────────────────────────────────────────────────────
import { SITE_URL } from "@/lib/seo";
import { findDoc } from "@/lib/llmCorpus";
import { CASES, CATEGORIES } from "@/components/hasar/CaseData";
import { readBlogs } from "@/lib/blogStorage";
import { localizePost } from "@/lib/blogView";

export const dynamic = "force-dynamic";

const TXT_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  "X-Robots-Tag": "noindex, follow", // kanonik sürüm HTML sayfasıdır
};

function notFound() {
  return new Response("# 404\n\nBu yol için Markdown sürümü bulunmuyor.\n", {
    status: 404,
    headers: TXT_HEADERS,
  });
}

function caseMarkdown(c) {
  const cat = CATEGORIES[c.category];
  const bullets = (arr) => (arr?.length ? arr.map((x) => `- ${x}`).join("\n") : "_(kayıt yok)_");
  return `# ${c.tr}
_${c.en}_

- **Kanonik URL:** ${encodeURI(`${SITE_URL}/tools/hasar-vakalari/${c.slug}`)}
- **Ürün grubu:** ${cat ? `${cat.tr} / ${cat.en}` : c.category}
${c.sikayet ? `- **Şikâyet tipi:** ${c.sikayet}${c.sikayet_en ? ` / ${c.sikayet_en}` : ""}\n` : ""}${c.tags?.length ? `- **Etiketler:** ${c.tags.join(", ")}\n` : ""}
## Bulgular

${bullets(c.tespitler)}

## Kök neden değerlendirmesi

${bullets(c.nedenler)}

## Önleyici faaliyetler

${bullets(c.onleme)}
${c.kaynak ? `\n## Kaynak\n\n${c.kaynak}\n` : ""}
---
Kaynak: MetallurgyTools — ${SITE_URL}
`;
}

function docMarkdown(doc) {
  return `# ${doc.title}${doc.titleTR ? `\n_${doc.titleTR}_` : ""}

- **Kanonik URL:** ${SITE_URL}${doc.path}
${doc.standards?.length ? `- **İlgili standartlar:** ${doc.standards.join(", ")}\n` : ""}
## Teknik özet

${doc.abstract}

> Bu Markdown sürümü, sayfanın teknik özetidir. Etkileşimli hesaplama
> aracının kendisi kanonik URL üzerinde çalışır.

---
Kaynak: MetallurgyTools — ${SITE_URL}
`;
}

export async function GET(req, { params }) {
  const segments = (await params)?.path || [];
  const path = "/" + segments.join("/");

  // 1) Hasar vakası
  if (path.startsWith("/tools/hasar-vakalari/")) {
    const slug = decodeURIComponent(segments[segments.length - 1]);
    const c = CASES.find((x) => x.slug === slug);
    if (!c) return notFound();
    return new Response(caseMarkdown(c), { headers: TXT_HEADERS });
  }

  // 2) Blog yazısı — tam Markdown gövdesi
  if (path.startsWith("/blog/")) {
    const slug = decodeURIComponent(segments[segments.length - 1]);
    try {
      const blogs = await readBlogs();
      const raw = blogs.find((b) => b.slug === slug && b.status === "published");
      if (!raw) return notFound();
      const p = localizePost(raw, "tr");
      const body = `# ${p.title}

- **Kanonik URL:** ${encodeURI(`${SITE_URL}/blog/${p.slug}`)}
${p.date ? `- **Yayın tarihi:** ${p.date}\n` : ""}${p.tags?.length ? `- **Etiketler:** ${p.tags.join(", ")}\n` : ""}
${p.summary ? `> ${p.summary}\n` : ""}
${p.content || ""}

---
Kaynak: MetallurgyTools — ${SITE_URL}
`;
      return new Response(body, { headers: TXT_HEADERS });
    } catch {
      return notFound();
    }
  }

  // 3) Araç / test / bilgi bankası sayfaları
  const doc = findDoc(path);
  if (doc) return new Response(docMarkdown(doc), { headers: TXT_HEADERS });

  return notFound();
}
