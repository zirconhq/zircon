<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import type { Resource } from '@zircon/core'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'

import AsyncContent from '#/src/components/AsyncContent.vue'
import Grid from '#/src/components/Grid.vue'
import MarkdownViewer from '#/src/components/MarkdownViewer.vue'
import TextViewer from '#/src/components/TextViewer.vue'
import { useResourceContent } from '#/src/composables/useResourceContent.js'

const props = defineProps<{
  resourceUri?: string
  isSidebarOpen?: boolean
}>()

const selectedResourceUri = computed(() => props.resourceUri ?? null)
const selectedResource = computed<Resource | null | undefined>(() => {
  if (selectedResourceUri.value == null) {
    return null
  }

  return resourcesQuery.data.value?.find((candidate) =>
    candidate.uri === selectedResourceUri.value,
  )
})

const resourcesQuery = useQuery({
  queryKey: ['resources'],
  queryFn: async () => {
    const response = await fetch('/api/resources')

    if (!response.ok) {
      throw new Error('Resources could not be loaded')
    }

    return await response.json() as Resource[]
  },
})

const {
  content,
  hasChanges,
  discardChanges,
  data: loadedContent,
  error: loadError,
  isLoading,
  isSavePending,
  isMarkdownResource,
  saveErrorMessage,
  saveResourceContent,
} = useResourceContent(selectedResource)

onBeforeRouteUpdate(() => {
  discardChanges()
})

const router = useRouter()
const openResource = async (resource: Resource): Promise<void> => {
  await router.push({
    name: 'explorer',
    params: {
      resourceUri: resource.uri,
    },
  })
}
</script>

<template>
  <Grid class="h-full min-h-0 overflow-hidden">
      <aside v-if="props.isSidebarOpen !== false" class="h-full min-h-0 overflow-y-auto border-r border-gray-300 p-4 w-72">
        <h1 class="mb-3 text-sm font-semibold text-gray-950">Resources</h1>
        <AsyncContent
          :data="resourcesQuery.data.value"
          :error="resourcesQuery.error.value"
          :is-loading="resourcesQuery.isPending.value"
        >
            <template #default="{ data }">
              <ul class="space-y-1">
                <li v-for="resource in data" :key="`${resource.uri}`" :data-uri="resource.uri">
                  <button
                    class="w-full truncate rounded px-2 py-1 text-left text-sm hover:bg-gray-100"
                    :class="resource.uri === selectedResource?.uri ? 'bg-gray-100 text-gray-950' : 'text-gray-700'"
                    @click="openResource(resource)"
                  >
                    {{ resource.name }}
                  </button>
                </li>
              </ul>
            </template>
        </AsyncContent>
      </aside>
      <main class="min-w-0 h-full min-h-0 overflow-y-auto p-6">
        <template v-if="selectedResource === null">
          <p class="text-sm text-gray-500">Select a resource to view its content</p>
        </template>
        <template v-else>
          <header class="mb-4 flex items-start justify-between gap-4 border-b border-gray-200 pb-3">
            <div class="min-w-0">
              <h2 class="truncate text-lg font-semibold text-gray-950">{{ selectedResource?.name }}</h2>
              <p class="truncate text-sm text-gray-500">{{ selectedResource?.uri }}</p>
            </div>
            <button
              class="inline-flex shrink-0 items-center gap-2 rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!hasChanges || isSavePending"
              type="button"
              @click="saveResourceContent"
            >
              <Icon icon="lucide:save" class="h-4 w-4" />
              {{ isSavePending ? 'Saving...' : 'Save' }}
            </button>
          </header>
          <p v-if="saveErrorMessage" class="mb-3 text-sm text-red-600">
            {{ saveErrorMessage }}
          </p>
          <AsyncContent
            :data="loadedContent"
            :error="loadError"
            :is-loading="isLoading"
          >
            <MarkdownViewer
              v-if="isMarkdownResource"
              :content
              @update:content="content = $event"
            />
            <TextViewer v-else :content />
          </AsyncContent>
        </template>
      </main>
  </Grid>
</template>
