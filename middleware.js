import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/tools(.*)",
  "/mechanical-tests/(.*)",
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
