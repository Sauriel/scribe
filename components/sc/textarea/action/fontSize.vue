<template>
  <span
    ref="fontSizeWrapper"
    class="font-size"
  >
    <button
      class="minus"
      @click="substract"
    >
      <Icon name="ic:round-minus" />
    </button>
    <input
      v-model="value"
      class="size-input"
      type="number"
      :min="MIN_VALUE"
      @focus="showDropdown = true"
    >
    <button
      class="plus"
      @click="add"
    >
      <Icon name="ic:round-plus" />
    </button>
    <ul
      v-if="showDropdown"
      class="size-list"
    >
      <li
        v-for="size in sizeList"
        :key="size"
        class="size-item"
        :class="{ active: size === value }"
        @click="onSizeClick(size)"
      >
        {{ size }}
      </li>
    </ul>
  </span>
</template>

<script setup lang="ts">
import { useVModel, onClickOutside } from '@vueuse/core';

const MIN_VALUE = 0;
const sizeList = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 64, 72, 96];

type Props = {
  modelValue:  number;
}

type Emits = {
  'update:modelValue': [value: number],
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const value = useVModel(props, 'modelValue', emit);

const fontSizeWrapper = ref<HTMLSpanElement>();
const showDropdown = ref(false);

const digitCount = computed(() => Math.max(Math.floor(Math.log10(Math.abs(value.value))), 0) + 1);

onClickOutside(fontSizeWrapper, () => showDropdown.value = false);

function add() {
  value.value++;
}

function substract() {
  if (value.value > MIN_VALUE) {
    value.value--;
  }
}

function onSizeClick(size: number) {
  value.value = size;
  showDropdown.value = false;
}
</script>

<style scoped>
.font-size {
  display: flex;
  background-color: var(--color-background-600);
  border-radius: var(--border-radius);
  color: var(--color-foreground-500);
  position: relative;
}

.size-input {
  text-align: center;
  font-size: 0.75em;
  width: calc(1ch * (v-bind(digitCount) + 2));
  padding: 0.25em;
  border: none;
  -moz-appearance: textfield;
  background-color: transparent;
  color: inherit;
}

.size-input::-webkit-outer-spin-button,
.size-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.size-input:focus {
  outline: none;
}

.plus,
.minus {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: inherit;
  background-color: transparent;
  padding: 0;
  cursor: pointer;
  padding: 0.25em;
  transition: var(--animation);
}

.plus:hover,
.minus:hover {
  background-color: var(--color-background-400);
  color: var(--color-background-700);
}

.minus {
  border-top-left-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
  border-right: 1px solid var(--color-background-900);
}

.plus {
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  border-left: 1px solid var(--color-background-900);
}

.size-list {
  display: flex;
  flex-direction: column;
  position: absolute;
  background-color: var(--color-background-600);
  left: 1.5em;
  right: 1.5em;
  top: 100%;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  z-index: 99;
  font-size: 0.75em;
  max-height: 200px;
  overflow-y: auto;
}

.size-item {
  padding: 0.25em 0.5em;
  cursor: pointer;
  transition: var(--animation);
  text-align: center;
}

.size-item.active,
.size-item:hover {
  background-color: var(--color-background-400);
  color: var(--color-background-700);
}
</style>