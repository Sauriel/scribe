<template>
  <div class="vertical-layout">
    <drop
      v-if="layout.rows.length === 0"
      class="drop-zone drop-zone--first"
      :class="{
        'drop-zone--dragging drop-zone--over': isDragging
      }"
      @drop="handleFirstDrop"
      @dragover="handleFirstDragOver"
    >
      <add-element-row v-if="showAddElementRow" @addLayout="handleFirstDrop" @addElement="handleFirstDrop" />
    </drop>
    <div
      class="row"
      v-for="(element, index) in layout.rows"
      :key="index"
    >
      <drop
        class="drop-zone drop-zone--before"
        :class="{
          'drop-zone--dragging': isDragging,
          'drop-zone--over': dragOverId === (index + '-b'),
          'drop-zone--fixed': element.fixDropZones
        }"
        @drop="handleDrop($event, index, 'before')"
        @dragover="handleDragOver(index, 'before', ...arguments)"
        @dragleave="dragOverId = null"
      />
      <div
        class="element-wrapper"
        :class="{
          'element-wrapper--selected': element === selectedElement,
          'element-wrapper--bordered': alwaysShowElementBorder,
          'element-wrapper--is-layout': element.isLayout
        }"
        @click.stop="openElementSettings(element, index, layout)"
      >
        <component :is="element.component" :element="element" />
        <div class="element-wrapper-options">
          <drag
            v-if="!element.locked"
            class="element-dragger"
            :transfer-data="{ element, index, layout }"
            @dragstart="handleDragStart"
            @dragend="handleDragEnd"
          >
            <template slot="image">
              <div class="drag-preview">
                <font-awesome-icon :icon="element.icon" />
              </div>
            </template>
            <font-awesome-icon icon="grip-horizontal" />
          </drag>
          <icon v-else icon="grip-horizontal" disabled />
          <icon icon="trash-alt" @click.stop="deleteElement(element, index)" :disabled="element.locked" />
        </div>
      </div>
      <drop
        class="drop-zone drop-zone--after"
        :class="{
          'drop-zone--dragging': isDragging,
          'drop-zone--over': dragOverId === (index + '-a'),
          'drop-zone--fixed': element.fixDropZones,
          'drop-zone--last': showAddElementRow && (index + 1) === layout.rows.length
        }"
        @drop="handleDrop($event, index, 'after')"
        @dragover="handleDragOver(index, 'after', ...arguments)"
        @dragleave="dragOverId = null"
      >
        <add-element-row
          v-if="showAddElementRow && (index + 1) === layout.rows.length"
          @addLayout="handleDrop($event, index, 'after')"
          @addElement="handleDrop($event, index, 'after')"
        />
      </drop>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import VuexHelper from '@/helper/VuexHelper';
import LayoutElement from '@/models/layout-elements/LayoutElement';
import VerticalLayoutElement from '@/models/layout-elements/VerticalLayoutElement';
import ElementSelection from '@/models/ElementSelection';
import { SettingsSubTool, Tool } from '@/store/app.store';
import AppDocument from '@/models/AppDocument';
import HorizontalLayoutElement from '@/models/layout-elements/HorizontalLayoutElement';
import { LAYOUT_ELEMENT_CACHE } from '@/chaches';
import AddElementRow from "@/components/ui/AddElementRow.vue";

declare type DropPosition = "before" | "after";

const layoutStore = VuexHelper.createNamespace("layoutStore");
const appStore = VuexHelper.createNamespace("appStore");

@Component({ components: { AddElementRow }})
export default class VerticalLayout extends Vue {
  @Prop(Object)
  readonly element!: VerticalLayoutElement;

  private get layout(): VerticalLayoutElement {
    return this.element;
  }

  private get isTopLevel(): boolean {
    return !this.element.parentLayoutId;
  }

  private get quickAccessRowOnlyOnPageEnd(): boolean {
    return appStore.getters("quickAccessRowOnlyOnPageEnd");
  }

  private get showAddElementRow(): boolean {
    return this.isTopLevel || !this.quickAccessRowOnlyOnPageEnd;
  }

  private dragOverId: string | null = null;

  private get dragging(): LayoutElement | undefined {
    return layoutStore.getters("draggingElement");
  }

  private set dragging(value: LayoutElement | undefined) {
    layoutStore.commit("setDraggingElement", value);
  }

  private get isDragging(): boolean {
    return !!layoutStore.getters("draggingElement") || !!this.dragging;
  }

