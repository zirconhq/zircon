<script setup lang="ts" generic="TData">

type AsyncError = Error | string | null | undefined

defineProps<{
  data: TData
  error?: AsyncError
  isLoading: boolean
}>()

defineSlots<{
  default(props: { data: TData }): unknown
  loading(): unknown
  error(props: { error: AsyncError }): unknown
}>()
</script>

<template>
  <slot v-if="isLoading" name="loading">
    <p class="text-sm text-gray-500">Loading...</p>
  </slot>
  <slot
    v-else-if="error"
    name="error"
    :error="error"
  >
    <p class="text-sm text-red-600">{{ error }}</p>
  </slot>
  <slot v-else :data="data" />
</template>
