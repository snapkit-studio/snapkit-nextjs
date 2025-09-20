const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@snapkit-studio/core", "@snapkit-studio/react", "@snapkit-studio/nextjs"],
  images: {
    remotePatterns: [
      {
        hostname: "snapkit-cdn.snapkit.studio",
      },
    ],
  },
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

module.exports = nextConfig;
