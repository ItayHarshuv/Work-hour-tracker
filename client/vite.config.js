import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Emit build output to repo-root `dist/` so Vercel can
    // use the default Vite settings (Output Directory: `dist`).
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
})
