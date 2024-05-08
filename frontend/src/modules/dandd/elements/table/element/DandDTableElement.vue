<template>
  <div :class="scopedClass">
    <custom-css :style="model.customCss" :prefix="scopedClass" />
    <div
      class="dnd-table"
      :class="{
        'dnd-table--simple': isSimpleTable,
        'dnd-table--class': isClassTable,
      }"
      @click="$emit('element:selected', model)"
    >
      <div class="class-table-border" v-if="isClassTable">
        <template
          v-for="(src, position) of borderImage"
          :key="position"
        >
          <img
            v-if="src"
            class="class-table-border-image"
            :class="'class-table-border-image--' + position"
            :src="src"
          />
        </template>
      </div>
      <header v-if="hasHeader">
        {{ header }}
      </header>
      <table :style="tableVariables">
        <thead>
          <tr>
            <styled-table-cell
              v-for="(header, index) of table.header"
              :key="'dnd-t-h-' + index"
              tag="th"
              :model-value="header.header"
              @update:modelValue="cellUpdated(header.header, $event, -1, index)"
            />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rIndex) of table.rows" :key="'dnd-t-r-' + rIndex">
            <styled-table-cell
              v-for="(cell, cIndex) of row.columns"
              :key="'dnd-t-r-' + rIndex + '-c-' + cIndex"
              :model-value="cell"
              @update:modelValue="cellUpdated(cell, $event, rIndex, cIndex)"
            />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import { getCurrentInstance } from "vue";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { LayoutElementModel } from "@/modules/ElementModel";
import DandDTableElementModel, { DandDTableBorderImage, DandDTableType, DEFAULT_BORDER_IMAGE } from "@/modules/dandd/elements/table/DandDTableElementModel";
import { Table, TableCell } from "@/models/document/table";
import StyledTableCell from "@/components/app/ui/spreadsheet/cell/StyledTableCell.vue";
import { ChangeDandDTableCellAction } from "@/modules/dandd/elements/table/historyAction";
import DocumentModel from "@/models/document";

const EMPTY_STRING = "";

@Options({
  components: {
    StyledTableCell,
  },
  inject: [HISTORY_MANAGER],
})
export default class DandDTableElement extends Vue {
  @Prop({ type: Object, required: true })
  private readonly model!: DandDTableElementModel;

  @Prop({ type: Number, required: true })
  private readonly index!: number;

  @Prop({ type: Object, required: true })
  private readonly layout!: LayoutElementModel;

  @Prop({ type: Boolean, default: false })
  private readonly locked!: boolean;

  @Prop({ type: Object, required: true })
  private readonly document!: DocumentModel;

  private uid = 0;

  private get borderImage(): DandDTableBorderImage {
    return this.model.borderImage || DEFAULT_BORDER_IMAGE;
  };

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get table(): Table {
    return this.model.table;
  }

  public get tableVariables(): Record<string, string> {
    return {
      "--color-row-background": this.model.rowBackground,
    };
  }

  private get isSimpleTable(): boolean {
    return this.model.type === DandDTableType.SIMPLE;
  }

  private get isClassTable(): boolean {
    return this.model.type === DandDTableType.CLASS;
  }

  private get header(): string {
    return this.model.headline ? this.model.headline : EMPTY_STRING;
  }

  private set header(value: string) {
    this.model.headline = value !== EMPTY_STRING ? value : undefined;
  }

  private get hasHeader(): boolean {
    return !!this.model.headline && this.model.headline !== EMPTY_STRING;
  }

  private cellUpdated(oldValue: TableCell, newValue: TableCell, row: number, column: number) {
    // This is probably only a text change
    const action = new ChangeDandDTableCellAction(this.model, row, column, oldValue, newValue);
    this.history.gracefulDo(action, "DandDTableElementModel.cell-" + this.uid);
  }

  private get scopedClass(): string {
    return "dnd-table--" + this.uid;
  }
}
</script>

<style lang="scss" scoped>
@import "@/modules/dandd/fonts.scss";
@import "@/modules/dandd/colors.scss";

.dnd-table {
  color: $black;
  font-family: "Scaly Sans Remake";
  font-size: 9pt;
  margin: 0.5em 0;

  &--class {
    position: relative;
    background-color: #fff;
    margin: 2.5em 0;

    .class-table-border {
      position: absolute;
      top: -2em;
      left: -1.3em;
      right: -1.3em;
      bottom: -2em;
      display: grid;
      grid-template-columns: 5em auto 5em;
      grid-template-rows: 5em auto 5em;
      grid-template-areas:
        "top-left top top-right"
        "left center right"
        "bottom-left bottom bottom-right";
      z-index: 1;

      &-image {
        width: 100%;
        height: 100%;

        &--topLeft {
          grid-area: top-left;
        }

        &--top {
          grid-area: top;
        }

        &--topRight {
          grid-area: top-right;
        }

        &--left {
          grid-area: left;
        }

        &--right {
          grid-area: right;
        }

        &--bottomLeft {
          grid-area: bottom-left;
        }

        &--bottom {
          grid-area: bottom;
        }

        &--bottomRight {
          grid-area: bottom-right;
        }
      }

      & + header {
        position: relative;
        z-index: 2;
      }

      & + table,
      & + header + table {
        position: relative;
        z-index: 2;
      }
    }
  }

  header {
    font-family: "Scaly Sans Caps";
    font-weight: bold;
    font-size: 10pt;
    margin-top: 0;
    margin-bottom: 0.2em;
  }

  table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    margin-bottom: 0.5em;

    td,
    th {
      padding: 0.1em;
    }

    tbody {
      tr:nth-child(odd) {
        background-color: var(--color-row-background);
      }
    }
  }
}
</style>
