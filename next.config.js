/** @type {import('next').NextConfig} */

const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.fallback = { fs: false };
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "node_modules/onnxruntime-web/dist/*.wasm",
            to: "static/chunks/app/images-later/[imageId]/[name][ext]",
          },
        ],
      })
    );
    return config;
  },
  images: {
    domains: ["cloud.appwrite.io", "firebasestorage.googleapis.com"],
  },
};

module.exports = nextConfig;
