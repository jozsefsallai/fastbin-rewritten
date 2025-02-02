import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/documents",
        destination: "/api/documents",
      },
      {
        source: "/documents/:key",
        destination: "/api/documents/:key",
      },
      {
        source: "/raw/:key",
        destination: "/api/documents/:key/raw",
      },
    ];
  },
};

export default nextConfig;
