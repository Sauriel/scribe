<template>
  <ScTooltip
    v-if="tooltip"
    tag="button"
    class="editor-action"
    :top="position === 'top'"
    :bottom="position === 'bottom'"
    :left="position === 'left'"
    :right="position === 'right'"
    no-wrap
    :tooltip="tooltip"
  >
    <Icon :name="icon" />
  </ScTooltip>
  <button
    v-else
    class="editor-action"
  >
    <Icon :name="icon" />
  </button>
</template>

<script setup lang="ts">
type Props = {
  icon: string;
  tooltip?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
});
</script>

<style scoped>
.editor-action {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25em;
  border-radius: var(--border-radius);
  transition: var(--animation);
}

.editor-action:hover {
  background-color: var(--color-background-600);
}
</style>