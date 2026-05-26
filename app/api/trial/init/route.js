/**
 * POST /api/trial/init
 *
 * İstemci, kullanıcı ilk araç sayfasına girdiğinde bu endpoint'i çağırır.
 * - KV'de fingerprint kaydı yoksa trial başlatır (startTs = şimdi)
 * - Varsa mevcut durumu döndürür (idempotent)
 * - HttpOnly cookie set eder (ikincil doğrulama için)
 *
 * GET /api/trial/init
 * - Mevcut trial durumunu sorgular (UI için)
 */

import { NextResponse } from "next/server";
import {
  TRIAL_COOKIE,
  COOKIE_MAX_AGE,
  encodeTrialCookie,
  getFingerprint,
  kvGetTrial,
  kvSetTrial,
  trialStatus,
} from "@/lib/trialUtils";

export async function POST(request) {
  try {
    const fingerprint = await getFingerprint(request);
    let startTs       = await kvGetTrial(fingerprint);

    let justStarted = false;
    if (!startTs) {
      startTs     = Date.now();
      justStarted = true;
      await kvSetTrial(fingerprint, startTs);
    }

    const status = trialStatus(startTs);
    const body   = { started: justStarted, ...status };

    const response = NextResponse.json(body);

    // Cookie set — HttpOnly, SameSite=Lax, Secure in production
    response.cookies.set(TRIAL_COOKIE, encodeTrialCookie(startTs), {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   COOKIE_MAX_AGE,
      path:     "/",
    });

    return response;
  } catch (err) {
    console.error("[trial/init] error:", err);
    return NextResponse.json({ error: "Trial başlatılamadı." }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const fingerprint = await getFingerprint(request);
    const startTs     = await kvGetTrial(fingerprint);
    const status      = trialStatus(startTs);
    return NextResponse.json(status);
  } catch (err) {
    console.error("[trial/init] GET error:", err);
    return NextResponse.json({ error: "Durum sorgulanamadı." }, { status: 500 });
  }
}
