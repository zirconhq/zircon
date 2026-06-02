import { defineConfig } from 'vite'

import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  clearScreen: false,
  build: {
    emptyOutDir: false,
    outDir: 'dist',
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        ...Object.keys(packageJson.peerDependencies),
      ],
    },
  },
})
