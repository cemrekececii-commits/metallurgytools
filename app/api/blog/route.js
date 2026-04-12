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
    title,
    summary,
    content,
    lang: langActual,
    hasTranslation: SUPPORTED_LANGS.reduce((acc, l) => {
      acc[l] = !!(post[l]?.title);
      return acc;
    }, {}),
  };
}

// GET /api/blog
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const adminKey = searchParams.get("adminKey");
  const lang = searchParams.get("lang") || "tr";
  const tag = searchParams.get("tag");
  const search = searchParams.get("search");

  let blogs = await readBlogs();

  if (adminKey !== ADMIN_KEY) {
    blogs = blogs.filter((b) => b.status === "published");
  }

  if (adminKey === ADMIN_KEY) {
    blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    return NextResponse.json(blogs);
  }

  let result = blogs.map((p) => localizePost(p, lang));

  if (tag) {
    result = result.filter((p) => p.tags?.includes(tag));
  }

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

// POST /api/blog — create new
export async function POST(req) {
  const body = await req.json();
  const { adminKey, ...data } = body;

  if (adminKey !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!data.slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const blogs = await readBlogs();

  if (blogs.some((b) => b.slug === data.slug)) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const trContent = data.tr?.content || "";
  const enContent = data.en?.content || "";
  const primaryContent = trContent || enContent;

  const newPost = {
    id: Date.now().toString(),
    slug: data.slug,
    coverImage: data.coverImage || "",
    tags: data.tags || [],
    status: data.status || "draft",
    date: data.date || new Date().toISOString(),
    readingTime: estimateReadingTime(primaryContent),
    tr: data.tr || { title: "", summary: "", content: "" },
    en: data.en || { title: "", summary: "", content: "" },
    zh: data.zh || { title: "", summary: "", content: "" },
    ja: data.ja || { title: "", summary: "", content: "" },
  };

  blogs.unshift(newPost);
  await writeBlogs(blogs);

  return NextResponse.json(newPost, { status: 201 });
}
