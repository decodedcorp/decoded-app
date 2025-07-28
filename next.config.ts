import type { NextConfig } from 'next';
import '@tailwindcss/postcss';

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
    domains: ['picsum.photos', 'randomuser.me'],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://dev.decoded.style/:path*',
      },
    ];
  },
};

export default nextConfig;
