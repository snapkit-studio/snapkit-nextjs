import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    image: 'src/image.ts',
    utils: 'src/utils.ts'
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
  minify: process.env.NODE_ENV === 'production',
  sourcemap: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.conditions = ['import', 'module', 'require'];
    options.platform = 'neutral';
    options.mainFields = ['module', 'main'];
    options.drop = process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [];
  },
  // Bundle size optimization
  metafile: true,
  onSuccess: async () => {
    if (process.env.ANALYZE) {
      console.log('📊 Bundle analysis available in dist/metafile.json');
    }
  }
});