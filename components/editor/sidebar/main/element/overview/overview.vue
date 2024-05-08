<template>
  <div class="elements-list">
    <header class="filter">
      <ScTooltip
        right
        no-wrap
        :tooltip="$t(settingsStore.sidebarMain.groupVariants ? 'elements.header.variants.group' : 'elements.header.variants.ungroup')"
      >
        <Icon
          :name="settingsStore.sidebarMain.groupVariants ? 'uil:layer-group-slash' : 'uil:layer-group'"
          class="pointer"
          @click="settingsStore.sidebarMain.groupVariants = !settingsStore.sidebarMain.groupVariants"
        />
      </ScTooltip>
      <ScTooltip
        left
        no-wrap
        :tooltip="$t('elements.header.filter.show')"
      >
        <Icon
          name="icon-park-solid:filter"
          class="pointer"
        />
      </ScTooltip>
    </header>
    <ScDetails
      :header="$t('elements.groups.favorites')"
      :open="true"
    >
      <div class="elements">
        <EditorSidebarMainElementIcon
          v-for="(element, index) of favorites"
          :key="index"
          :item="element"
          :group-variants="settingsStore.sidebarMain.groupVariants"
        />
      </div>
    </ScDetails>
    <ScDetails
      v-for="(group, index) of elements"
      :key="index"
      :header="$t(`elements.groups.${group.type}`)"
      :open="true"
    >
      <div class="elements">
        <EditorSidebarMainElementIcon
          v-for="(element, index) of group.elements"
          :key="index"
          :item="element"
          :group-variants="settingsStore.sidebarMain.groupVariants"
        />
      </div>
    </ScDetails>
  </div>
</template>

<script setup lang="ts">
  import { getGroups } from '../icon/models';
  import { useEditorSettingsStore } from '~~/store/settings';

  const settingsStore = useEditorSettingsStore();

  const elements = computed(() => getGroups());
  const favorites = computed(() => elements.value
  .flatMap(g => g.elements)
  .filter(e => e.favorite)
  .sort((a, b) => a.name.localeCompare(b.name)));
</script>

<style scoped>
.elements-list {
  max-height: 100%;
  overflow-y: auto;
}

.elements {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 0.5rem;
}

.filter {
  display: flex;
  justify-content: space-between;
  background-color: var(--color-background-700);
  border-radius: var(--border-radius);
  margin: 0.25rem;
  padding: 0.25rem;
}
</style>