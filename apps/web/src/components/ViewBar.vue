<script setup lang="ts">
import type { RouteRecordNameGeneric, RouteRecordRaw } from 'vue-router'

defineProps<{
  availableRoutes: RouteRecordRaw[]
  currentRouteName?: RouteRecordNameGeneric
}>()

const emit = defineEmits<{
  select: [routeName?: RouteRecordNameGeneric]
}>()
</script>

<template>
  <nav class="h-full w-14 border-r border-gray-300 py-3">
    <ul class="space-y-1 px-2">
      <li v-for="viewRoute in availableRoutes" :key="viewRoute.name">
        <button
          class="w-full truncate rounded px-2 py-1 text-left text-sm hover:bg-gray-100"
          :class="currentRouteName === viewRoute.name ? 'bg-gray-100 text-gray-950' : 'text-gray-700'"
          type="button"
          @click="emit('select', viewRoute.name)"
        >
          {{ viewRoute.meta?.name }}
        </button>
      </li>
    </ul>
  </nav>
</template>