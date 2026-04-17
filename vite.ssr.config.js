import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// SSR build config — used by `npm run build:ssr` and `npm run build:full`.
// Compiles src/entry-server.jsx to dist/server/entry-server.js for the
// Node.js pre-render script (prerender.mjs).
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/server',
    ssr: 'src/entry-server.jsx',
    rollupOptions: {
      output: {
        format: 'esm',
      },
    },
  },
  ssr: {
    // Bundle these instead of leaving as external requires so the
    // Node prerender script can resolve them without node_modules lookup.
    noExternal: ['react-router-dom', 'lucide-react'],
  },
})
