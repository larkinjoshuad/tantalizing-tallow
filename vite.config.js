import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  ssr: {
    // Bundle these into the SSR build rather than leaving as external requires.
    // Required so the Node pre-render script can resolve them correctly.
    noExternal: ['react-router-dom', 'lucide-react'],
  },
})