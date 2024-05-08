<template>
  <div>background, footer, paging</div>
</template>

<script setup lang="ts">
import type { UpdateProgressFunction } from '@/models/sc/wizard/model';
import type ScribeDoc from '@/models/document/document';
import { useVModel } from '@vueuse/core';

type Props = {
  index: number;
  modelValue: ScribeDoc;
  updateProgress: UpdateProgressFunction;
}

type Emits = {
  (e: 'update:modelValue', value: ScribeDoc): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const doc = useVModel(props, 'modelValue', emit)

onMounted(() => {
  let progress = 0;
  props.updateProgress(props.index, progress);
  const interval = setInterval(() => {
    progress += 0.1;
    props.updateProgress(props.index, progress);
    if (progress >= 1) {
      clearInterval(interval);
    }
  }, 500);
})
</script>

<style scoped>
/* ToDo: Add style content */
</style>