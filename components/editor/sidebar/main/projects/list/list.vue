<template>
  <ol class="projects-list">
    <EditorSidebarMainProjectsListEntry
      v-for="(project, index) of projects"
      :key="index"
      :item="project"
    />
    <li class="show-more">
      {{ $t('main-sidebar.files.projects.show-more') }}
    </li>
  </ol>
</template>

<script setup lang="ts">
import type { ProjectInfo } from './entry/entry.vue';

const projects = ref<ProjectInfo[]>([
  {
    name: 'Tasha\'s Cauldron of Everything',
    isOpen: true,
    isFavorite: false,
    isRecent: false
  },
  {
    name: 'Explorer\'s Guide to Wildemount',
    isOpen: false,
    isFavorite: true,
    isRecent: false
  },
  {
    name: 'Guildmasters\' Guide to Ravnica',
    isOpen: false,
    isFavorite: true,
    isRecent: false
  },
  {
    name: 'Mordenkainen Presents: Monsters of the Multiverse',
    isOpen: false,
    isFavorite: false,
    isRecent: true
  },
  {
    name: 'Xanathar\'s Guide to Everything',
    isOpen: false,
    isFavorite: false,
    isRecent: true
  },
  {
    name: 'Eberron: Rising from the Last War',
    isOpen: false,
    isFavorite: false,
    isRecent: false
  },
  {
    name: 'Curse of Strahd',
    isOpen: false,
    isFavorite: false,
    isRecent: false
  },
]);
</script>

<style scoped>
.projects-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  max-height: calc(100% - 22px);
  overflow-y: auto;
}

.show-more {
  padding: 0.2em 0.6em;
  display: flex;
  align-items: center;
  color: var(--color-foreground-700);
  cursor: pointer;
  justify-content: center;
  font-size: 0.8rem;
  font-style: italic;
  letter-spacing: 0.5px;
  text-transform: lowercase;
}

.show-more:hover {
  background-color: var(--color-background-400);
  color: var(--color-foreground-500);
}
</style>