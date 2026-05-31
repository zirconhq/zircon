<script setup lang="ts">
import { markdown } from '@codemirror/lang-markdown'
import { EditorView, minimalSetup } from 'codemirror'
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

const props = withDefaults(defineProps<{
  content?: string
}>(), {
  content: '',
})

const emit = defineEmits<{
  'update:content': [content: string]
}>()

const editorElement = ref<HTMLDivElement | null>(null)
const editorView = shallowRef<EditorView | null>(null)

onMounted(() => {
  if (editorElement.value == null) return

  editorView.value = new EditorView({
    doc: props.content,
    extensions: [
      minimalSetup,
      markdown(),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (!update.docChanged) return
        const content = update.state.doc.toString()
        if (content === props.content) return

        emit('update:content', content)
      }),
    ],
    parent: editorElement.value,
  })
})

watch(() => props.content, (content) => {
  if (editorView.value == null) return
  if (editorView.value.state.doc.toString() === content) return
  
  editorView.value.dispatch({
    changes: {
      from: 0,
      to: editorView.value.state.doc.length,
      insert: content,
    },
  })
})

onBeforeUnmount(() => {
  editorView.value?.destroy()
})
</script>

<template>
  <div ref="editorElement" class="markdown-viewer" />
</template>

<style scoped>
.markdown-viewer {
  &:deep(.cm-editor),
  &:deep(.cm-scroller) {
    font-family: inherit;
  }

  &:deep(.cm-editor.cm-focused) {
    outline: none;
  }

  &:deep(.cm-line) {
    padding: 0;
  }
}
</style>
