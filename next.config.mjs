/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Hosts that next/image may load from
    remotePatterns: [{ protocol: "https", hostname: "sayed3040.sobhoy.com" }],
  },
  // Browsers ask for /favicon.ico automatically; serve the app icon there
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon.svg" }];
  },
  eslint: {
    // The ESLint config can't run under ESLint 9 yet; don't let it block deploys
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
