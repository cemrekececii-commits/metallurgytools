/**
 * GET /api/admin/migrate-blogs
 * One-time migration: copies data/blogs.json → Vercel KV.
 * Admin cookie oturumu gerektirir.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { migrateToKv } from "@/lib/blogStorage";
import { isAdminAuthed } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAdminAuthed(cookies())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await migrateToKv();
  return NextResponse.json(result);
}
