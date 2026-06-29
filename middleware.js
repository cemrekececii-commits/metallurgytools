/**
 * middleware.js
 *
 * Katmanlar:
 *  - Her zaman acik   -> public sayfalar, SEO rotalari, statik dosyalar
 *  - Tool API'leri    -> Clerk auth zorunlu (plan kontrolu route handler'da)
 *  - Tool sayfalari   -> Auth yoksa /signup'a yonlendir
 *  - Admin rotalari   -> Route handler halleder
 *  - Digerleri        -> Gecir
 *
 * SEO NOTU (guncellendi):
 *  - /mechanical-tests/* egitim rehberleri artik TAM PUBLIC (statik icerik,
 *    Google icin yuksek degerli; isAlwaysPublic'e tasindi).
 *  - /tools/* interaktif hesaplayicilar girise kapalidir. ONEMLI: Artik
 *    User-Agent ayrimi YOK. Daha once Googlebot'a icerik, kullaniciya /signup
 *    sunuluyordu; bu CLOAKING'dir ve Google cezalandirabilir. Simdi kullanici
 *    ve bot AYNI yaniti alir (auth yoksa ikisi de /signup'a yonlenir). /tools
 *    indexlenmez ama farkli icerik sunulmadigi icin ceza riski ortadan kalkar.
 *  - Sadece /api/tools/* ve /api/sem-eds hesaplama endpoint'leri kisitlidir.
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// --- Route matchers ---

const isToolApiRoute = createRouteMatcher([
  "/api/tools/(.*)",
  "/api/sem-eds",
  "/api/sem-eds/(.*)",
]);

// Sadece interaktif araclar girise kapali. Egitim rehberleri (mechanical-tests)
// artik burada DEGIL -> isAlwaysPublic'te (tam public).
const isToolPageRoute = createRouteMatcher([
  "/tools(.*)",
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
  "/mechanical-tests(.*)",   // egitim rehberleri: TAM PUBLIC (SEO icerigi)
  "/sitemap.xml",
  "/robots.txt",
]);

// --- Middleware ---

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // 1) Her zaman acik
  if (isAlwaysPublic(request)) return NextResponse.next();

  // 2) Tool API rotalari - Clerk auth yoksa 401
  if (isToolApiRoute(request)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Giris yapmaniz gerekiyor.", redirect: "/signup", mode: "unauthenticated" },
        { status: 401 }
      );
    }
    // Plan/trial kontrolu accessControl.js'de yapilir
    return NextResponse.next();
  }

  // 3) Tool sayfa rotalari - auth yoksa /signup'a yonlendir.
  //    CLOAKING KALDIRILDI: kullanici ve bot ayrimi yapilmaz; herkes ayni
  //    yaniti alir. Auth yoksa Googlebot dahil herkes /signup'a yonlenir.
  if (isToolPageRoute(request)) {
    const { userId } = await auth();
    if (!userId) {
      const signupUrl = new URL("/signup", request.url);
      signupUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signupUrl);
    }
    return NextResponse.next();
  }

  // 4-5) Admin ve digerleri
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
