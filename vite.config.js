import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Load env variables based on the mode (e.g., development, production)
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': {
          target: 'https://cosmosodyssey.azurewebsites.net',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api/v1.0'),
        },
      },
    },
  }
})
