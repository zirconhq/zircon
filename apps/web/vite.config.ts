import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  clearScreen: false,
  plugins: [
    vue(),
    vueDevTools(),
  ],
})
