import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Resource } from '@zircon/core'
import { computed, ref, type ComputedRef } from 'vue'

const resourceContentQueryKey = (resourceUri: string | null) => ['resource-content', resourceUri] as const

export const useResourceContent = (resource: ComputedRef<Resource | null | undefined>) => {
  const queryClient = useQueryClient()
  const editedContent = ref<string | null>(null)

  const query = useQuery({
    queryKey: computed(() => resourceContentQueryKey(resource.value?.uri ?? null)),
    queryFn: async () => {
      if (resource.value == null) {
        throw new Error('Selected resource could not be found')
      }

      const response = await fetch(`/api${resource.value.uri}`)

      if (!response.ok) {
        throw new Error('Resource content could not be loaded')
      }

      return await response.text()
    },
    enabled: computed(() => resource.value != null),
    retry: false,
  })

  const savedContent = computed(() => query.data.value ?? '')
  const content = computed({
    get: () => editedContent.value ?? savedContent.value,
    set: (content: string) => {
      editedContent.value = content
    },
  })
  const contentType = computed(() =>
    resource.value?.contentType.split(';')[0]?.toLowerCase() ?? '',
  )
  const isMarkdownResource = computed(() => contentType.value === 'text/markdown')
  const hasChanges = computed(() =>
    isMarkdownResource.value &&
    editedContent.value != null &&
    editedContent.value !== savedContent.value,
  )

  const saveMutation = useMutation({
    mutationFn: async (content: string) => {
      const resourceUri = resource.value?.uri

      if (resourceUri == null) {
        throw new Error('Selected resource could not be found')
      }

      const response = await fetch(`/api${resourceUri}`, {
        body: content,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
        method: 'PUT',
      })

      if (!response.ok) {
        throw new Error('Resource content could not be saved')
      }

      return resourceUri
    },
    onSuccess: (resourceUri, content) => {
      queryClient.setQueryData(resourceContentQueryKey(resourceUri), content)

      if (resourceUri === resource.value?.uri) {
        editedContent.value = null
      }
    },
  })

  const saveErrorMessage = computed(() => {
    const error = saveMutation.error.value

    return error instanceof Error ? error.message : error
  })
  const isSavePending = computed(() => saveMutation.isPending.value)

  const discardChanges = (): void => {
    editedContent.value = null
    saveMutation.reset()
  }

  const saveResourceContent = async (): Promise<void> => {
    if (
      resource.value == null ||
      !hasChanges.value ||
      isSavePending.value
    ) {
      return
    }

    await saveMutation.mutateAsync(content.value)
  }

  return {
    discardChanges,
    content,
    data: query.data,
    error: query.error,
    hasChanges,
    isLoading: query.isPending,
    isSavePending,
    isMarkdownResource,
    saveErrorMessage,
    saveResourceContent,
  }
}
