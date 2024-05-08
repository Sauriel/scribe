<template>
  <div class="page-size">
    <div
      class="preview"
      @click="swapOrientation"
    >
      <Icon
        v-if="orientation === 'portrait'"
        name="fluent:document-20-filled"
      />
      <Icon
        v-if="orientation === 'landscape'"
        name="fluent:document-landscape-20-filled"
      />
      <Icon
        v-if="orientation === 'square'"
        name="fluent:note-20-filled"
        class="rotate-minus90"
      />
    </div>
    <ScSelect
      v-model="pageUnit"
      class="unit"
      :items="units"
    />
    <ScFormInput
      id="page-width"
      v-model="pageWidth"
      class="page-width"
      type="number"
      :label="$t('doc.create.steps.base.page-size.width.label')"
      :placeholder="$t('doc.create.steps.base.page-size.width.placeholder')"
      hide-error
    />
    <Icon
      name="iconamoon:sign-times-bold"
      class="times"
    />
    <ScFormInput
      id="page-height"
      v-model="pageHeight"
      class="page-height"
      type="number"
      :label="$t('doc.create.steps.base.page-size.height.label')"
      :placeholder="$t('doc.create.steps.base.page-size.height.placeholder')"
      hide-error
    />
    <ScIconBtn
      class="swap"
      icon="mdi:shuffle"
      small
      secondary
      @click="swapOrientation"
    />
  </div>
</template>

<script setup lang="ts">
import { useVModel  } from '@vueuse/core';
import { Helper, type Unit } from '../../../models/global';

type PageOrientation = 'portrait' | 'landscape' | 'square';

type Props = {
  unit: Unit;
  width: number;
  height: number;
}

type Emits = {
  'update:unit': [value: Unit],
  'update:width': [value: number],
  'update:height': [value: number],
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const pageUnit = useVModel(props, 'unit', emit);

const units = ref<Unit[]>(['px', 'mm', 'cm', 'in']);

const pageWidth = computed<number>({
  get() {
    return Helper.toUnit(props.width, props.unit);
  },
  set(value: number) {
    emit('update:width', Helper.toPixel(value, props.unit));
  },
});

const pageHeight = computed<number>({
  get() {
    return Helper.toUnit(props.height, props.unit);
  },
  set(value: number) {
    emit('update:height', Helper.toPixel(value, props.unit));
  },
});

const orientation = computed<PageOrientation>(() => {
  if (pageWidth.value < pageHeight.value) {
    return 'portrait';
  } else if (pageWidth.value > pageHeight.value) {
    return 'landscape';
  } else {
    return 'square';
  }
});

function swapOrientation() {
  const width = props.width;
  const height = props.height;
  emit('update:width', height);
  emit('update:height', width);
}
</script>

<style scoped>
.page-size {
  display: grid;
  grid-template-areas: "preview width times height unit swap";
  grid-template-columns: 80px repeat(5, auto);
  align-items: center;
  gap: 0.75em;
  margin-top: 1em;
}

.preview {
  grid-area: preview;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  color: var(--color-background-400);
  cursor: pointer;
}

.times {
  grid-area: times;
  font-size: 1.5em;
  color: var(--color-background-400);
}

.rotate-minus90 {
  rotate: -90deg;
}

.page-width,
.page-height {
  width: 120px;
  margin-top: -1.2em;
}

.page-width {
  grid-area: width;
}

.page-height {
  grid-area: height;
}

.unit {
  grid-area: unit;
  display: flex;
  gap: 1em;
  align-items: center;
}

.swap {
  grid-area: swap;
}
</style>