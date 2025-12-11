/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Allow all R2 bucket domains (current and future buckets)
      // ** matches any number of subdomains, * matches a single subdomain
      {
        protocol: "https",
        hostname: "**.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
