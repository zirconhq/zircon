import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/explorer/:resourceUri(.*)?',
      name: 'explorer',
      component: () => import('#/src/views/Explorer.vue'),
      props: (route) => ({
        resourceUri: route.params.resourceUri,
      }),
    },
  ],
})

export default router
