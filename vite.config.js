import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_DOMINIO, // el backend
        changeOrigin: true,
        secure: true,
      },
    },
  },
});


