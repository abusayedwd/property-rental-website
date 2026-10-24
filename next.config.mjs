/** @type {import('next').NextConfig} */

// Optional proxy: when BACKEND_URL is set (e.g. on Vercel), the site serves the
// backend under its own https address at /backend/... and forwards the calls
// server-side. This avoids the browser's "mixed content" block when the
// backend only has plain http. Locally BACKEND_URL is unset and nothing changes.
const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/+$/, "");

const nextConfig = {
  // Lets a second dev server run beside the main one (used for testing)
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // socket.io needs its trailing slash ("/socket.io/"); keep URLs as sent
  skipTrailingSlashRedirect: true,
  images: {
    // Hosts that next/image may load from
    remotePatterns: [
      { protocol: "https", hostname: "sayed3040.sobhoy.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async redirects() {
    return [
      // Old listing links (shared before the readable URLs) keep working
      { source: "/detailsHome/:id", destination: "/listing/:id", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // Browsers ask for /favicon.ico automatically; serve the app icon there
      { source: "/favicon.ico", destination: "/icon.svg" },
      ...(BACKEND_URL
        ? [
            { source: "/backend/socket.io/", destination: `${BACKEND_URL}/socket.io/` }, // chat (long-polling)
            { source: "/backend/:path*", destination: `${BACKEND_URL}/:path*` },
          ]
        : []),
    ];
  },
  eslint: {
    // The ESLint config can't run under ESLint 9 yet; don't let it block deploys
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
