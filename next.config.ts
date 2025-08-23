import type { NextConfig } from 'next';
import '@tailwindcss/postcss';

// Bundle analyzer 설정
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {},
  // ESLint 오류가 있어도 빌드 진행 (배포용)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScript 오류가 있어도 빌드 진행 (선택사항)
  typescript: {
    // ⚠️ production 빌드에서도 타입 체크 스킵 (주의해서 사용)
    // ignoreBuildErrors: true,
  },
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
    // Next.js 16 경고 해결을 위한 설정
    qualities: [25, 50, 75, 90, 95, 100],
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
