import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "a6db-2a02-6680-2162-2711-a202-ee89-d562-f5c8.ngrok-free.app"
    ]
  }
})
