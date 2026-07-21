/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output produces a minimal self-contained server bundle
  // (node_modules pruned to only what's needed) — ideal for a small Docker
  // image on a Hetzner VPS instead of shipping the whole dev node_modules.
  output: "standalone",
  images: {
    // The hero character art is served from permanent CDN storage rather
    // than committed to the repo as a binary — keeps the git history small
    // and avoids large-file push limits.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "galaxy-prod.tlcdn.com",
      },
    ],
  },
};

module.exports = nextConfig;
