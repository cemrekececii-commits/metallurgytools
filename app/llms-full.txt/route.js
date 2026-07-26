// ─────────────────────────────────────────────────────────────────────────────
// /llms-full.txt — Tam metin LLM korpusu
//
// Amaç: JavaScript çalıştırmayan bir ajanın tek istekle sitenin teknik
// özünü alabilmesi. İçerik:
//   1. Araç / test / bilgi bankası teknik abstract'ları (lib/llmCorpus.js)
//   2. 25 hasar vakasının tam metni (bulgular, kök neden, önleme, kaynak)
//   3. Yayımlanmış blog yazılarının tam Markdown gövdesi
//
// Not: Görseller ve etkileşimli hesaplayıcılar bu dosyada yer almaz; onlar
// için ilgili sayfa URL'si verilir.
// ─────────────────────────────────────────────────────────────────────────────
import { SITE_URL, CLAIMS } from "@/lib/seo";
import { TOOLS, MECHANICAL_TESTS, KNOWLEDGE, CORPUS_VERSION } from "@/lib/llmCorpus";
import { CASES, CATEGORIES } from "@/components/hasar/CaseData";
import { readBlogs } from "@/lib/blogStorage";
import { localizePost } from "@/lib/blogView";

export const dynamic = "force-dynamic";

function docBlock(d) {
  return [
    `### ${d.title}${d.titleTR ? ` / ${d.titleTR}` : ""}`,
    `URL: ${SITE_URL}${d.path}`,
    d.standards?.length ? `Standartlar: ${d.standards.join(", ")}` : null,
    "",
    d.abstract,
    "",
  ]
    .filter(Boolean)
    .join("\n");
}

function caseBlock(c) {
  const cat = CATEGORIES[c.category];
  const bullets = (arr) => (arr?.length ? arr.map((x) => `- ${x}`).join("\n") : "- (kayıt yok)");
  return [
    `### Vaka ${c.no}: ${c.tr} / ${c.en}`,
    `URL: ${encodeURI(`${SITE_URL}/tools/hasar-vakalari/${c.slug}`)}`,
    `Ürün grubu: ${cat ? `${cat.tr} / ${cat.en}` : c.category}`,
    c.sikayet ? `Şikâyet tipi: ${c.sikayet}${c.sikayet_en ? ` / ${c.sikayet_en}` : ""}` : null,
    c.tags?.length ? `Etiketler: ${c.tags.join(", ")}` : null,
    "",
    "Bulgular / Findings:",
    bullets(c.tespitler),
    "",
    "Kök neden değerlendirmesi / Root cause assessment:",
    bullets(c.nedenler),
    "",
    "Önleyici faaliyetler / Preventive actions:",
    bullets(c.onleme),
    c.kaynak ? `\nKaynak / Reference: ${c.kaynak}` : null,
    "",
  ]
    .filter(Boolean)
    .join("\n");
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

  const header = `# MetallurgyTools — Tam Metin Korpus / Full-Text Corpus

Kaynak / Source: ${SITE_URL}
Sürüm / Version: ${CORPUS_VERSION}
Üretim tarihi / Generated: ${new Date().toISOString()}
Diller / Languages: Türkçe (birincil), İngilizce
Lisans notu / Licensing: İçerik alıntılanabilir; atıf "MetallurgyTools (${SITE_URL})" biçiminde ve ilgili sayfa bağlantısıyla birlikte verilmelidir.

Yayıncı / Publisher: MetallurgyTools — entegre demir-çelik tesisi metalurjistleri.
Deneyim / Experience: ${CLAIMS.experienceLabel.tr} (${CLAIMS.experienceLabel.en}).
Veri temeli / Data basis: ${CLAIMS.testsPerYearLabel.tr} (${CLAIMS.testsPerYearLabel.en}).
[Doğrulanmadı / Unverified] Yukarıdaki nicel ifadeler yayıncı beyanıdır; bağımsız denetime tabi tutulmamıştır.

Kapsanan çelik sınıfları: API 5L, API 5CT, DP600, S700MC, IF, ST37, ST44, ST52, HSLA, yapı ve gemi çelikleri.
Kapsanan üretim rotası: BOF → pota fırını (LF) → vakum işlemi (VD/RH) → sürekli döküm → sıcak haddeleme (TMCP) → kangal / levha / bobin.
Kapsanan test yöntemleri: çekme (EN ISO 6892-1, ASTM E8), Charpy darbe (EN ISO 148-1, ASTM E23), sertlik (ASTM E18/E92/E10), katlama (EN ISO 7438), DWTT (API 5L3, ASTM E436), ultrasonik muayene, metalografi (ASTM E3, E407, E112, E45), SEM-EDS (ASTM E1508).

ÖNEMLİ SINIRLAMA: Bu korpustaki hesaplama yaklaşımları mühendislik tahminidir ve fiziksel testin yerine geçmez. Standart metinlerinin kendisi burada çoğaltılmamıştır; ilgili standart numarası referans amaçlıdır.

---

## 1. HESAPLAMA ARAÇLARI / CALCULATION TOOLS

${TOOLS.map(docBlock).join("\n")}
---

## 2. MEKANİK TESTLER / MECHANICAL TESTS

${MECHANICAL_TESTS.map(docBlock).join("\n")}
---

## 3. BİLGİ BANKASI / KNOWLEDGE BASE

${KNOWLEDGE.map(docBlock).join("\n")}
---

## 4. HASAR VAKALARI / FAILURE CASES (${CASES.length})

Aşağıdaki vakalar, entegre demir-çelik tesisi üretiminde ve müşteri şikâyeti
numunelerinde metalografik olarak incelenmiş gerçek kusur tiplerinin
özetleridir. Her kayıt makro/mikro bulgu, kök neden değerlendirmesi ve
önleyici faaliyet başlıklarını içerir.

${CASES.map(caseBlock).join("\n")}
---

## 5. TEKNİK MAKALELER / TECHNICAL ARTICLES (${posts.length})

`;

  const articles = posts.length
    ? posts
        .map((p) =>
          [
            `### ${p.title}`,
            `URL: ${encodeURI(`${SITE_URL}/blog/${p.slug}`)}`,
            p.date ? `Yayın tarihi: ${p.date}` : null,
            p.tags?.length ? `Etiketler: ${p.tags.join(", ")}` : null,
            p.summary ? `\nÖzet: ${p.summary}` : null,
            "",
            p.content || "",
            "",
            "---",
            "",
          ]
            .filter((x) => x !== null)
            .join("\n")
        )
        .join("\n")
    : "(Şu anda yayımlanmış makale bulunmuyor.)\n";

  const footer = `
## 6. İLETİŞİM / CONTACT

Danışmanlık talepleri: ${SITE_URL}/consultation
Genel iletişim: ${SITE_URL}/iletisim

Bu dosyanın kısa indeks sürümü: ${SITE_URL}/llms.txt
`;

  return new Response(header + articles + footer, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
