import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// The client never hardcodes catalogue data — every request goes through
// this proxy to the Express API on :5000.
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(process.cwd(), 'src') } },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
});
