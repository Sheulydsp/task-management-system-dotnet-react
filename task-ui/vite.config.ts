import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // optional but good
    proxy: {
      '/api': {
        target: 'http://localhost:5152',
        changeOrigin: true,
        secure: false
      }
    }
  }
})