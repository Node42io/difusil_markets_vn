import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// Self-contained: the @node42/ui-kit source is vendored inside this repo at
// packages/ui-kit, so the report builds standalone (no sibling-folder dependency).
// The kit barrel (packages/ui-kit/src/index.ts) imports its tokens.css + globals.css
// automatically, so design tokens load with the components.
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Project Pages site lives under /difusil_markets_vn/ in production,
  // but dev/preview serves from the root so local routing stays at "/".
  base: command === 'build' ? '/difusil_markets_vn/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@node42/ui-kit': path.resolve(__dirname, './packages/ui-kit/src/index.ts'),
    },
    // Force a single copy of React across app + kit source,
    // otherwise you get "Invalid hook call" errors.
    dedupe: ['react', 'react-dom'],
  },
}))
