import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readBlogs, writeBlogs } from "@/lib/blogStorage";
import { isAdminAuthed } from "@/lib/adminAuth";
import { cleanString, stripTags, isSlug, approxByteSize } from "@/lib/validation";

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
    lang: preferred.title ? lang : "tr",
    hasTranslation: SUPPORTED_LANGS.reduce((acc, l) => {
      acc[l] = !!(post[l]?.title);
      return acc;
    }, {}),
  };
}

function requireAdmin() { return isAdminAuthed(cookies()); }

export async function GET(req, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const lang = cleanString(searchParams.get("lang") || "tr", 4);
  const wantAdmin = searchParams.get("admin") === "1";

  const blogs = await readBlogs();
  const post = blogs.find((b) => b.id === id || b.slug === id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (wantAdmin && requireAdmin()) return NextResponse.json(post);
  if (post.status !== "published" && !requireAdmin()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(localizePost(post, SUPPORTED_LANGS.includes(lang) ? lang : "tr"));
}

export async function PUT(req, { params }) {
  if (!requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  let data;
  try { data = await req.json(); } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
  if (approxByteSize(data) > 1024 * 1024) {
    return NextResponse.json({ error: "İçerik çok büyük" }, { status: 413 });
  }

  const blogs = await readBlogs();
  const idx = blogs.findIndex((b) => b.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (data.slug) {
    if (!isSlug(data.slug)) return NextResponse.json({ error: "Geçersiz slug" }, { status: 400 });
    if (blogs.some((b) => b.slug === data.slug && b.id !== id)) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  const sanitizeLang = (cur, incoming) => incoming ? {
    title: cleanString(incoming.title ?? cur?.title ?? "", 200),
    summary: cleanString(incoming.summary ?? cur?.summary ?? "", 500),
    content: stripTags(incoming.content ?? cur?.content ?? "", 200000),
  } : cur;

  const trContent = data.tr?.content || blogs[idx].tr?.content || "";
  const enContent = data.en?.content || blogs[idx].en?.content || "";
  const primaryContent = trContent || enContent;

  blogs[idx] = {
    ...blogs[idx],
    slug: data.slug ?? blogs[idx].slug,
    coverImage: data.coverImage !== undefined ? cleanString(data.coverImage, 500) : blogs[idx].coverImage,
    tags: Array.isArray(data.tags) ? data.tags.slice(0, 20).map(t => cleanString(t, 40)) : blogs[idx].tags,
    status: ["draft", "published"].includes(data.status) ? data.status : blogs[idx].status,
    date: data.date ?? blogs[idx].date,
    readingTime: estimateReadingTime(primaryContent),
    tr: sanitizeLang(blogs[idx].tr, data.tr),
    en: sanitizeLang(blogs[idx].en, data.en),
    zh: sanitizeLang(blogs[idx].zh, data.zh),
    ja: sanitizeLang(blogs[idx].ja, data.ja),
    updatedAt: new Date().toISOString(),
  };

  await writeBlogs(blogs);
  return NextResponse.json(blogs[idx]);
}

export async function DELETE(req, { params }) {
  if (!requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const blogs = await readBlogs();
  const idx = blogs.findIndex((b) => b.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  blogs.splice(idx, 1);
  await writeBlogs(blogs);
  return NextResponse.json({ success: true });
}
