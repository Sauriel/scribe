<template>
  <label class="sc-checkbox">
    <input
      v-model="value"
      type="checkbox"
      class="input"
    >
    <svg
      class="checkmark"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 52"
    >
      <path
        class="checkmark__check"
        fill="none"
        d="M14.1 27.2l7.1 7.2 16.7-16.8"
      />
    </svg>
    <slot />
  </label>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';

type Props = {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);
const value = useVModel(props, 'modelValue', emit);
</script>

<style scoped>
.sc-checkbox {
  display: inline-flex;
  gap: 0.5em;
  cursor: pointer;
  align-items: flex-end;
}

.sc-checkbox > input[type=checkbox] {
  display: none;
}

.checkmark {
  --checkmark-size: 1.2em;
  display: block;
  border: 1px solid var(--color-foreground-500);
  border-radius: calc(var(--border-radius) / 2);
  width: var(--checkmark-size);
  height: var(--checkmark-size);
  stroke-width: 4;
  stroke: var(--color-foreground-500);
  stroke-miterlimit: 10;
}

.checkmark > .checkmark__check {
  transform-origin: center;
  scale: 150%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  transition: stroke-dashoffset cubic-bezier(0.65, 0, 0.45, 1) 0.2s;
}

.sc-checkbox > input[type=checkbox]:checked + .checkmark > .checkmark__check {
  stroke-dashoffset: 0;
}
</style>