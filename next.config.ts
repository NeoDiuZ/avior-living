import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/cart/:path*",
        destination: "https://bwrnnn-iw.myshopify.com/cart/:path*",
      },
      {
        source: "/checkouts/:path*",
        destination: "https://bwrnnn-iw.myshopify.com/checkouts/:path*",
      },
    ];
  },
};

export default nextConfig;
