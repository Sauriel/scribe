<template>
  <RecycleScroller
    v-slot="{ item }"
    class="page-list"
    :items="pages"
    :item-size="pageHeight + 16"
    :prerender="3"
    :buffer="pageHeight"
    key-field="index"
  >
    <EditorPagesPage
      :page="item"
      :width="pageWidth"
      :height="pageHeight"
      @element:click="onElementClick"
      @element:dropped="onElementDropped"
    />
  </RecycleScroller>
</template>

<script setup lang="ts">
import { useDocumentStore } from '~~/store/document';
import type { Dimension, Page } from '~~/models/canvas/context';
import type { PageBreak } from '~~/models/elements/elements';
import type DocElement from '~~/models/elements/elements';
import { ELEMENT_FUNCTIONS } from '~~/models/elements/elements';
import { useElementsStore } from '~~/store/elements';
import type { ElementDroppedEvent } from './page/dropZone/models';
import type ScribeDoc from '~~/models/document/document';

const documentStore = useDocumentStore();
const elementsStore = useElementsStore();
const { drawAllPages, onNewPage, onDrawCompleted } = useCanvasWorker();

const doc = computed<ScribeDoc>(() => documentStore.document);
const pageWidth = computed(() => Math.round(doc.value.width));
const pageHeight = computed(() => Math.round(doc.value.height));
const elements = computed<DocElement[]>(() => doc.value.content);

// const pagedElements = computed<DocElement[][]>(() => {
//   const pages: DocElement[][] = [];
//   let page: DocElement[] = [];
//   for (const element of elements.value) {
//       page.push(element);
//     if (element.pageBreak === 'after') {
//       pages.push(page);
//       page = [];
//     } else if (element.pageBreak === 'inside') {
//       pages.push(page);
//       page = [];
//       page.push(element);
//     }
//   }
//   return pages;
// });

const pages = ref<Page[]>([]);
const renderPages = ref(true);

onMounted(preparePages);
onNewPage(modifyLastPageAndGetNew);
onDrawCompleted(modifyLastPage);

async function preparePages() {
  pages.value = [];
  for (let i = 0; i < doc.value.pages; i++) {
    pages.value.push(createNewPage(i));
  }
  drawPages();
}

function drawPages() {
  const firstPage = pages.value[0];
  if (firstPage) {
    if (!firstPage.offscreenCanvas) {
      firstPage.canvas = createCanvas();
      firstPage.offscreenCanvas = firstPage.canvas.transferControlToOffscreen();
    }
    drawAllPages(firstPage.offscreenCanvas, doc.value);
  }
}

async function modifyLastPageAndGetNew(index: number, boundaries: Map<Dimension, number>, pageBreak: PageBreak): Promise<OffscreenCanvas> {
  modifyPage(index, boundaries, pageBreak);
  let page = pages.value[index + 1];
  if (!page) {
    page = createNewPage(index + 1);
    pages.value.push(page);
    doc.value.pages = pages.value.length;
  }
  if (!page.offscreenCanvas) {
    page.canvas = createCanvas();
    page.offscreenCanvas = page.canvas.transferControlToOffscreen();
  }
  return page.offscreenCanvas;
}

async function modifyLastPage(index: number, boundaries: Map<Dimension, number>, pageBreak: PageBreak): Promise<void> {
  modifyPage(index, boundaries, pageBreak);
}

function modifyPage(index: number, boundaries: Map<Dimension, number>, pageBreak: PageBreak) {
  const page = pages.value[index];
  if (page) {
    page.clickAreas = boundaries;
    page.offscreenCanvas = null;
  }
  if (pageBreak) {
    const element = elements.value[pageBreak.elementIndex];
    if (element) {
      element.pageBreak = pageBreak.type;
    }
  }
}

function createNewPage(index: number): Page {
    return {
      index,
      canvas: createCanvas(),
      offscreenCanvas: null,
      clickAreas: new Map()
    };
}

function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = pageWidth.value;
  canvas.height = pageHeight.value;
  return canvas;
}

function onElementClick(index: number) {
  const element = elements.value[index];
  if (element) {
    elementsStore.inspecting = element;
  }
}

function onElementDropped(payload: ElementDroppedEvent) {
  const functions = ELEMENT_FUNCTIONS[payload.name];
  if (functions) {
    elements.value.splice(payload.index, 0, functions.create())
    elements.value.forEach((element, index) => {
      if (index >= payload.index && element.pageBreak) {
        element.pageBreak = null; // reset all following page breaks
      }
    });
    const _indexOfChangedPage = elements.value.slice(0, payload.index).filter(element => !!element.pageBreak).length;
    // ToDo [2023-07-01]: rerender page indexOfChangedPage and following
    // console.log(`Change on Page with index ${indexOfChangedPage}. Drawing ${elements.value.length} elements ...`);
    renderPages.value = false;
    nextTick(() => {
      renderPages.value = true;
      drawPages();
    });
  }
}

// function getElementsForPage(index: number): DocElement[] {
//   return index < pagedElements.value.length ? pagedElements.value[index] : [];
// }
</script>

<style scoped>
.page-list {
  width: 100%;
  height: 100%;
}

.page {
  margin: 0 auto;
}
</style>