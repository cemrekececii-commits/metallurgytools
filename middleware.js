/**
 * middleware.js
 *
 * Katmanlar:
 *  ① Her zaman açık   → public sayfalar, SEO rotaları, statik dosyalar
 *  ② Tool API'leri    → Clerk auth zorunlu (plan kontrolü route handler'da)
 *  ③ Tool sayfaları   → Auth yoksa /signup'a yönlendir (SEO botları geçer)
 *  ④ Admin rotaları   → Route handler halleder
 *  ⑤ Diğerleri        → Geçir
 *
 * SEO NOTU:
 *  Googlebot için /tools/* ve /mechanical-tests/* sayfaları açık kalır.
 *  Sadece /api/tools/* ve /api/sem-eds hesaplama endpoint'leri kısıtlıdır.
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ─── Route matchers ───────────────────────────────────────────────────────────

const isToolApiRoute = createRouteMatcher([
  "/api/tools/(.*)",
  "/api/sem-eds",
  "/api/sem-eds/(.*)",
]);

const isToolPageRoute = createRouteMatcher([
  "/tools(.*)",
  "/mechanical-tests(.*)",
]);

const isAlwaysPublic = createRouteMatcher([
  "/",
  "/api/shopier/(.*)",
  "/api/trial/(.*)",
  "/api/blog/(.*)",
  "/api/consultation/(.*)",
  "/api/feedback/(.*)",
  "/subscribe(.*)",
  "/login(.*)",
  "/signup(.*)",
  "/blog(.*)",
  "/knowledge(.*)",
  "/sitemap.xml",
  "/robots.txt",
]);

// ─── Middleware ───────────────────────────────────────────────────────────────

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // ① Her zaman açık
  if (isAlwaysPublic(request)) return NextResponse.next();

  // ② Tool API rotaları — Clerk auth yoksa 401
  if (isToolApiRoute(request)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor.", redirect: "/signup", mode: "unauthenticated" },
        { status: 401 }
      );
    }
    // Plan/trial kontrolü accessControl.js'de yapılır
    return NextResponse.next();
  }

  // ③ Tool sayfa rotaları — auth yoksa /signup'a yönlendir
  //    Googlebot ve arama motorları User-Agent ile tespit edilip geçirilir
  if (isToolPageRoute(request)) {
    const ua = request.headers.get("user-agent") || "";
    const isBot = /googlebot|bingbot|yandexbot|slurp|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot/i.test(ua);

    if (!isBot) {
      const { userId } = await auth();
      if (!userId) {
        const signupUrl = new URL("/signup", request.url);
        signupUrl.searchParams.set("redirect_url", pathname);
        return NextResponse.redirect(signupUrl);
      }
    }
    return NextResponse.next();
  }

  // ④⑤ Admin ve diğerleri
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
