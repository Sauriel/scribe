<template>
  <div
    class="main-sidebar"
    :class="{
      'mini': settingsStore.sidebarMain.mini
    }"
  >
    <div class="sidebar-nav">
      <ol class="icon-list">
        <ScTooltip
          tag="li"
          no-wrap
          right
          :tooltip="$t('main-sidebar.menu.files.tooltip')"
          class="list-entry"
          :class="{ 'selected': settingsStore.sidebarMain.selection === 'projects' }"
          @click="onClick('projects')"
        >
          <Icon name="fa6-solid:folder-tree" />
        </ScTooltip>
        <ScTooltip
          tag="li"
          no-wrap
          right
          :tooltip="$t('main-sidebar.menu.elements.tooltip')"
          class="list-entry"
          :class="{ 'selected': settingsStore.sidebarMain.selection === 'elements' }"
          @click="onClick('elements')"
        >
          <Icon name="material-symbols:add-notes" />
        </ScTooltip>
      </ol>
    </div>
    <div
      v-if="!settingsStore.sidebarMain.mini"
      class="sidebar-content"
    >
      <EditorSidebarMainProjectOverview v-if="settingsStore.sidebarMain.selection === 'projects'" />
      <EditorSidebarMainElementOverview v-if="settingsStore.sidebarMain.selection === 'elements'" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { SidebarComponent } from '~~/store/settings';
  import { useEditorSettingsStore } from '~~/store/settings';

  const settingsStore = useEditorSettingsStore();

  function onClick(component: SidebarComponent) {
    if (settingsStore.sidebarMain.selection === component) {
      if (settingsStore.sidebarMain.mini) {
        settingsStore.sidebarMain.mini = false;
      } else {
        settingsStore.sidebarMain.mini = true;
      }
    } else {
      settingsStore.sidebarMain.selection = component;
      settingsStore.sidebarMain.mini = false;
    }
  }
</script>

<style scoped>
.main-sidebar {
  --miniSidebarWidth: 2.5rem;
  --paddingTopBecauseLogo: 0.5rem;

  display: flex;
  width: 250px;
  height: 100%;
  border-right: 1px solid var(--color-background-700);
  background-color: var(--color-background-600);
  position: relative;
  font-size: 0.75rem;
}

.main-sidebar.mini {
  width: var(--miniSidebarWidth);
}

.main-sidebar::before {
  content: "";
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--color-background-500);
}

.main-sidebar::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--color-background-500);
}

.sidebar-nav {
  flex: 0 0 auto;
  width: var(--miniSidebarWidth);
  background-color: var(--color-background-500);
  padding-top: var(--paddingTopBecauseLogo);
}

.icon-list {
  list-style: none;
  padding: 2px;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25em;
}

.list-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1 / 1;
  font-size: 1rem;
  color: var(--color-foreground-700);
  border-radius: var(--border-radius);
  cursor: pointer;
}

.list-entry:hover {
  background-color: var(--color-background-400);
  color: var(--color-foreground-500);
}

.list-entry.selected {
  color: var(--color-foreground-500);
  position: relative;
}

.list-entry.selected::before {
  --indicatorWidth: 3px;
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -2px;
  width: var(--indicatorWidth);
  background-color: var(--color-foreground-500);
  border-top-right-radius: var(--indicatorWidth);
  border-bottom-right-radius: var(--indicatorWidth);
}

.sidebar-content {
  flex: 1 1 auto;
  width: 100%;
  max-width: calc(100% - var(--miniSidebarWidth));
  display: flex;
  flex-direction: column;
}
</style>