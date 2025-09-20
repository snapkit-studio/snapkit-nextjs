import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@snapkit-studio/core', '@snapkit-studio/react'],
  },
  server: {
    fs: {
      allow: ['..'],
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
    hmr: {
      overlay: true,
    },
  },
});
