import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readBlogs, writeBlogs } from "@/lib/blogStorage";
import { isAdminAuthed } from "@/lib/adminAuth";
import { cleanString, isSlug, stripTags, approxByteSize } from "@/lib/validation";

export const dynamic = "force-dynamic";

const SUPPORTED_LANGS = ["tr", "en", "zh", "ja"];

function estimateReadingTime(content) {
  if (!content) return 1;
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function localizePost(post, lang) {
  const preferred = post[lang] || {};
  const fallback = post["tr"] || {};
  const title = preferred.title || fallback.title || "";
  const summary = preferred.summary || fallback.summary || "";
  const content = preferred.content || fallback.content || "";
  const langActual = preferred.title ? lang : "tr";

  return {
    id: post.id,
    slug: post.slug,
    coverImage: post.coverImage,
    tags: post.tags,
    status: post.status,
    date: post.date,
    readingTime: post.readingTime,
    title, summary, content,
    lang: langActual,
    hasTranslation: SUPPORTED_LANGS.reduce((acc, l) => {
      acc[l] = !!(post[l]?.title);
      return acc;
    }, {}),
  };
}

function requireAdmin() {
  return isAdminAuthed(cookies());
}

// GET /api/blog
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lang = cleanString(searchParams.get("lang") || "tr", 4);
  const tag = cleanString(searchParams.get("tag") || "", 40);
  const search = cleanString(searchParams.get("search") || "", 120);
  const wantAdmin = searchParams.get("admin") === "1";

  let blogs = await readBlogs();
  const authed = requireAdmin();

  if (wantAdmin && authed) {
    blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    return NextResponse.json(blogs);
  }

  // Public görünüm — yalnızca yayınlananlar
  blogs = blogs.filter((b) => b.status === "published");
  let result = blogs.map((p) => localizePost(p, SUPPORTED_LANGS.includes(lang) ? lang : "tr"));

  if (tag) result = result.filter((p) => p.tags?.includes(tag));

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  result.sort((a, b) => new Date(b.date) - new Date(a.date));
  return NextResponse.json(result);
}

// POST /api/blog — create new (admin only)
export async function POST(req) {
  if (!requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  // Büyük içerik kabul edilebilir ama makul bir tavan koy
  if (approxByteSize(body) > 1024 * 1024) {
    return NextResponse.json({ error: "İçerik çok büyük" }, { status: 413 });
  }

  if (!isSlug(body.slug)) {
    return NextResponse.json({ error: "Geçersiz slug" }, { status: 400 });
  }

  const blogs = await readBlogs();
  if (blogs.some((b) => b.slug === body.slug)) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const trContent = body.tr?.content || "";
  const enContent = body.en?.content || "";
  const primaryContent = trContent || enContent;

  const sanitizeLang = (x) => x ? {
    title: cleanString(x.title, 200),
    summary: cleanString(x.summary, 500),
    content: stripTags(x.content, 200000), // blog içeriği — tag'lar markdown render'da üretiliyor
  } : { title: "", summary: "", content: "" };

  const newPost = {
    id: Date.now().toString(),
    slug: body.slug,
    coverImage: cleanString(body.coverImage, 500),
    tags: Array.isArray(body.tags) ? body.tags.slice(0, 20).map(t => cleanString(t, 40)) : [],
    status: ["draft", "published"].includes(body.status) ? body.status : "draft",
    date: body.date || new Date().toISOString(),
    readingTime: estimateReadingTime(primaryContent),
    tr: sanitizeLang(body.tr),
    en: sanitizeLang(body.en),
    zh: sanitizeLang(body.zh),
    ja: sanitizeLang(body.ja),
  };

  blogs.unshift(newPost);
  await writeBlogs(blogs);

  return NextResponse.json(newPost, { status: 201 });
}
