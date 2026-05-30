import { defineConfig } from 'vite'

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
  },
})
