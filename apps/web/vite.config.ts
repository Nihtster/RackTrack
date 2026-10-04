import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// GitHub Pages serves this repo under /RackTrack/, so production builds need
// that as the base path. Local dev stays at root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/RackTrack/' : '/',
  plugins: [react(), tailwindcss()],
}))
