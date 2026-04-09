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
