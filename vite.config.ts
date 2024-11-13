import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        blocked: resolve(__dirname, 'src/pages/blocked.html'),
        background: resolve(__dirname, 'src/background/service-worker.ts')
      },
      output: {
        entryFileNames: chunk => {
          return chunk.name === 'background' ? 'background/[name].js' : '[name].js';
        }
      }
    },
    outDir: 'dist',
    sourcemap: true
  },
  optimizeDeps: {
    exclude: ['chrome-types']
  }
});