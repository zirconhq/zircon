<script setup lang="ts">
import type { RouteRecordNameGeneric, RouteRecordRaw } from 'vue-router'
import { Icon } from "@iconify/vue";

defineProps<{
  availableRoutes: RouteRecordRaw[]
  currentRouteName?: RouteRecordNameGeneric
}>()

const emit = defineEmits<{
  select: [routeName?: RouteRecordNameGeneric]
}>()
</script>

<template>
  <nav>
    <ul>
      <li v-for="viewRoute in availableRoutes" :key="viewRoute.name" class="h-12"
        :class="currentRouteName === viewRoute.name ? 'bg-gray-100 text-gray-950' : 'text-gray-700'">
        <button class="flex h-full w-full items-center justify-center truncate text-sm hover:bg-gray-100" type="button"
          @click="emit('select', viewRoute.name)">
          <Icon v-if="viewRoute.meta?.icon" :icon="viewRoute.meta.icon" class="h-6 w-6 text-gray-700" />
        </button>
      </li>
    </ul>
  </nav>
</template>