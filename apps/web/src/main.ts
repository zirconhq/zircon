import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'
import App from '#/src/App.vue'
import router from '#/src/router/index.js'
import '#/src/main.css'

const app = createApp(App)

app.use(router)

const queryClient = new QueryClient()
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')