  private get selectedElement(): LayoutElement | undefined {
    return layoutStore.getters("editingElement");
  }

  private get alwaysShowElementBorder(): boolean {
    return appStore.getters("alwaysShowElementBorder");
  }

  private set alwaysShowElementBorder(value: boolean) {
    appStore.commit("setAlwaysShowElementBorder", value);
  }

  private handleFirstDragOver(data: ElementSelection, event: DragEvent) {
    if (!data.element) {
      // @ts-ignore
      event.dataTransfer.dropEffect = "none";
    }
  }

  private handleDragOver(index: number, position: DropPosition, data: ElementSelection, event: DragEvent) {
    const isLayoutElement = !!data.element;
    const isInSameLayout = !!data.layout && this.element.id === data.layout?.id;
    const isItself = index === data.index;
    const isBeforeItself = data.index === (index - 1) && position === "before";
    const isAfterItself = data.index === (index + 1) && position === "after";
    const isNotBeforeOrAfterItself = !isItself && !isBeforeItself && !isAfterItself;
    const layoutIsDescendantOfElement = this.layoutIsDescendantOfElement(data.element, this.layout)

    if (isLayoutElement && (isNotBeforeOrAfterItself || !isInSameLayout) && !layoutIsDescendantOfElement) {
      this.dragOverId = index + "-" + position.substring(0, 1);
    } else {
      // @ts-ignore
      event.dataTransfer.dropEffect = "none";
    }
  }

  private layoutIsDescendantOfElement(element: LayoutElement, layout?: LayoutElement): boolean {
    if (!layout) {
      return false;
    } else if (layout.id === element.id) {
      return true;
    } else {
      return this.layoutIsDescendantOfElement(element, LAYOUT_ELEMENT_CACHE.get(layout.parentLayoutId));
    }
  }

  private handleFirstDrop(data: ElementSelection) {
    if (data.element.id) { // is not new
      this.handleDrop(data, 0, "before");
    } else {
      const document: AppDocument = appStore.getters<AppDocument>("document");
      const id = document.nextElementIndex++;
      const newElement: LayoutElement = {
        ...data.element,
        id: id,
        parentLayoutId: this.layout.id,
        preview: false
      };
      // @ts-ignore
      if (newElement.columns && newElement.columns.length > 0) { // the element is a HorizontalLayout, there are IDs that must be set
        for (const column of (newElement as HorizontalLayoutElement).columns) {
          const columnId = document.nextElementIndex++;
          column.element.id = columnId;
          column.element.parentLayoutId = newElement.id;
          LAYOUT_ELEMENT_CACHE.add(columnId, column.element);
        }
      }
      if (this.layout !== data.layout && data.layout && data.index) {
        data.layout.rows.splice(data.index, 1); // delete from old layout
      }
      this.layout.rows.push(newElement);
      LAYOUT_ELEMENT_CACHE.add(id, newElement);
    }
  }

  private handleDrop(data: ElementSelection, index: number, position: DropPosition) {
    const indexToInsert = position === "before" ? index : index + 1;
    if (data.index === undefined) { // undefined is new
      const document: AppDocument = appStore.getters<AppDocument>("document");
      const id = document.nextElementIndex++;
      const newElement: LayoutElement = {
        ...data.element,
        id: id,
        parentLayoutId: this.layout.id
      };
      // @ts-ignore
      if (newElement.columns && newElement.columns.length > 0) { // the element is a HorizontalLayout, there are IDs that must be set
        for (const column of (newElement as HorizontalLayoutElement).columns) {
          const columnId = document.nextElementIndex++;
          column.element.id = columnId;
          column.element.parentLayoutId = newElement.id;
          LAYOUT_ELEMENT_CACHE.add(columnId, column.element);
        }
      }
      this.layout.rows.splice(indexToInsert, 0, newElement); // insert into: index
      LAYOUT_ELEMENT_CACHE.add(id, newElement);
    } else {
      const from = data.index;
      data.element.parentLayoutId = this.layout.id;
      if (this.layout !== data.layout && data.layout) {
        data.layout.rows.splice(from, 1); // delete from old layout
        this.layout.rows.splice(indexToInsert, 0, data.element); // insert into new layout
      } else {
        if (from > indexToInsert) {
          this.layout.rows.splice(from, 1); // delete from: from
          this.layout.rows.splice(indexToInsert, 0, data.element); // insert into: to
        } else if (from < indexToInsert) {
          this.layout.rows.splice(indexToInsert, 0, data.element); // insert into: to
          this.layout.rows.splice(from, 1); // delete from: from
        }
      }
    }
    this.dragOverId = null;
    this.dragging = undefined;
  }

