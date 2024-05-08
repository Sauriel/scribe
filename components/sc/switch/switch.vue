<template>
  <label class="switch-label">
    <span class="switch-off">
      <slot name="off" />
    </span>
    <span class="switch">
      <input
        v-model="data"
        class="switch-input"
        type="checkbox"
      >
    </span>
    <span class="switch-on">
      <slot name="on" />
    </span>
  </label>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';

type Props = {
  modelValue: boolean;
}

type Emits = {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const data = useVModel(props, 'modelValue', emit);
</script>

<style scoped>
.switch-input {
  width: 0;
  height: 0;
  opacity: 0;
}

.switch-label {
  display: inline-grid;
  grid-template-areas: "off icon on";
  grid-template-columns: repeat(3, auto);
  gap: .5em;
  align-items: center;
  user-select: none;
}

.switch-off {
  grid-area: off;
  justify-self: flex-end;
}

.switch-on{
  grid-area: on;
  justify-self: flex-start;
}

.switch {
  --switch-height: 1.2em;
  --switch-width: 2.2em;
  grid-area: icon;
  justify-self: center;
  display: inline-block;
  border: 1px solid var(--color-foreground-500);
  height: var(--switch-height);
  width: var(--switch-width);
  border-radius: 100000px;
  position: relative;
  cursor: pointer;
}

.switch::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  height: calc(var(--switch-height) - 6px);
  width: calc(var(--switch-height) - 6px);
  background-color: var(--color-foreground-500);
  border-radius: 50%;
  transition: var(--animation);

}

.switch:has(.switch-input:checked)::before {
  left: calc(var(--switch-width) - (var(--switch-height) - 6px) - 4px);
}
</style>