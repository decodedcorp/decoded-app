/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "cloud.appwrite.io",
      "firebasestorage.googleapis.com",
      "image-cdn.hypb.st",
    ],
    unoptimized: true,
  },
  publicRuntimeConfig: {
    IS_LOCAL_DEV: process.argv.includes("dev"),
  },
  output: "export",
};

module.exports = nextConfig;
