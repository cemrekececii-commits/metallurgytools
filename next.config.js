/** @type {import('next').NextConfig} */

// ───────────────────────────────────────────────────────────────────────────
// Content Security Policy
// Clerk, Stripe, Google Analytics, Clarity, Vercel Blob/KV, Unsplash ve
// Google AI endpoint'leri whitelist edildi. Yeni bir 3. parti eklendiğinde
// ilgili direktife host eklenmelidir.
// ───────────────────────────────────────────────────────────────────────────
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
    https://*.clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com
    https://js.stripe.com https://checkout.stripe.com
    https://www.googletagmanager.com https://www.google-analytics.com
    https://www.clarity.ms https://*.clarity.ms
    https://cdn.iyzipay.com https://sandbox-static.iyzipay.com https://static.iyzipay.com
    https://www.shopier.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https:;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self'
    https://*.clerk.com https://*.clerk.accounts.dev
    https://api.stripe.com https://checkout.stripe.com
    https://www.google-analytics.com https://region1.google-analytics.com
    https://*.clarity.ms
    https://*.blob.vercel-storage.com https://*.vercel-storage.com
    https://*.upstash.io
    https://generativelanguage.googleapis.com
    https://api.iyzipay.com https://sandbox-api.iyzipay.com
    https://www.shopier.com
    wss://*.clerk.com;
  frame-src 'self'
    https://js.stripe.com https://checkout.stripe.com https://hooks.stripe.com
    https://challenges.cloudflare.com
    https://*.clerk.com https://*.clerk.accounts.dev;
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://checkout.stripe.com https://www.shopier.com https://sandbox-api.iyzipay.com https://api.iyzipay.com;
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-XSS-Protection", value: "0" }, // legacy filtre; CSP yeterli
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      'payment=(self "https://checkout.stripe.com")',
      "usb=()",
      "magnetometer=()",
      "accelerometer=()",
      "gyroscope=()",
      "interest-cohort=()",
    ].join(", "),
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
];

const nextConfig = {
  // Teknoloji parmak izini gizle
  poweredByHeader: false,

  // Prod'da source map'leri kapat (tersine mühendislik yüzeyini daraltır)
  productionBrowserSourceMaps: false,

  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },

  // Upload body limiti: 25 MB → 8 MB (DoS/bellek riski azaltılır)
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },

  async rewrites() {
    return [
      { source: "/account", destination: "/account" },
    ];
  },
};

module.exports = nextConfig;
