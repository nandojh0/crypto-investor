import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/api': {
        target: process.env.API_DOMINIO, // el backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});


