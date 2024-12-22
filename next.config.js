/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "cloud.appwrite.io",
      "firebasestorage.googleapis.com",
      "image-cdn.hypb.st",
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  publicRuntimeConfig: {
    IS_LOCAL_DEV: process.argv.includes("dev"),
  },
};

module.exports = nextConfig;
