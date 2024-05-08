<template>
  <div
    ref="projectOverview"
    class="project-overview"
    @mousemove="onMouseMove"
    @mouseup.left="cancelResize"
    @mouseleave="cancelResize"
  >
    <ScDetails
      class="projects-list"
      :header="$t('main-sidebar.files.projects.header')"
    >
      <EditorSidebarMainProjectsList />
    </ScDetails>
    <hr
      class="resize-rule"
      @mousedown.left="onResizeMouseDown"
    >
    <ScDetails
      class="file-list"
      open
      :header="$t('main-sidebar.files.files.header')"
    >
      <EditorSidebarMainProjectFilesTree />
    </ScDetails>
  </div>
</template>

<script setup lang="ts">
import { useEditorSettingsStore } from '~~/store/settings';

const settingsStore = useEditorSettingsStore();

  const projectOverview = ref<HTMLDivElement>(null);
  const resize = ref(false);
  const projectsHeight = computed(() => settingsStore.sidebarMain.projectsHeight);

  function onResizeMouseDown() {
    resize.value = true;
  }

  function cancelResize() {
    resize.value = false;
  }

  function onMouseMove(event: MouseEvent) {
    if (resize.value) {
      const minHeight = 150;
      const boundingRect = projectOverview.value.getBoundingClientRect();
      const newHeight = Math.min(Math.max(minHeight, event.pageY - boundingRect.y), window.innerHeight - (minHeight + 80));
      settingsStore.sidebarMain.projectsHeight = newHeight;
    }
  }
</script>

<style scoped>
.project-overview {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  height: 100%;
}

.project-overview  .sc-details:first-child::v-deep(.sc-details-header) {
  padding-top: calc(var(--paddingTopBecauseLogo) + 0.25rem);
  height: calc(22px + var(--paddingTopBecauseLogo) + 0.25rem);
}

.projects-list[open] {
  height: calc(v-bind(projectsHeight) * 1px);
}

.file-list[open] {
  height: calc(100% - 22px);
}

.projects-list:not([open]) + .resize-rule  {
  display: none;
  pointer-events: none;
}

.projects-list[open] ~ .file-list[open] {
  height: calc(100% - (v-bind(projectsHeight) * 1px));
}

.resize-rule {
  display: block;
  margin: -1px 0;
  width: 100%;
  border: 2px solid var(--color-background-500);
  border-radius: 20000px;
  cursor: row-resize;
}

.resize-rule:hover {
  border-color: var(--color-secondary-500);
}
</style>