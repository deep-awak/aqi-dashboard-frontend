import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'https://aqi-dashboard-api-nm04.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
