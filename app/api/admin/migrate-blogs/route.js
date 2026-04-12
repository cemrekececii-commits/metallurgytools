/**
 * GET /api/admin/migrate-blogs?adminKey=...
 *
 * One-time migration: copies data/blogs.json → Vercel KV.
 * Safe to call multiple times (skips if KV already has data).
 */
import { NextResponse } from "next/server";
import { migrateToKv } from "@/lib/blogStorage";

export const dynamic = "force-dynamic";

const ADMIN_KEY = process.env.BLOG_ADMIN_KEY || "metallurgy2026";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("adminKey") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await migrateToKv();
  return NextResponse.json(result);
}
