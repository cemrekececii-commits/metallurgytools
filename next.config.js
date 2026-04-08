/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
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
