<template>
  <div class="details-sidebar">
    <pre v-if="selectedElement">{{ JSON.stringify(selectedElement, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
  import { useElementsStore } from '~~/store/elements';

  const elementsStore = useElementsStore();

  const selectedElement = computed(() => elementsStore.inspecting);
</script>

<style scoped>
.details-sidebar {
  display: flex;
  width: 300px;
  height: 100%;
  border-left: 1px solid var(--color-background-700);
  background-color: var(--color-background-500);
  position: relative;
}

.details-sidebar::before {
  content: "";
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--color-background-500);
}

.details-sidebar::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--color-background-500);
}
</style>