  private handleDragStart(data: ElementSelection, event: DragEvent) {
    this.dragging = data.element;
    event.stopPropagation();
  }

  private handleDragEnd(data: ElementSelection, event: DragEvent) {
    this.dragging = undefined;
  }

  private openElementSettings(element: LayoutElement, index: number, layout: VerticalLayoutElement) {
    layoutStore.commit("setEditingElement", element);
    appStore.commit("setSelectedTool", "Settings");
    appStore.commit("setSettingsSubTool", "ElementSettings");
  }

  private deleteElement(element: LayoutElement, index: number) {
    if (element == layoutStore.getters<LayoutElement>("editingElement")) {
      layoutStore.commit("setEditingElement", undefined);
      if (appStore.getters<Tool>("selectedTool") === "Settings"
        && appStore.getters<SettingsSubTool>("selectedSettingsSubTool") === "ElementSettings") {
        appStore.commit("setSelectedTool", "Elements");
        appStore.commit("setSettingsSubTool", "DocumentSettings");
      }
    }
    this.layout.rows.splice(index, 1);
  }
}
</script>

<style lang="scss" scoped>
  @import "@/style/colors.scss";

  .vertical-layout {
    position: relative;

    .drop-zone {
      height: 0;
      pointer-events: none;

      &--before {
        top: 0;

        &::before {
          top: 0;
        }
      }

      &--after {
        bottom: 0;

        &::before {
          bottom: 0;
        }
      }

      &::before {
        content: "";
        display: block;
        height: 15px;
        width: 100%;
        background-color: $foreground;
        border: 1px dashed $background;
        position: absolute;
        opacity: 0;
      }

      &--dragging {
        height: 50%;
        position: absolute;
        width: 100%;
        z-index: 100;
        pointer-events: all;
      }

      &--over {
        &::before {
          opacity: 1;
          border: 1px solid $primary;
          background-color: transparentize($primary, 0.5);
        }
      }

      &--fixed.drop-zone--dragging {
        z-index: 99;
      }

      &--first {
        pointer-events: all;

        &:not(.drop-zone--dragging)::before {
          display: none;
        }
      }

      &--last {
        height: auto;
        pointer-events: all;

        &::before {
          z-index: -1;
          height: 30px;
        }

        &.drop-zone--dragging {
          position: initial;

          &::before {
            z-index: 99;
          }
        }

        @media print {
          display: none;
        }
      }
    }

    .row {
      position: relative;

      &:hover {
        > .element-wrapper > .element-wrapper-options {
          display: flex;
        }
      }

      .element-wrapper {
        position: relative;

        > .element-wrapper-options {
          background-color: transparentize($background, 0.5);
          color: $foreground;
          position: absolute;
          top: -30px;
          left: 50%;
          margin-left: -50px;
          display: none;
          width: 100px;
          height: 30px;
          z-index: 200;
          font-size: 1.5rem;
          line-height: 0;
          justify-content: center;
          align-items: center;

          @media print {
            display: none !important;
          }

          &::before, &::after {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            border: 15px solid transparent;
            border-bottom-color: transparentize($background, 0.5);
          }

          &::before {
            left: -30px;
            border-right-color: transparentize($background, 0.5);
          }

          &::after {
            right: -30px;
            border-left-color: transparentize($background, 0.5);
          }

          > * {
            margin: 0 10px;
          }

          .element-dragger {
            cursor: move;
          }

          .fa-trash-alt {
            cursor: pointer;
            color: $alert;
          }

          .fa-lock, .fa-unlock {
            cursor: pointer;
          }
        }

        &--bordered, &:hover {
          outline: 1px solid $primaryLight;

          @media print {
            outline: none;
          }
        }

        &--selected {
          outline: 2px solid $info;

          &.element-wrapper--is-layout {
            outline-color: $info;
          }

          &:hover {
            outline: 2px solid $info;
          }

          @media print {
            outline: none;
          }
        }

        &--is-layout {
          outline-color: $primaryDark;
          margin: 0 -10px;
          padding: 0 10px;
        }
      }
    }
  }

  .drag-preview {
    height: 100px;
    width: 160px;
    background-color: gray;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 5rem;
  }
</style>
