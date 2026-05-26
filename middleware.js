import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// SEO NOTU: /tools ve /mechanical-tests rotaları içerik sayfalarıdır.
// Bunlar middleware seviyesinde kilitlenirse Googlebot ve diğer arama
// motoru tarayıcıları sayfa içeriğini, metadata'yı ve JSON-LD'yi göremez —
// site indekslenemez. Bu nedenle bu rotaları "public" tutuyoruz; gerçek
// hesaplama/AI API uç noktaları zaten `app/api/tools/*/route.js` içinde
// Clerk `auth()` ile sunucu tarafında korunmaktadır.
// Yalnızca kullanıcıya özel paneller (dashboard, account, consultation)
// ve admin tarafı korunmalıdır.
// ─────────────────────────────────────────────────────────────────────────────
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/consultation",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isProtectedRoute(req) && !userId) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
