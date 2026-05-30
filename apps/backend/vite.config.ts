import { builtinModules } from 'node:module'

import { defineConfig } from 'vite'

export default defineConfig({
  clearScreen: false,
  build: {
    emptyOutDir: false,
    target: 'esnext',
    outDir: 'dist',
    lib: {
      entry: {
        main: 'src/main.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map((module) => `node:${module}`)
      ],
    },
  },
})
