/**
 * POST /api/admin/verify
 * Body: { key: string }
 * Başarılıysa HttpOnly imzalı cookie set eder ve {ok:true} döner.
 *
 * DELETE /api/admin/verify → cookie'yi temizler (logout).
 * GET    /api/admin/verify → mevcut oturum geçerli mi?
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminKey, issueToken, ADMIN_COOKIE, isAdminAuthed } from "@/lib/adminAuth";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

function clientIp(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req) {
  const ip = clientIp(req);
  const rl = await rateLimit(`admin-login:${ip}`, { limit: 5, windowSec: 300 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen birkaç dakika sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter || 60) } }
    );
  }

  let body = {};
  try { body = await req.json(); } catch { /* ignore */ }

  const key = typeof body?.key === "string" ? body.key : "";
  if (!verifyAdminKey(key)) {
    // Generic mesaj — enum/oracle sızıntısını engeller
    return NextResponse.json({ error: "Hatalı anahtar" }, { status: 401 });
  }

  const token = issueToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE.name, token, ADMIN_COOKIE.options);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE.name, "", { ...ADMIN_COOKIE.options, maxAge: 0 });
  return res;
}

export async function GET() {
  const authed = isAdminAuthed(cookies());
  return NextResponse.json({ authed });
}
