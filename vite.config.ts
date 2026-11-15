import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // In development, `npm run dev` forwards /api to the local server (`npm start` on :8787)
  server: { proxy: { '/api': 'http://localhost:8787' } },
  build: { sourcemap: false },
})
