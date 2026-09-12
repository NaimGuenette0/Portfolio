import type { NextConfig } from "next";

export const apiDomain = "https://localhost:7127/";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  }
};

export default nextConfig;
