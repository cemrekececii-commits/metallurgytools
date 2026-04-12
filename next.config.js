/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  // Allow larger request bodies for image uploads (base64 JSON ~ 20 MB raw)
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  // Required for Clerk UserProfile routing in App Router
  async rewrites() {
    return [
      {
        source: "/account",
        destination: "/account",
      },
    ];
  },
};

module.exports = nextConfig;
