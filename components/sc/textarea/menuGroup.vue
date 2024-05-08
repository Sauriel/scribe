<template>
  <div
    class="menu-group"
    :class="{ 'expanded': expanded }"
  >
    <ScTextareaMenuButton
      v-if="!expanded"
      :icon="icon"
    />
    <div class="group">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  expanded?: boolean;
  icon: string;
}



const props = defineProps<Props>();
</script>

<style scoped>
.menu-group {
  position: relative;
}

.group {
  display: flex;
  align-items: center;
  gap: 0.25em;
}

.menu-group:not(.expanded) .group {
  display: none;
  position: absolute;
  background-color: var(--color-background-700);
  border-radius: var(--border-radius);
  top: 0;
  left: 0;
  z-index: 2;
}

.menu-group:not(.expanded):hover .group {
  display: flex;
}
</style>