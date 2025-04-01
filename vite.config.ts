import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  return {
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
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('cc-')
          }
        }
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    build: {
      target: 'esnext',
      sourcemap: false,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        }
      },
      ...(mode === "lib"
        ? {
          outDir: './dist/lib',
          lib: {
            entry: "src/web-components/notification/notificationWidget.ts",
            formats: ["es"],
            fileName: (format) => `notification-widget.${format}.mjs`
          }
        }
        : {
          outDir: './dist',
          rollupOptions: {
            input: "index.html" // Permet à Vite de servir un HTML pour les tests E2E
          }
        }
      ),
      minify: "terser",
      terserOptions: {
        compress: true,
        mangle: true,
        format: {
          comments: false
        }
      },
    },
    define: {
      'process.env.NODE_ENV': '"production"',
    }
  }
})
