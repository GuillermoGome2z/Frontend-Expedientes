import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0', // Permite acceso desde fuera del contenedor Docker
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // Necesario para hot reload en Docker
      interval: 100,
    },
    hmr: {
      overlay: true,
    },
  },
})
