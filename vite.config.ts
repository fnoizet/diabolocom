import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  server: {
    host: 'localhost',
    port: 3000, // Port dev
  },
  preview: {
    host: 'localhost', // Host pour `vite preview`
    port: 4173, // Port pour `vite preview`
  },
  plugins: [
    tailwindcss(),
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  }
})
