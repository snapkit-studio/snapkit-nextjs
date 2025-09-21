import { exec } from 'child_process';
import { defineConfig } from 'tsup';
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
});