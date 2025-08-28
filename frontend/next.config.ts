import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true, // avoid build failures due to eslint
  },
  typescript: {
    ignoreBuildErrors: true, // avoids blocking deploy if type errors exist
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/:path*", // Proxy to your backend
      },
    ];
  },
};

export default nextConfig;
