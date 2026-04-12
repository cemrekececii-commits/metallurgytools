import { NextResponse } from "next/server";
import { readBlogs, writeBlogs } from "@/lib/blogStorage";

export const dynamic = "force-dynamic";

const ADMIN_KEY = process.env.BLOG_ADMIN_KEY || "metallurgy2026";
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

// GET /api/blog/[id]
export async function GET(req, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "tr";
  const adminKey = searchParams.get("adminKey");

  const blogs = await readBlogs();
  const post = blogs.find((b) => b.id === id || b.slug === id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (adminKey === ADMIN_KEY) return NextResponse.json(post);

  return NextResponse.json(localizePost(post, lang));
}

// PUT /api/blog/[id] — update
export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const { adminKey, ...data } = body;

  if (adminKey !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blogs = await readBlogs();
  const idx = blogs.findIndex((b) => b.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (data.slug && blogs.some((b) => b.slug === data.slug && b.id !== id)) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const trContent = data.tr?.content || blogs[idx].tr?.content || "";
  const enContent = data.en?.content || blogs[idx].en?.content || "";
  const primaryContent = trContent || enContent;

  blogs[idx] = {
    ...blogs[idx],
    slug: data.slug ?? blogs[idx].slug,
    coverImage: data.coverImage ?? blogs[idx].coverImage,
    tags: data.tags ?? blogs[idx].tags,
    status: data.status ?? blogs[idx].status,
    date: data.date ?? blogs[idx].date,
    readingTime: estimateReadingTime(primaryContent),
    tr: data.tr ? { ...blogs[idx].tr, ...data.tr } : blogs[idx].tr,
    en: data.en ? { ...blogs[idx].en, ...data.en } : blogs[idx].en,
    zh: data.zh ? { ...blogs[idx].zh, ...data.zh } : blogs[idx].zh,
    ja: data.ja ? { ...blogs[idx].ja, ...data.ja } : blogs[idx].ja,
    updatedAt: new Date().toISOString(),
  };

  await writeBlogs(blogs);
  return NextResponse.json(blogs[idx]);
}

// DELETE /api/blog/[id]
export async function DELETE(req, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const adminKey = searchParams.get("adminKey");

  if (adminKey !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blogs = await readBlogs();
  const idx = blogs.findIndex((b) => b.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  blogs.splice(idx, 1);
  await writeBlogs(blogs);
  return NextResponse.json({ success: true });
}
