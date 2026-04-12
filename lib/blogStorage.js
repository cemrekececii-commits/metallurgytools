/**
 * blogStorage.js
 * ─────────────
 * Vercel KV when KV_REST_API_URL + KV_REST_API_TOKEN env vars are present.
 * Falls back to local filesystem (data/blogs.json) for local development.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const BLOGS_KEY = "metallurgy:blogs";
const DATA_PATH = join(process.cwd(), "data", "blogs.json");

function isKvAvailable() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// ── KV helpers ─────────────────────────────────────────────────────────────

async function kvGet() {
  try {
    const { kv } = await import("@vercel/kv");
    const data = await kv.get(BLOGS_KEY);
    if (!data) return [];
    return Array.isArray(data) ? data : JSON.parse(data);
  } catch (e) {
    console.error("KV get error:", e);
    return [];
  }
}

async function kvSet(blogs) {
  const { kv } = await import("@vercel/kv");
  await kv.set(BLOGS_KEY, JSON.stringify(blogs));
}

// ── Filesystem helpers ──────────────────────────────────────────────────────

function fsRead() {
  if (!existsSync(DATA_PATH)) return [];
  try { return JSON.parse(readFileSync(DATA_PATH, "utf-8")); }
  catch { return []; }
}

function fsWrite(blogs) {
  writeFileSync(DATA_PATH, JSON.stringify(blogs, null, 2), "utf-8");
}

// ── Public API ──────────────────────────────────────────────────────────────

export async function readBlogs() {
  if (isKvAvailable()) return kvGet();
  return fsRead();
}

export async function writeBlogs(blogs) {
  if (isKvAvailable()) {
    await kvSet(blogs);
  } else {
    fsWrite(blogs);
  }
}

/** One-time migration: filesystem → KV. Safe to call multiple times. */
export async function migrateToKv() {
  if (!isKvAvailable()) return { skipped: true, reason: "KV not configured" };
  const existing = await kvGet();
  if (existing.length > 0) return { skipped: true, reason: `KV already has ${existing.length} posts` };
  const local = fsRead();
  if (local.length === 0) return { skipped: true, reason: "No local data to migrate" };
  await kvSet(local);
  return { migrated: true, count: local.length };
}
