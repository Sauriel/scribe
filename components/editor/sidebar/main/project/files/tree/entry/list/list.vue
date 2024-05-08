<template>
  <ol class="tree-list">
    <EditorSidebarMainProjectFilesTreeEntry
      v-for="(item, index) of items"
      :key="index"
      :item="item"
      :level="level"
    />
  </ol>
</template>

<script setup lang="ts">
  import type { FileOrFolder } from '../entry.vue';

  type Props = {
    items: FileOrFolder[];
    level?: number;
  }

  const props = withDefaults(
    defineProps<Props>(),
    {
      items: () => [],
      level: 0
    });
</script>

<style scoped>
.tree-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>