import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@auth': path.resolve(__dirname, './src/auth'),
      '@machines': path.resolve(__dirname, './src/machines'),
      '@onboarding': path.resolve(__dirname, './src/onboarding'),
      '@planner': path.resolve(__dirname, './src/planner'),
      '@admin': path.resolve(__dirname, './src/admin'),
      '@shared': path.resolve(__dirname, './shared'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html'),
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['.ngrok-free.dev', '.ngrok.io'],
  },
});
