import { defineConfig } from 'tsup';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
  sourcemap: true,
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

    if (process.env.ANALYZE) {
      console.log('📊 Bundle analysis available in dist/metafile.json');
    }
  }
});