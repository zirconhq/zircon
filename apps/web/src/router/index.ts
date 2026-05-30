import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'

export const viewRoutes: RouteRecordRaw[] = [
  {
    path: '/explorer/:resourceUri(.*)?',
    name: 'explorer',
    meta: {
      name: 'Explorer',
      icon: 'lucide:file',
    },
    component: () => import('#/src/views/Explorer.vue'),
    props: (route) => ({
      resourceUri: route.params.resourceUri,
    }),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: viewRoutes,
})

export default router
