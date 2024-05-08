<template>
  <label class="switch-label">
    <span class="switch-off">
      <slot name="off" />
    </span>
    <span class="switch">
      <Icon
        :name="iconOff"
        class="icon-off"
      />
      <input
        v-model="data"
        class="switch-input"
        type="checkbox"
      >
      <Icon
        :name="iconOn"
        class="icon-on"
      />
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
  iconOn: string;
  iconOff: string;
}

type Emits = {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const data = useVModel(props, 'modelValue', emit);
</script>

<style scoped>
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

.switch-on {
  grid-area: on;
  justify-self: flex-start;
}

.switch {
  --switch-height: 1.6em;
  --switch-width: 3.4em;
  grid-area: icon;
  justify-self: center;
  display: grid;
  grid-template-areas: "off input on";
  justify-content: center;
  align-items: center;
  grid-template-columns: calc(var(--switch-height) - 4px) auto calc(var(--switch-height) - 4px);
  grid-template-rows: auto;
  border: 1px solid var(--color-foreground-500);
  height: var(--switch-height);
  width: var(--switch-width);
  border-radius: 100000px;
  position: relative;
  cursor: pointer;
  padding: 0 2px;
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
  z-index: 1
}

.icon-on,
.icon-off {
  z-index: 2;
  justify-self: center;
  transition: var(--animation);
}

.icon-on {
  grid-area: on;
}

.icon-off {
  grid-area: off;
}

.switch:not(:has(.switch-input:checked)) .icon-off {
  color: var(--color-background-500);
}

.switch:has(.switch-input:checked) .icon-on {
  color: var(--color-background-500);
}

.switch:has(.switch-input:checked)::before {
  left: calc(var(--switch-width) - (var(--switch-height) - 6px) - 4px);
}

.switch-input {
  grid-area: input;
  width: 0;
  height: 0;
  opacity: 0;
}
</style>