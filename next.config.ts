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
  plugins: ['@tailwindcss/postcss'],
  images: {
    domains: ['picsum.photos', 'randomuser.me'],
  },
};

export default nextConfig;
