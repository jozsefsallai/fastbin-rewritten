import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Not entirely sure why this is needed now, but okay
  outputFileTracingExcludes: {
    "*": ["**/.pnpm-store/**", "**/node_modules/.pnpm-store/**", "**/.git/**"],
  },
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
