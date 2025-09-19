import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "snapkit-cdn.snapkit.studio",
      },
    ],
  },

  pageExtensions: ["ts", "tsx", "js", "jsx"],
};

export default nextConfig;
