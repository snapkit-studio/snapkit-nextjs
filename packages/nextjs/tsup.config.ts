import { defineConfig } from 'tsup';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
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
  },
  onSuccess: async () => {
    // Check for workspace references after build
    console.log('🔍 Checking for workspace references...');
    try {
      await execAsync('node ../../scripts/check-workspace-refs.js package.json');
      console.log('✅ No workspace references in production dependencies');
    } catch (error) {
      console.error('❌ Build validation failed: workspace references found');
      console.error('Please update dependencies to use specific versions instead of workspace:*');
      process.exit(1);
    }
  }
});