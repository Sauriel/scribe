<template>
  <button
    ref="select"
    class="select"
    :class="{
      'open': open,
      'top': top
    }"
    @click="onButtonClick"
  >
    <span class="selected-value">
      <ScHoverMarquee
        v-if="placeholder && !value"
        class="placeholder"
        :width="buttonWidthWithoutPadding"
        :speed="3"
      >
        {{ placeholder }}
      </ScHoverMarquee>
      <ScHoverMarquee
        v-else
        :width="buttonWidthWithoutPadding"
        :speed="3"
      >
        {{ value }}
      </ScHoverMarquee>
    </span>
    <Icon name="charm:chevron-down" />
    <ul
      v-if="open"
      class="list"
    >
      <li
        v-for="(item, index) of items"
        :key="index"
        class="item"
        @click.stop="onItemClick(item)"
      >
        <ScHoverMarquee
          v-if="singleLine"
          class="item-text"
          :width="listWidthWithoutPadding"
          :speed="3"
        >
          {{ item }}
        </ScHoverMarquee>
        <span
          v-else
          class="item-text"
        >
          {{ item }}
        </span>
      </li>
    </ul>
  </button>
</template>

<script setup lang="ts" generic="T">
import { useVModel, onClickOutside } from '@vueuse/core';

type Props = {
  modelValue: T | null;
  items: T[];
  top?: boolean;
  placeholder?: string;
  maxHeight?: string;
  singleLine?: boolean;
  width?: number;
}

type Emits = {
  'update:modelValue': [value: T | null];
}

const props = withDefaults(defineProps<Props>(), {
  maxHeight: 'auto'
});
const emit = defineEmits<Emits>();
const value = useVModel(props, 'modelValue', emit);

const select = ref<HTMLButtonElement>();

const open = ref<boolean>(false);

const listWidthWithoutPadding = computed(() => (props.width ?? 100) - 32);
const buttonWidthWithoutPadding = computed(() => (props.width ?? 100) - 48);

onClickOutside(select, () => open.value = false);

function onButtonClick() {
  open.value = !open.value;
}

function onItemClick(item: T) {
  value.value = item;
  open.value = false;
}
</script>

<style scoped>
.select {
  --padding-y: 0.5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5em;
  position: relative;
  background-color: color-mix(in srgb, var(--color-foreground-500) 15%, transparent);
  border: none;
  border-radius: var(--border-radius);
  padding: var(--padding-y) 0.5em var(--padding-y) 1em;
  line-height: 1;
  cursor: pointer;
  min-width: 100px;
  width: calc(v-bind(width) * 1px);
  color: var(--color-foreground-500);
}

.select:hover {
  background-color: color-mix(in srgb, var(--color-foreground-500) 30%, transparent);
}

.select:not(.top).open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.select.top.open {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.selected-value {
  display: inline-flex;
  align-items: center;
}

.list {
  display: block;
  position: absolute;
  background-color: inherit;
  left: 0;
  right: 0;
  max-height: v-bind(maxHeight);
  backdrop-filter: blur(10px);
  z-index: 99;
  overflow-x: hidden;
}

.select:not(.top) .list {
  top: calc(1em + 2 * var(--padding-y));
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  border-top: 1px solid var(--color-background-700);
}

.select.top .list {
  bottom: calc(1em + 2 * var(--padding-y));
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  border-bottom: 1px solid var(--color-background-700);
}

.item {
  padding: var(--padding-y) 1em;
  text-align: left;
}

.item:hover {
  background-color: var(--color-background-700);
}

.placeholder {
  font-size: 0.75em;
  white-space: nowrap;
}
</style>