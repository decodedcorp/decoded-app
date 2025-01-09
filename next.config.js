/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cloud.appwrite.io',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn.hypb.st',
      },
      {
        protocol: 'https',
        hostname: 'pub-65bb4012fb354951a2c6139a4b49b717.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  webpack(config) {
    // SVG 설정
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  publicRuntimeConfig: {
    IS_LOCAL_DEV: process.argv.includes("dev"),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
