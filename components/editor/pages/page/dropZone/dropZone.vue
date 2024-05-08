<template>
  <div
    class="drop-zone"
    @dragover="onDragOver"
    @drop="onDrop"
  />
</template>

<script setup lang="ts">
import { useElementsStore } from '~~/store/elements';
import type { DropZoneDimension, ElementDroppedEvent } from './models';

type Props = {
  zone: DropZoneDimension;
}

type Emits = {
  (e: 'dropped', payload: ElementDroppedEvent): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const elementsStore = useElementsStore();

const top = computed(() => props.zone.top);
const left = computed(() => props.zone.left);
const width = computed(() => props.zone.width);
const height = computed(() => props.zone.height);

function onDragOver(event: DragEvent) {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
    event.preventDefault();
  }
}

function onDrop(event: DragEvent) {
  if (event.dataTransfer) {
    const action = event.dataTransfer.getData('action');
    const elementName = elementsStore.dragging?.name;
    if (action === 'create' && elementName) {
      const payload: ElementDroppedEvent = {
        index: props.zone.nextElementIndex,
        name: elementName
      };
      emit('dropped', payload);
    }
  }
}
</script>

<style scoped>
.drop-zone {
  position: absolute;
  top: calc(v-bind(top) * 1px);
  left: calc(v-bind(left) * 1px);
  width: calc(v-bind(width) * 1px);
  height: calc(v-bind(height) * 1px);
  background-color: #FF000088;
}
</style>