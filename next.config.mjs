/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Hosts that next/image may load from
    remotePatterns: [{ protocol: "https", hostname: "sayed3040.sobhoy.com" }],
  },
  eslint: {
    // The ESLint config can't run under ESLint 9 yet; don't let it block deploys
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
