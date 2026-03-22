export { default } from "@clerk/nextjs/server";

export const config = {
  matcher: [
    "/((?!.*\\..*|_next|tools/hardness|tools/unit-converter).*)",
    "/",
  ],
};
