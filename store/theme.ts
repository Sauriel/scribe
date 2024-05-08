import { defineStore } from 'pinia';

declare type ThemeMode = 'default' | 'dark' | 'light';

export const useThemeStore = defineStore('theme-store', () => {
  const mode = ref<ThemeMode>('dark');

  const getMode = computed(() => mode);

  function toggleMode() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark';
  }

  return { mode, getMode, toggleMode };
})