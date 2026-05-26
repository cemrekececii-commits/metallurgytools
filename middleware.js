/**
 * middleware.js
 *
 * Erişim katmanları (öncelik sırasıyla):
 *  ① Her zaman açık rotalar  → public + SEO + statik
 *  ② Tool API rotaları       → trial VEYA professional plan zorunlu
 *  ③ Admin rotaları          → route handler kendi auth'unu yapar
 *  ④ Geri kalan             → Clerk isteğe bağlı, geçir
 *
 * SEO NOTU:
 *   /tools/* ve /mechanical-tests/* SAYFA rotaları burada kilitlenmez.
 *   Sadece /api/tools/* ve /api/sem-eds hesaplama uç noktaları kısıtlanır.
 *   Googlebot metadata + JSON-LD'ye her zaman erişebilir.
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import {
  TRIAL_DAYS,
  TRIAL_COOKIE,
  COOKIE_MAX_AGE,
  encodeTrialCookie,
  decodeTrialCookie,
  getFingerprint,
  kvGetTrial,
  kvSetTrial,
  trialStatus,
} from "@/lib/trialUtils";

// ─── Route matchers ───────────────────────────────────────────────────────────

const isToolApiRoute = createRouteMatcher([
  "/api/tools/(.*)",
  "/api/sem-eds",
  "/api/sem-eds/(.*)",
]);

const isAlwaysPublic = createRouteMatcher([
  "/",
  "/api/shopier/(.*)",
  "/api/trial/(.*)",
  "/subscribe(.*)",
  "/login(.*)",
  "/signup(.*)",
  "/blog(.*)",
  "/knowledge(.*)",
  "/api/blog/(.*)",
  "/api/consultation/(.*)",
  "/api/feedback/(.*)",
  "/tools(.*)",
  "/mechanical-tests(.*)",
  "/_next/(.*)",
  "/favicon.ico",
  "/sitemap.xml",
  "/robots.txt",
]);

// ─── Middleware ───────────────────────────────────────────────────────────────

export default clerkMiddleware(async (auth, request) => {
  // ① Her zaman geçen rotalar
  if (isAlwaysPublic(request)) return NextResponse.next();

  // ② Tool API rotaları
  if (isToolApiRoute(request)) {

    // 2a. Clerk auth + professional plan
    const { userId, sessionClaims } = await auth();

    if (userId) {
      const meta      = sessionClaims?.public_metadata ?? sessionClaims?.metadata ?? {};
      const plan      = meta?.plan;
      const expiresAt = meta?.planExpiresAt;

      if (plan === "professional") {
        const notExpired = !expiresAt || new Date(expiresAt) > new Date();
        if (notExpired) return NextResponse.next();
      }
    }

    // 2b. KV + cookie trial
    const fingerprint = await getFingerprint(request);
    let startTs       = await kvGetTrial(fingerprint);

    // KV'de yok → cookie'den kurtar
    if (!startTs) {
      const cookieVal  = request.cookies.get(TRIAL_COOKIE)?.value;
      const fromCookie = cookieVal ? decodeTrialCookie(cookieVal) : null;
      if (fromCookie) {
        await kvSetTrial(fingerprint, fromCookie);
        startTs = fromCookie;
      }
    }

    if (startTs) {
      const status = trialStatus(startTs);

      if (status.active) {
        const headers = new Headers(request.headers);
        headers.set("x-trial-active",    "1");
        headers.set("x-trial-days-left", String(status.daysLeft));
        return NextResponse.next({ request: { headers } });
      }

      return NextResponse.json(
        { error: "7 günlük ücretsiz deneme süreniz doldu.", redirect: "/subscribe", code: "trial_expired" },
        { status: 402 }
      );
    }

    // Trial hiç başlatılmamış
    return NextResponse.json(
      { error: "Deneme süreniz başlatılmamış.", redirect: "/subscribe", code: "trial_not_started" },
      { status: 402 }
    );
  }

  // ③④ Admin ve diğer rotalar
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
