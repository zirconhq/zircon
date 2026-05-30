<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute, useRouter, type RouteRecordNameGeneric } from 'vue-router'

import ViewBar from '#/src/components/ViewBar.vue'
import { viewRoutes } from '#/src/router/index.js'

const route = useRoute()
const router = useRouter()

const currentRouteName = computed(() =>
    typeof route.name === 'string' ? route.name : undefined,
)

const openView = async (routeName?: RouteRecordNameGeneric): Promise<void> => {
    if (routeName === route.name) return
    await router.push({ name: routeName })
}
</script>

<template>
    <div class="flex h-dvh">
        <ViewBar :available-routes="viewRoutes" :current-route-name="currentRouteName" @select="openView"
            class="h-full w-14 shrink-0 border-r border-gray-300" />
        <div>
            <RouterView />
        </div>
    </div>
</template>
