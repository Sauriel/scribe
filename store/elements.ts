import { defineStore } from 'pinia';
import type LayoutElement from '~~/components/editor/sidebar/main/element/icon/models';
import type DocElement from '~~/models/elements/elements';

export const useElementsStore = defineStore('elements-store', () => {
  const dragging = ref<LayoutElement | null>(null);
  const inspecting = ref<DocElement | null>(null);

  return {
    dragging,
    inspecting
  };
})