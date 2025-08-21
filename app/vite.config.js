import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/mandalminds/', // GitLab Pages base path (repository name)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser', // Fast minification
    sourcemap: false, // Disable sourcemaps for speed
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    host: true
  },
})
