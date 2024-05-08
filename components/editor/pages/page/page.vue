<template>
  <div
    class="page"
    :class="{
      'page--hover-element': hoverOverElement && !isDragging
    }"
  >
    <canvas
      :key="page.index"
      ref="canvas"
      :width="width"
      :height="height"
      @click="onCanvasClick"
      @mousemove="onMouseOverCanvas"
    />
    <div style="position:absolute;top:0;left:0;bottom:0;right:0;display:flex;align-items:center;justify-content:center;color:#0008;font-size:20rem;">
      {{ page.index }}
    </div>
    <div
      v-if="isDragging"
      class="drop-zones"
    >
      <EditorPagesPageDropZone
        v-for="(dropZone, index) of dropZones"
        :key="index"
        :zone="dropZone"
        @dropped="emit('element:dropped', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Page } from '~~/models/canvas/context';
import type { DocMargin } from '~~/models/document/document';
import { useDocumentStore } from '~~/store/document';
import { useElementsStore } from '~~/store/elements';
import type { DropZoneDimension, ElementDroppedEvent } from './dropZone/models';

const MIN_DROP_ZONE_HEIGHT = 20;

type Props = {
  page: Page;
  width: number;
  height: number;
}

type Emits = {
  (e: 'element:click', index: number): void;
  (e: 'element:dropped', payload: ElementDroppedEvent): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const elementsStore = useElementsStore();
const documentStore = useDocumentStore();

const canvas = ref<HTMLCanvasElement>(null);
const hoverOverElement = ref(false);

const isDragging = computed(() => !!elementsStore.dragging);
const clickAreas = computed(() => props.page.clickAreas);

const dropZones = computed<DropZoneDimension[]>(() => {
  const zones: DropZoneDimension[] = [];
  let lastY = Number.NaN;
  let lastX = Number.NaN;
  let lastWidth = Number.NaN;
  let lastElementIndex = Number.NaN;
  let lastElementWasSplitted = false;
  for (const clickArea of clickAreas.value) {
    const dimension = clickArea[0];
    const elementIndex = clickArea[1];
    if (Number.isNaN(lastX) || lastX !== dimension.left) {
      lastX = dimension.left;
      lastY = dimension.top - MIN_DROP_ZONE_HEIGHT;
    }
    if (Number.isNaN(lastX)) {
      lastY = dimension.top - MIN_DROP_ZONE_HEIGHT;
    }
    if (lastElementIndex !== elementIndex && !(Number.isNaN(lastElementIndex) && dimension.splitted)) {
      zones.push({
        left: lastX,
        top: lastY,
        width: dimension.width,
        height: dimension.top - lastY,
        nextElementIndex: elementIndex
      });
    }
    lastY = dimension.top + dimension.height;
    lastElementIndex = elementIndex;
    lastWidth = dimension.width;
    lastElementWasSplitted = !!dimension.splitted;
  }

  if (zones.length === 0) {
    const doc = documentStore.document.value;
    let margin: DocMargin;
    if (typeof doc.margin !== 'number' ) {
      margin = doc.margin as DocMargin;
    } else {
      margin = {
        top: doc.margin as number,
        right: doc.margin as number,
        bottom: doc.margin as number,
        left: doc.margin as number
      };
    }
    let width = doc.width - margin.left - margin.right;
    if (doc.cols) {
      if (doc.cols.widths) {
        width = doc.cols.widths[0];
      } else {
        width = (width - doc.cols.gap * (doc.cols.quantity - 1)) / doc.cols.quantity;
      }
    }
    zones.push({
      left: margin.left,
      top: margin.top,
      width: width,
      height: MIN_DROP_ZONE_HEIGHT,
      nextElementIndex: 0
    });
  } else if (!lastElementWasSplitted) {
    zones.push({
      left: lastX,
      top: lastY,
      width: lastWidth,
      height: MIN_DROP_ZONE_HEIGHT,
      nextElementIndex: lastElementIndex + 1
    });
  }
  return zones;
});

onMounted(renderCanvas);
onUpdated(renderCanvas);
watch(clickAreas, renderCanvas);

function renderCanvas() {
  if (canvas.value) {
    setTimeout(() => {
      const context = canvas.value.getContext('2d') as CanvasRenderingContext2D;
      context.drawImage(props.page.canvas, 0, 0);
    }, 10);
  }
}

function onCanvasClick(event: MouseEvent) {
  const element = findElementIndexForPosition(event.offsetX, event.offsetY);
  if (element !== undefined) {
    emit('element:click', element);
  }
}

function onMouseOverCanvas(event: MouseEvent) {
  const element = findElementIndexForPosition(event.offsetX, event.offsetY);
  hoverOverElement.value = element !== undefined;
}

function findElementIndexForPosition(x: number, y: number): number | undefined {
  const clickedOnElement = [ ...props.page.clickAreas ].find(entry => {
    const dimension = entry[0];
    const elementTopY = dimension.top;
    const elementBottomY = elementTopY + dimension.height;
    const isInY = y >= elementTopY && y <= elementBottomY;
    const elementLeftX = dimension.left;
    const elementRightX = elementLeftX + dimension.width;
    const isInX = x >= elementLeftX && x <= elementRightX;
    return isInX && isInY;
  });
  return clickedOnElement ? clickedOnElement[1] : undefined;
}
</script>

<style scoped>
.page {
  width: calc(v-bind(width) * 1px);
  height: calc(v-bind(height) * 1px);
  background-color: white;
  box-shadow: 5px 5px 10px 2px #111;
  position: relative;
}

.page--hover-element {
  cursor: pointer;
}

.drop-zones {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #FFFFFF88;
}
</style>