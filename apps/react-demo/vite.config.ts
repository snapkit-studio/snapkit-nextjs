import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@snapkit-studio/core', '@snapkit-studio/react'],
  },
});
