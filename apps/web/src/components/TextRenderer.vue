<script setup lang="ts">
defineProps<{
  content?: string | null
}>()
</script>

<template>
  <pre
    class="overflow-auto text-sm text-gray-800 whitespace-pre-wrap"
  >{{ content }}</pre>
</template>
