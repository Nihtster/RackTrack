import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Used by Storybook only; the web app bundles this package from source.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
