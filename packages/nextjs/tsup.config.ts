import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  external: [
    // React and React DOM should be external (peer dependencies)
    'react',
    'react-dom',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',

    // Next.js should be external (peer dependency)
    'next',
    'next/image',
    'next/head',
    'next/router',
    'next/navigation',

    // Other workspace packages that should remain external
    '@snapkit-studio/core',
    '@snapkit-studio/react',

    // Node.js built-ins
    'fs',
    'path',
    'url',
    'querystring',
  ],

  // Ensure JSX is preserved for React
  esbuildOptions(options) {
    options.jsx = 'automatic';
    // Preserve 'use client' directives by keeping them as strings
    options.banner = {};
  },

  // Keep function names
  keepNames: true,

});
