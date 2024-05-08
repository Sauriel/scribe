<template>
  <li
    class="project"
    :class="{
      'open': item.isOpen,
      'favorite': item.isFavorite,
      'recent' : item.isRecent
    }"
  >
    <Icon :name="icon" />
    <span class="project-name">
      {{ item.name }}
    </span>
    <span class="actions">
      <Icon
        :name="item.isFavorite ? 'mdi:heart' : 'mdi:heart-outline'"
        class="fav"
      />
    </span>
  </li>
</template>

<script setup lang="ts">
  export type ProjectInfo = {
    name: string;
    isOpen: boolean;
    isFavorite: boolean;
    isRecent: boolean;
  }

  type Props = {
    item: ProjectInfo
  }

  const props = defineProps<Props>();

  const icon = computed(() => {
    if (props.item.isOpen) {
      return 'mdi:folder-open';
    } else if (props.item.isFavorite) {
      return 'mdi:folder-heart';
    } else if (props.item.isRecent) {
      return 'mdi:folder-clock';
    } else {
      return 'mdi:folder';
    }
  })
</script>

<style scoped>
.project {
  padding: 0.2em 0.6em;
  display: flex;
  align-items: center;
  color: var(--color-foreground-700);
  cursor: pointer;
  gap: 0.5em;
}

.project:hover {
  background-color: var(--color-background-400);
  color: var(--color-foreground-500);
}

.project:hover > .actions {
  display: flex;
}

.project > .icon {
  flex: 0 0 auto;
  font-size: 18px;
}

.project .project-name {
  flex: 1 1 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.project.open {
  color: var(--color-foreground-500);
  font-weight: bold;
}

.project.favorite .actions > .icon.fav {
  color: var(--color-alert-500);
}

.project .actions {
  display: none;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}
</style>