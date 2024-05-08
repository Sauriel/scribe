import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export type SidebarComponent = 'projects' | 'elements';

export const useEditorSettingsStore = defineStore('editor-settings-store', () => {
  // Main Sidebar
  const selection = useLocalStorage<SidebarComponent>('settings.editor.sidebar.main.selection', 'projects');
  const mini = useLocalStorage('settings.editor.sidebar.main.mini', false);
  const projectsHeight = useLocalStorage('settings.editor.sidebar.main.projects.height', 150);
  const groupVariants = useLocalStorage('settings.editor.sidebar.main.elements.group-variants', true);

  const sidebarMain = {
    selection,
    mini,
    projectsHeight,
    groupVariants,
  };

  return {
    sidebarMain
  };
})