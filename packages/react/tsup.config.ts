import fs from 'fs/promises';
import { defineConfig } from 'tsup';

// Simple post-build function to add 'use client' directive to React components and hooks
const addUseClientDirective = async () => {
  // Add 'use client' to entry files that contain React components or hooks
  // index.ts exports the Image component and hooks
  // image.ts exports only the Image component
  // utils.ts contains only pure utilities, so no 'use client' needed
  const files = [
    'dist/index.js',
    'dist/index.mjs',
    'dist/image.js',
    'dist/image.mjs',
    // utils files excluded - they're pure utilities
  ];

  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf-8');
      // Skip if directive already present
      if (
        !content.startsWith("'use client'") &&
        !content.startsWith('"use client"')
      ) {
        // For CJS, add after 'use strict' if present
        if (file.endsWith('.js') && content.startsWith("'use strict'")) {
          const newContent = content.replace(
            "'use strict';",
            "'use strict';\n'use client';",
          );
          await fs.writeFile(file, newContent);
        } else {
          // For ESM or no 'use strict', add at the beginning
          await fs.writeFile(file, `'use client';\n${content}`);
        }
        console.log(`Added 'use client' directive to ${file}`);
      }
    } catch (error) {
      console.warn(`Could not process ${file}:`, error);
    }
  }
};

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    image: 'src/image.ts',
    utils: 'src/utils.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: true, // Enable code splitting for better bundle optimization
  treeshake: true,
  minify: process.env.NODE_ENV === 'production',
  sourcemap: true,
  external: ['react', 'react-dom'],

  esbuildOptions(options) {
    options.conditions = ['import', 'module', 'require'];
    options.platform = 'browser';
    options.mainFields = ['module', 'main'];
    options.drop =
      process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [];
  },

  onSuccess: async () => {
    await addUseClientDirective();
    console.log('Build completed successfully');
  },
});
