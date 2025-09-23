/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@snapkit-studio/core',
    '@snapkit-studio/react',
    '@snapkit-studio/nextjs',
  ],
  images: {
    // Disable Next.js Image Optimization to test Snapkit
    unoptimized: true,
  },
};

module.exports = nextConfig;
