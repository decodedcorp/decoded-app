import type { NextConfig } from 'next';
import '@tailwindcss/postcss';

// Bundle analyzer 설정
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {},
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  // plugins: ['@tailwindcss/postcss'], // Removed invalid plugin
  images: {
    // 모든 HTTPS 도메인 허용 (개발 환경에서만)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
    // 프로덕션에서는 특정 도메인만 허용하도록 설정 가능
    // unoptimized: process.env.NODE_ENV === 'development', // 개발 환경에서 최적화 비활성화
  },
  // Removed rewrites to avoid conflict with API routes
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/proxy/:path*',
  //       destination: 'https://dev.decoded.style/:path*',
  //     },
  //   ];
  // },
};

export default withBundleAnalyzer(nextConfig);
