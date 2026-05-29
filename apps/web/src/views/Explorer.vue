<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import type { Resource } from '@appcited/james-core'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import AsyncContent from '#/src/components/AsyncContent.vue'
import Grid from '#/src/components/Grid.vue'
import TextRenderer from '#/src/components/TextRenderer.vue'
import ViewBar from '#/src/components/ViewBar.vue'

const props = defineProps<{
  resourceUri?: string
}>()

const router = useRouter()

const selectedResource = computed<Resource | null | undefined>(() => {
  if (props.resourceUri == null) {
    return null
  }

  return resourcesQuery.data.value?.find((candidate) =>
    candidate.uri === props.resourceUri,
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

const resourceContentQuery = useQuery({
  queryKey: ['resource-content', selectedResource.value?.uri],
  queryFn: async () => {
    if (selectedResource.value == null) {
      throw new Error('Selected resource could not be found')
    }

    const response = await fetch(`/api${selectedResource.value.uri}`)

    if (!response.ok) {
      throw new Error('Resource content could not be loaded')
    }

    return await response.text()
  },
  enabled: () => selectedResource.value != null,
  retry: false,
})

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
  <div class="flex h-dvh">
    <ViewBar />
    <Grid class="h-full">
      <aside class="w-72 border-r border-gray-300 p-4">
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
      <main class="min-w-0 p-6">
        <template v-if="selectedResource === null">
          <p class="text-sm text-gray-500">Select a resource to view its content</p>
        </template>
        <template v-else>
          <header class="mb-4 border-b border-gray-200 pb-3">
            <h2 class="text-lg font-semibold text-gray-950">{{ selectedResource?.name }}</h2>
            <p class="text-sm text-gray-500">{{ selectedResource?.uri }}</p>
          </header>
          <AsyncContent
            :data="resourceContentQuery.data.value"
            :error="resourceContentQuery.error.value"
            :is-loading="resourceContentQuery.isPending.value"
          >
            <template #default="{ data }">
              <TextRenderer :content="data" />
            </template>
          </AsyncContent>
        </template>
      </main>
    </Grid>
  </div>
</template>
