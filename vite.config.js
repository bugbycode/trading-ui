import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base:'/web',
  plugins: [
    vue(),
  ],
  resolve: { 
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },server: {
    proxy: {
      '/user': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },'/shape': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },'/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },'/logout': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },'/tradingview': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
