/** @type {import('next').NextConfig} */

const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "cloud.appwrite.io",
      "firebasestorage.googleapis.com",
      "image-cdn.hypb.st",
    ],
  },
  publicRuntimeConfig: {
    IS_LOCAL_DEV: process.argv.includes("dev"),
  },
};

module.exports = nextConfig;
