<template>
  <div id="footer">
    <Icon
      name="fa6-solid:circle-half-stroke"
      class="theme-mode-switcher"
      @click="themeStore.toggleMode"
    />
  </div>
</template>

<script setup lang="ts">
  import { useThemeStore } from '@/store/theme';

  const themeStore = useThemeStore();
</script>

<style scoped>
#footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding: 0 7px;
  border-top: 1px solid var(--color-background-700);
  background-color: var(--color-background-500);
}

.theme-mode-switcher {
  font-size: 1rem;
  cursor: pointer;
}

.theme-mode-switcher:hover {
  color: var(--color-foreground-700);
}
</style>