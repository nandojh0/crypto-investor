import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'secure-caring-production.up.railway.app', // el backend
        changeOrigin: true,
        secure: true,
      },
    },
  },
});


