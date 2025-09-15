/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable for potential performance improvements
    turbo: true,
  },
  transpilePackages: ['@snapkit/core', '@snapkit/react', '@snapkit/nextjs'],
};

module.exports = nextConfig;