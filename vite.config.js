import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true
    },
    hmr: {
      clientPort: 443
    },
    allowedHosts: [
      "siports-deploy.preview.emergentagent.com",  // Current deployment URL
      "siports-maritime.preview.emergentagent.com",
      "13099866-a689-4c8e-95cb-27f5e6358db4.preview.emergentagent.com",
      "bugfix-analyse.preview.emergentagent.com",
      "ccdbd87b-f928-491f-8b93-3a9ebfc2ec48.preview.emergentagent.com",
      "ec48b228-5fe8-445c-98da-33775eea8a9d.preview.emergentagent.com",
      "3af9f13b-c7da-4bc1-b1f4-89ae2ae52faa.preview.emergentagent.com",
      "maritime-events.preview.emergentagent.com",
      "4efe408b-c94a-400d-a866-c80c08ec5c16.preview.emergentagent.com",
      "localhost",
      "127.0.0.1",
      "0.0.0.0"
    ]
  }
})


