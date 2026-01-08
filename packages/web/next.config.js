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
    ],
  },
};

module.exports = nextConfig;
