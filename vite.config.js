import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/aqi-dashboard-frontend/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://aqi-dashboard-api-nm04.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
