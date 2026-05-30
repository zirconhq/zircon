import { defineConfig } from 'vite'

export default defineConfig({
  clearScreen: false,
  build: {
    outDir: 'dist',
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      formats: ['es'],
    },
  },
})
