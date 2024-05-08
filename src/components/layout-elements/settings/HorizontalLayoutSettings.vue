<template>
  <div>
    <div v-if="!element.locked">
      <splitpanes @resized="onResized" class="default-theme">
        <pane
          v-for="(column, index) of element.columns"
          :key="index"
          min-size="10"
          :size="column.width"
        >
          <btn icon="trash-alt" alert @click="deleteColumn(column, index)" />
          <span>{{ column.width }}%</span>
        </pane>
      </splitpanes>
      <btn icon="plus" text="Add Page" @click="addColumn" />
    </div>
    <element-settings-disabled-note v-else />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import HorizontalLayoutElement, { Column } from '@/models/layout-elements/HorizontalLayoutElement';
import VuexHelper from '@/helper/VuexHelper';
import LayoutElement from '@/models/layout-elements/LayoutElement';
import { createDefaultVerticalLayoutElement } from '@/models/layout-elements/VerticalLayoutElement';
//@ts-ignore
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

interface PaneConfig {
  min: number;
  max: number;
  size: number;
}

const appStore = VuexHelper.createNamespace("appStore");

@Component({ components: { Splitpanes, Pane } })
export default class HorizontalLayoutSettings extends Vue {
  @Prop(Object)
  readonly element!: HorizontalLayoutElement;

  private deleteColumn(column: Column, index: number) {
    const widthOfColumn = column.width;
    this.element.columns.splice(index, 1);
    const widthToAdd = widthOfColumn / this.element.columns.length;
    for(let i = 0; i < this.element.columns.length; i++) {
      this.element.columns[i].width += widthToAdd;
    }
    this.roundWidths();
  }

  private addColumn() {
    const total = this.element.columns.length > 0 ? this.element.columns.map(c => c.width).reduce((a, b) => a + b) : 0;
    let columnWidth = 100 - total;
    if (total >= 100) {
      columnWidth = 20 / this.element.columns.length;
      for(let i = 0; i < this.element.columns.length; i++) {
        this.element.columns[i].width -= columnWidth;
      }
    }
    this.element.columns.push({
      width: 20,
      element: createDefaultVerticalLayoutElement()
    });
    this.roundWidths();
  }

  private style(column: Column): Record<string, string> {
    return {
      "flex-basis": column.width + "%"
    }
  }

  private onResized(event: PaneConfig[]) {
    for (let i = 0; i < event.length; i++) {
      this.element.columns[i].width = event[i].size;
    }
    this.roundWidths();
  }

  private roundWidths() {
    let lowestCol: Column | null = null;
    let remainder = 100;
    for (const column of this.element.columns) {
      if (!lowestCol || lowestCol.width > column.width) {
        lowestCol = column;
      }
      const roundedWidth = Math.round(column.width);
      column.width = roundedWidth;
      remainder -= roundedWidth;
    }
    if (lowestCol) {
      lowestCol.width += remainder;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/colors.scss";

.splitpanes {
  &::v-deep {
    &.default-theme {
      .splitpanes__pane {
        background-color: $backgroundLight;
      }
    }

    .splitpanes__splitter {
      margin: 0 2px;
      border: none;
      background-color: transparent;

      &::after {
        margin-left: 2px;
      }

      &::before,
      &::after {
        background-color: $backgroundLight;
      }

      &:hover::before,
      &:hover::after {
        background-color: $foreground;
      }
    }
  }
}
</style>
