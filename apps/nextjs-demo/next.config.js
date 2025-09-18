/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable for potential performance improvements
    turbo: true,
  },
  transpilePackages: ['@snapkit-studio/core', '@snapkit-studio/react', '@snapkit-studio/nextjs'],
};

module.exports = nextConfig;