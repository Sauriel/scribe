<template>
  <li
    class="tree-list-entry"
    :class="{
      'expanded': open,
      'selected': item.name === 'File 5' && level === 0
    }"
  >
    <div
      class="file-or-folder"
      :class="isFolder ? 'folder' : 'file'"
      @click="onFileOrFolderClick"
    >
      <span class="expand-icon">
        <Icon
          v-if="isFolder && children.length > 0"
          name="charm:chevron-right"
        />
      </span>
      <Icon :name="icon" />
      {{ item.name }}
    </div>
    <EditorSidebarMainProjectFilesTreeEntryList
      v-if="showChildren"
      :items="children"
      :level="level + 1"
    />
  </li>
</template>

<script setup lang="ts">
  export type FileOrFolder = {
    name: string;
    children?: FileOrFolder[]
  }

  type Props = {
    item: FileOrFolder;
    level: number;
  }

  const props = defineProps<Props>();

  const open = ref(false);

  const isFolder = computed(() => !!props.item.children);
  const children = computed(() => props.item.children || []);
  const icon = computed(() => {
    if (isFolder.value) {
      return open.value ? 'mdi:folder-open' : 'mdi:folder';
    } else {
      return 'mdi:file-document';
    }
  });
  const showChildren = computed(() => isFolder.value && open.value);

  function onFileOrFolderClick() {
    if (isFolder.value) {
      open.value = !open.value;
    }
  }
</script>

<style scoped>
.file-or-folder {
  --basePadding: 0.25em;
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: var(--basePadding) calc(var(--basePadding) / 2);
  padding-left: calc(1ch * v-bind(level) + var(--basePadding));
  cursor: pointer;
}

.file-or-folder:hover {
  background-color: var(--color-background-400);
  color: var(--color-foreground-500);
}

.expand-icon {
  display: inline-block;
  width: 1em;
  transition: transform var(--animation);
  font-size: 0.8em
}

.tree-list-entry.expanded > .folder .expand-icon {
  transform: rotate(90deg);
}

.tree-list-entry.selected > .file-or-folder {
  color: var(--color-foreground-500);
  font-weight: bold;
}
</style>