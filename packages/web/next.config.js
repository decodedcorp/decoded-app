/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile shared package from monorepo
  transpilePackages: ["@decoded/shared"],
  images: {
    remotePatterns: [
      // Allow all R2 bucket domains (current and future buckets)
      {
        protocol: "https",
        hostname: "**.r2.dev",
        pathname: "/**",
      },
      // Placeholder images for mock data
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      // Unsplash images for Today's Decoded
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // DiceBear avatars for profile mock data
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
