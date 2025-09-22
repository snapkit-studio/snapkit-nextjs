const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@snapkit-studio/core", "@snapkit-studio/react", "@snapkit-studio/nextjs"],
  images: {
    localPatterns: [
      {
        pathname: "/landing-page/**",
        search: "",
      },
    ],
    remotePatterns: [
      {
        hostname: "snapkit-cdn.snapkit.studio",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

module.exports = nextConfig;
