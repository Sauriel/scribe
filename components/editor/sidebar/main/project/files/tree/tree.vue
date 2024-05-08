<template>
  <div class="files-tree">
    <EditorSidebarMainProjectFilesTreeEntryList :items="files" />
  </div>
</template>

<script setup lang="ts">
  import type { FileOrFolder } from './entry/entry.vue';

  const files = ref<FileOrFolder[]>([
    { name: 'File 1' },
    { name: 'File 2' },
    { name: 'File 3' },
    {
      name: 'Folder 1',
      children: [
        { name: 'File 1' },
        { name: 'File 2' },
        { name: 'File 3' },
      ]
    },
    { name: 'File 4' },
    { name: 'File 5' },
    {
      name: 'Folder 2',
      children: [
        { name: 'File 1' },
        {
          name: 'Folder 1',
          children: [
            { name: 'File 1' },
            { name: 'File 2' },
            { name: 'File 3' },
          ]
        },
        { name: 'File 2' },
      ]
    },
    {
      name: 'Folder 3',
      children: [
        { name: 'File 1' },
        { name: 'File 2' },
        { name: 'File 3' },
      ]
    },
    {
      name: 'Folder 4',
      children: [
        { name: 'File 1' },
        { name: 'File 2' },
        { name: 'File 3' },
        {
          name: 'Folder 1',
          children: [
            { name: 'File 1' },
            { name: 'File 2' },
            { name: 'File 3' },
          ]
        },
        { name: 'File 4' },
        { name: 'File 5' },
        {
          name: 'Folder 2',
          children: [
            { name: 'File 1' },
            {
              name: 'Folder 1',
              children: [
                { name: 'File 1' },
                { name: 'File 2' },
                { name: 'File 3' },
              ]
            },
            { name: 'File 2' },
          ]
        },
        {
          name: 'Folder 3',
          children: [
            { name: 'File 1' },
            { name: 'File 2' },
            { name: 'File 3' },
          ]
        },
      ]
    }
  ]);
</script>

<style scoped>
.files-tree {
  font-size: 0.9rem;
  max-height: calc(100% - 22px);
  overflow-y: auto;
  color: var(--color-foreground-700);
}
</style>