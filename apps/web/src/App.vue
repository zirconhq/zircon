<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, useRoute, useRouter, type RouteRecordNameGeneric } from 'vue-router'

import ViewBar from '#/src/components/ViewBar.vue'
import { viewRoutes } from '#/src/router/index.js'

const route = useRoute()
const router = useRouter()
const isExplorerSidebarOpen = ref(true)

const currentRouteName = computed(() =>
    typeof route.name === 'string' ? route.name : undefined,
)

const openView = async (routeName?: RouteRecordNameGeneric): Promise<void> => {
    if (routeName === 'explorer' && route.name === 'explorer') {
        isExplorerSidebarOpen.value = !isExplorerSidebarOpen.value
        return
    }

    if (routeName === 'explorer') {
        isExplorerSidebarOpen.value = true
    }

    if (routeName === route.name) return
    await router.push({ name: routeName })
}
</script>

<template>
    <div class="flex h-dvh">
        <ViewBar :available-routes="viewRoutes" :current-route-name="currentRouteName" @select="openView"
            class="h-full w-14 shrink-0 border-r border-gray-300" />
        <div>
            <RouterView v-slot="{ Component }">
                <component
                    :is="Component"
                    :resource-uri="route.params.resourceUri"
                    :is-sidebar-open="isExplorerSidebarOpen"
                />
            </RouterView>
        </div>
    </div>
</template>
