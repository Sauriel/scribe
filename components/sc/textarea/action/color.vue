<template>
  <div
    ref="colorPicker"
    class="color-picker"
  >
    <div
      class="color"
      @click="toggleColorPicker"
    />
    <ColorPicker
      v-if="showPicker"
      v-on-click-outside="hideColorPicker"
      :color="color"
      theme="dark"
      :colors-default="predefinedColors"
      @changeColor="onChangeColor"
    />
  </div>
</template>

<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { ColorPicker } from 'vue-color-kit';
import 'vue-color-kit/dist/vue-color-kit.css';

declare type ColorPickerEvent = {
  hex: string;
  hsv: {
    h: number;
    s: number;
    v: number;
  };
  rgba: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}

// type Props = {
//   value: string;
// }

// type Emits = {
//   (e: 'update', payload: string): void;
// }

// const props = defineProps<Props>();
// const emit = defineEmits<Emits>();

const colorPicker = ref<HTMLDivElement>();
const showPicker = ref<boolean>(false);
const color = ref<string>('#ff0000');
const predefinedColors = ref<string[]>([
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#00ffff',
  '#ff00ff'
]);

function toggleColorPicker() {
  showPicker.value = !showPicker.value;
}

function hideColorPicker() {
  showPicker.value = false;
}

function onChangeColor(event: ColorPickerEvent) {
  color.value = event.hex;
}
</script>

<style scoped>
.color-picker {
  flex: 0 0 auto;
  position: relative;
}

.color {
  cursor: pointer;
  height: 1.25em;
  width: 1.25em;
  background-color: v-bind(color);
  border: 1px solid var(--color-foreground-500);
  border-radius: var(--border-radius);
}

.hu-color-picker {
  position: absolute;
  top: 100%;
  left: 100%;
  box-sizing: content-box;
  border-radius: var(--border-radius);
  background-color: var(--color-background-700);
}

.hu-color-picker::v-deep(.color-show),
.hu-color-picker::v-deep(.colors .item),
.hu-color-picker::v-deep(.colors .item .color) {
  border-radius: var(--border-radius);
}

.hu-color-picker::v-deep(.color-show) {
  overflow: hidden;
}

.hu-color-picker::v-deep(.color-type .name) {
  border-top-left-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
  background-color: var(--color-background-900);
  color: var(--color-foreground-500);
}

.hu-color-picker::v-deep(.color-type .value) {
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  background-color: var(--color-background-500);
  color: var(--color-foreground-500);
}

.hu-color-picker::v-deep(.colors .item .alpha) {
  display: none;
}
.hu-color-picker::v-deep(.hue .slide),
.hu-color-picker::v-deep(.color-alpha .slide) {
  background-color: var(--color-foreground-500);
}

.hu-color-picker::v-deep(.saturation .slide) {
  border-color: var(--color-foreground-500);
}
</style>