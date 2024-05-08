<template>
  <div
    class="editor"
    :class="{
      'editor--fullscreen': fullscreen
    }"
  >
    <ScTextareaMenu
      :compact="showCompactMenu"
      :fullscreen="fullscreen"
      @fullscreen:toggle="onFullscreenToggle"
    />
    <EditorContent
      :editor="editor"
      class="editor-content"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useVModel } from '@vueuse/core';
import type TextareaJSON from '@/models/sc/textarea/model';

type Props = {
  modelValue: TextareaJSON;
  placeholder: string;
  compact?: boolean;
}

type Emits = {
  (e: 'update:modelValue', value: string): void;
}

const editor = useEditor({
  extensions: [
    StarterKit,
  ],
  onUpdate: ({ editor }) => {
    value.value = editor.getJSON();
  },
});

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const value = useVModel(props, 'modelValue', emit);

const fullscreen = ref(false);

const showCompactMenu = computed(() => {
  if (fullscreen.value) {
    return false;
  } else {
    return props.compact;
  }
});

watch(value, () => {
  if (!isEqual(editor.value?.getJSON(), value.value)) {
    editor.value?.commands.setContent(value.value, false);
  }
})

function onFullscreenToggle() {
  fullscreen.value = !fullscreen.value;
}
</script>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.editor.editor--fullscreen {
  position: fixed;
  inset: 0;
  z-index: 1000000;
  background-color: var(--color-background-500);
  padding: 1rem;
}

.editor.editor--fullscreen .editor-content {
  height: 100%;
  background-color: var(--color-background-600)
}

.editor-content {
  display: flex;
  flex-direction: column;
  min-height: 5em;
  padding: 0.5em;
  background-color: var(--color-background-700);
  color: var(--color-foreground-500);
  border-bottom: 2px solid var(--color-background-400);
  border-radius: var(--border-radius);
  transition: var(--animation);
}

.editor-content:hover {
  background-color: var(--color-background-600);
}

.editor-content::v-deep(> .ProseMirror) {
  flex: 1 1 auto;
  margin: -1em 0;
}

.editor-content::v-deep(> .ProseMirror:focus) {
  outline: none;
}

.editor::v-deep(.editor-content:has(> .ProseMirror:focus)) {
  border-bottom-color: var(--color-primary-500);
}
</style>