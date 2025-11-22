import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Fixed port
    strictPort: true,  // Don't try to find another port if 3000 is in use
    host: true,  // Listen on all network interfaces
    hmr: {
      port: 3000,  // Match the dev server port
    },
    proxy: {
      // Proxy API requests to the backend
      '/api': {
        target: 'https://api.iwacu250.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
})
