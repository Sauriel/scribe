<template>
  <button
    class="btn"
    :class="{ 'secondary': secondary }"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
type Props = {
  secondary?: boolean;
  disabled?: boolean;
}

// type Emits = {
//   (e: 'update', payload: string): void;
// }

const props = defineProps<Props>();
// const emit = defineEmits<Emits>();
</script>

<style  scoped>
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5em 1em;
  background-color: var(--color-primary-500);
  border: 1px solid var(--color-primary-500);
  border-radius: var(--border-radius);
  color: var(--color-foreground-500);
  cursor: pointer;
}

.btn:hover {
  background-color: var(--color-primary-600);
}

.btn.secondary {
  background-color: var(--color-background-700);
  border: 1px solid var(--color-background-700);
}

.btn.secondary:hover {
  background-color: var(--color-background-600);
}

.btn:disabled {
  cursor: not-allowed;
  background-color: var(--color-foreground-900);
  border: 1px solid var(--color-foreground-900);
  color: var(--color-foreground-700);
}
</style>