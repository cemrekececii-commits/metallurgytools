// ─────────────────────────────────────────────────────────────────────────────
// /llms.txt — LLM ajanları için site indeksi (llmstxt.org konvansiyonu)
//
// Neden statik public/llms.txt yerine route:
//   Blog yazıları ve hasar vakaları büyüdükçe statik dosya sapıyordu. Artık
//   lib/llmCorpus.js + CaseData + KV blog kayıtlarından üretiliyor, dolayısıyla
//   yeni içerik yayınlandığı anda indekste görünüyor.
//
// [Doğrulanmadı] llms.txt resmî bir standart değildir; yaygınlaşan bir
// topluluk konvansiyonudur. Bu dosyanın varlığı herhangi bir LLM sağlayıcısı
// tarafından alıntı garantisi vermez.
// ─────────────────────────────────────────────────────────────────────────────
import { SITE_URL, CLAIMS } from "@/lib/seo";
import { TOOLS, MECHANICAL_TESTS, KNOWLEDGE, CORPUS_VERSION } from "@/lib/llmCorpus";
import { CASES } from "@/components/hasar/CaseData";
import { readBlogs } from "@/lib/blogStorage";
import { localizePost } from "@/lib/blogView";

export const dynamic = "force-dynamic";

function line(item) {
  const title = item.title + (item.titleTR ? ` (${item.titleTR})` : "");
  const std = item.standards?.length ? ` Standartlar: ${item.standards.join(", ")}.` : "";
  const desc = item.abstract ? item.abstract.split(". ")[0] + "." : "";
  return `- [${title}](${SITE_URL}${item.path}): ${desc}${std}`;
}

export async function GET() {
  let posts = [];
  try {
    const blogs = await readBlogs();
    posts = blogs
      .filter((b) => b && b.status === "published")
      .map((b) => localizePost(b, "tr"))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch {
    posts = [];
  }

  const body = `# MetallurgyTools

> Metalurjik danışmanlık kaynağı ve çelik metalurjisi hesaplama araçları. ${CLAIMS.experienceLabel.tr.charAt(0).toUpperCase() + CLAIMS.experienceLabel.tr.slice(1)}ne sahip, ${CLAIMS.testsPerYearLabel.tr} işleyen metalurji mühendisleri tarafından geliştirilmektedir. / Metallurgical consultancy resource and steel metallurgy calculation tools, developed by metallurgists with ${CLAIMS.experienceLabel.en}, processing ${CLAIMS.testsPerYearLabel.en}. Bilingual (TR/EN).

Kapsam / Scope: API 5L, API 5CT, DP600, S700MC, IF, ST37–ST52, HSLA ve yapı çelikleri; BOF – pota metalurjisi (LF) – vakum (VD/RH) – sürekli döküm – sıcak haddeleme (TMCP) – kangal, levha ve bobin üretimi; mekanik test (çekme, Charpy, sertlik, katlama, DWTT), metalografi, fraktografi, SEM-EDS, inklüzyon karakterizasyonu ve hasar (kök neden) analizi.

Alıntı / Citation: İçeriğe atıf yapılırken kaynak "MetallurgyTools (${SITE_URL})" olarak belirtilmelidir.
Tam metin korpus / Full-text corpus: ${SITE_URL}/llms-full.txt
Sürüm / Version: ${CORPUS_VERSION}

## Danışmanlık / Consultancy

- [Hakkında ve Metodoloji](${SITE_URL}/about): Proje arka planı; ASTM, EN ISO, API ve VDA standartlarına göre kalibrasyon yaklaşımı.
- [Metodoloji ve Doğrulama](${SITE_URL}/methodology): Ampirik formüllerin dayanağı, doğrulama veri kümesi, belirsizlik ve sınırlamalar.
- [Danışmanlık Hizmetleri](${SITE_URL}/consultation): Hasar analizi, mikroyapı karakterizasyonu, inklüzyon değerlendirmesi, mekanik test yorumlama, müşteri şikâyeti numunesi incelemesi, kaynaklanabilirlik değerlendirmesi.

## Hesaplama Araçları / Calculation Tools

${TOOLS.map(line).join("\n")}

## Mekanik Testler / Mechanical Tests

${MECHANICAL_TESTS.map(line).join("\n")}

## Bilgi Bankası / Knowledge Base

${KNOWLEDGE.map(line).join("\n")}

## Hasar Vakaları / Failure Cases (${CASES.length})

${CASES.map(
  (c) =>
    `- [${c.en} (${c.tr})](${encodeURI(`${SITE_URL}/tools/hasar-vakalari/${c.slug}`)}): ${
      c.sikayet_en || c.sikayet || ""
    }${c.tags?.length ? ` — ${c.tags.join(", ")}` : ""}`
).join("\n")}

## Teknik Makaleler / Technical Articles (${posts.length})

${
  posts.length
    ? posts
        .map(
          (p) =>
            `- [${p.title}](${encodeURI(`${SITE_URL}/blog/${p.slug}`)}): ${(p.summary || "").replace(/\s+/g, " ").slice(0, 220)}`
        )
        .join("\n")
    : "- (Şu anda yayımlanmış makale bulunmuyor.)"
}

## Optional

- [Sitemap (XML)](${SITE_URL}/sitemap.xml)
- [Robots](${SITE_URL}/robots.txt)
- Her doküman sayfasının düz Markdown sürümü: URL sonuna \`.md\` eklenerek alınabilir. Örnek: ${SITE_URL}/tools/hardness.md
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
