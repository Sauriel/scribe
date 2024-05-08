<template>
  <div class="spreadsheet" v-click-outside="onClickOutside">
    <div class="spreadsheet-tools">
      <div class="menu-group">
        <font-selector v-model="font" />
        <dropdown v-model="size" :items="sizes" />
      </div>
      <div class="menu-group">
        <font-awesome-icon
          icon="bold"
          class="icon"
          :class="{
            'icon--active': isBold,
          }"
          @click="toggleBold"
        />
        <font-awesome-icon
          icon="italic"
          class="icon"
          :class="{
            'icon--active': isItalic,
          }"
          @click="toggleItalic"
        />
        <font-awesome-icon
          icon="underline"
          class="icon"
          :class="{
            'icon--active': isUnderline,
          }"
          @click="toggleUnderline"
        />
        <font-awesome-icon
          icon="strikethrough"
          class="icon"
          :class="{
            'icon--active': isStrike,
          }"
          @click="toggleStrike"
        />
        <color-picker v-model="color" />
      </div>
      <div class="menu-group">
        <font-awesome-icon
          icon="align-left"
          class="icon"
          :class="{
            'icon--active': isAlign('left'),
          }"
          @click="setTextAlign('left')"
        />
        <font-awesome-icon
          icon="align-center"
          class="icon"
          :class="{
            'icon--active': isAlign('center'),
          }"
          @click="setTextAlign('center')"
        />
        <font-awesome-icon
          icon="align-right"
          class="icon"
          :class="{
            'icon--active': isAlign('right'),
          }"
          @click="setTextAlign('right')"
        />
        <font-awesome-icon
          icon="align-justify"
          class="icon"
          :class="{
            'icon--active': isAlign('justify'),
          }"
          @click="setTextAlign('justify')"
        />
      </div>
    </div>
    <div class="table-wrapper">
      <table :key="spreadsheetKey" @mouseout="resetHover">
        <thead>
          <draggable
            tag="tr"
            :model-value="headers"
            item-key="index"
            :animation="200"
            ghost-class="ghost"
            @start="drag = true"
            @end="drag = false"
            @change="onColumnOrderChange"
          >
            <template #item="{ element }">
              <th
                class="p-0"
                :class="{ 'selected-column selected-column--top': isSelectedColumn(element.index) }"
                @click="selectColumn(element.index)"
                @contextmenu.prevent.stop="showContextMenu($event, -1, element.index - 1)"
              >
                <div
                  class="spreadsheet-handle spreadsheet-handle--top"
                  :data-column-header="element.value.header.value"
                >
                  <font-awesome-icon icon="grip-vertical" />
                </div>
              </th>
            </template>
            <template #footer>
              <th class="p-0 add">
                <div class="add-column" @click="addColumn">
                  <font-awesome-icon icon="plus" />
                </div>
              </th>
            </template>
          </draggable>
          <tr :class="{ selected: isSelectedHeaderRow() }">
            <th class="p-0 selectable" @click="selectHeaderRow()">
              <div class="spreadsheet-handle spreadsheet-handle--left" />
            </th>
            <styled-table-cell
              v-for="(header, index) of table.header"
              :key="'dnd-t-h-' + index"
              :class="{
                'selected selected--left selected--right selected--bottom selected-top':
                  isSelectedHeaderCell(index),
                'selected-column': isSelectedColumn(index + 1),
                'selected--deletion': isSelectedForDeletion(-1, index),
              }"
              :model-value="header.header"
              @update:modelValue="cellUpdated(header.header, $event, -1, index)"
              tag="th"
              @click="selectHeaderCell(index)"
              @contextmenu.prevent.stop="showContextMenu($event, -1, index)"
            />
          </tr>
        </thead>
        <draggable
          tag="tbody"
          item-key="index"
          ghost-class="ghost"
          handle=".spreadsheet-handle"
          :model-value="rows"
          :animation="200"
          @start="drag = true"
          @end="drag = false"
          @change="onRowOrderChange"
        >
          <template #item="{ element }">
            <tr :class="{ selected: isSelectedRow(element.index) }">
              <td
                class="p-0"
                @click="selectRow(element.index)"
                @contextmenu.prevent.stop="showContextMenu($event, element.index, -1)"
              >
                <div class="spreadsheet-handle spreadsheet-handle--left">
                  <font-awesome-icon icon="grip-horizontal" />
                </div>
              </td>
              <styled-table-cell
                update-on-blur
                v-for="(cell, cIndex) of element.value.columns"
                :key="'dnd-t-r-' + element.index + '-c-' + cIndex"
                :class="{
                  selected: isSelectedCell(element.index, cIndex) || isSelectedRow(element.index),
                  'selected--left': isSelectedLeftCell(element.index, cIndex),
                  'selected--right': isSelectedRightCell(element.index, cIndex),
                  'selected--top': isSelectedTopCell(element.index, cIndex),
                  'selected--bottom': isSelectedBottomCell(element.index, cIndex),
                  'selected--middle': isSelectedMiddleCell(element.index, cIndex),
                  'selected selected--left selected--right': isSelectedColumn(cIndex + 1),
                  'selected selected--left selected--right selected--bottom':
                    isSelectedColumn(cIndex + 1) && element.index === rows.length - 1,
                  'selected--deletion': isSelectedForDeletion(element.index, cIndex),
                }"
                :model-value="cell"
                @update:modelValue="cellUpdated(cell, $event, element.index, cIndex)"
                @mousedown="startSelectCell(element.index, cIndex)"
                @mouseup="endSelectCell(element.index, cIndex)"
                @mouseover="moveSelectCell(element.index, cIndex)"
                @contextmenu.prevent.stop="showContextMenu($event, element.index, cIndex)"
              />
              <td class="delete" :class="{ 'delete--show': isHovered(element.index, undefined) }">
                <div
                  class="delete-button delete-button--right"
                  @mouseenter="selectDeleteRow(element.index)"
                  @mouseleave="deselectDeleteRow"
                  @click="actions.rowDelete(element.index)"
                >
                  <font-awesome-icon icon="trash-alt" />
                </div>
              </td>
            </tr>
          </template>
        </draggable>
        <tfoot>
          <tr>
            <th class="p-0 add">
              <div class="add-row" @click="addRow">
                <font-awesome-icon icon="plus" />
              </div>
            </th>
            <td
              v-for="(header, index) of table.header"
              :key="'dnd-t-f-' + index"
              class="delete"
              :class="{ 'delete--show': isHovered(undefined, index) }"
            >
              <div
                class="delete-button delete-button--bottom"
                @mouseenter="selectDeleteColumn(index)"
                @mouseleave="deselectDeleteColumn"
                @click="actions.columnDelete(index)"
              >
                <font-awesome-icon icon="trash-alt" />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      <div class="top-header" />
      <div class="left-header" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Options } from "vue-property-decorator";
import {
  Table,
  TableColumn,
  TableRow,
  createHeader,
  TableCell,
  TableActions,
  TableCellInfo,
} from "@/models/document/table";
import draggable from "vuedraggable";
import { DragAndDropEvent, DragAndDropWrapper, InsertPosition, TextAlign } from "@/models";
import { cloneDeep, uniq } from "lodash";
import StyledTableCell from "@/components/app/ui/spreadsheet/cell/StyledTableCell.vue";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import { ContextMenuConfig, ContextMenuEntry, SEPERATOR } from "@/components/app/ui/context-menu/ContextMenu.vue";
import { ContextMenuShowEvent, CONTEXT_MENU_SHOW_EVENT_NAME } from "@/events/contextmenu";
import emitter from "@/emitter";
import objectHash from "object-hash";

const EMPTY_STRING = "";
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20];
const DEFAULT_FONT = "sans-serif";
const DEFAULT_FONT_SIZE = "12pt";
const DEFAULT_COLOR = "#ffffff";

interface TableSelection {
  startRowId?: number;
  endRowId?: number;
  startColumnId?: number;
  endColumnId?: number;
  header: boolean;
}

interface TableHover {
  row?: number;
  column?: number;
}

@Options({
  components: {
    draggable,
    StyledTableCell,
  },
})
export default class Spreadsheet extends Vue {
  @Prop({ type: Object, required: true })
  private readonly modelValue!: Table;

  @Prop({ type: Object, required: true })
  private readonly actions!: TableActions;

  private drag = false;
  private selecting = false;

  private selection: TableSelection = {
    header: false,
  };

  private hover: TableHover = {};

  private deleteSelection: TableHover = {};

  private get table(): Table {
    return this.modelValue;
  }

  private set table(value: Table) {
    this.$emit("update:modelValue", value);
  }

  private get spreadsheetKey(): string {
    return objectHash(cloneDeep(this.modelValue));
  }

  private get rows(): DragAndDropWrapper<TableRow>[] {
    return this.table.rows.map((element: TableRow, index: number) => ({
      value: element,
      index: index,
    }));
  }

  private get headers(): DragAndDropWrapper<TableColumn>[] {
    return [createHeader("")]
      .concat(this.table.header)
      .map((element: TableColumn, index: number) => ({
        value: element,
        index: index,
      }));
  }

  private onRowOrderChange(event: DragAndDropEvent<DragAndDropWrapper<TableRow>>) {
    if (event.moved) {
      this.deselect();
      this.actions.rowOrderChanged(
        event.moved.oldIndex,
        event.moved.newIndex,
        event.moved.element.value
      );
    } else {
      console.error("Unexpected Drag'n'Drop Event!", event);
    }
  }

  private onColumnOrderChange(event: DragAndDropEvent<DragAndDropWrapper<TableColumn>>) {
    if (event.moved) {
      this.deselect();
      const oldIndex = event.moved.oldIndex - 1;
      const newIndex = event.moved.newIndex - 1;
      this.actions.columnOrderChanged(oldIndex, newIndex);
    } else {
      console.error("Unexpected Drag'n'Drop Event!", event);
    }
  }

  private selectColumn(columnId: number) {
    this.selection.startRowId = undefined;
    this.selection.endRowId = undefined;
    this.selection.startColumnId = columnId;
    this.selection.endColumnId = columnId;
    this.selection.header = false;
  }

  private isSelectedColumn(columnId: number): boolean {
    return (
      this.selection.startRowId === undefined &&
      this.selection.endRowId === undefined &&
      this.selection.startColumnId === columnId &&
      this.selection.endColumnId === columnId &&
      this.selection.header === false
    );
  }

  private selectHeaderCell(headerId: number) {
    this.selection.startRowId = undefined;
    this.selection.endRowId = undefined;
    this.selection.startColumnId = headerId;
    this.selection.endColumnId = headerId;
    this.selection.header = true;
  }

  private isSelectedHeaderCell(headerId: number): boolean {
    return (
      this.selection.startRowId === undefined &&
      this.selection.endRowId === undefined &&
      this.selection.startColumnId === headerId &&
      this.selection.endColumnId === headerId &&
      this.selection.header === true
    );
  }

  private selectHeaderRow() {
    this.selection.startRowId = undefined;
    this.selection.endRowId = undefined;
    this.selection.startColumnId = undefined;
    this.selection.endColumnId = undefined;
    this.selection.header = true;
  }

  private isSelectedHeaderRow(): boolean {
    return (
      this.selection.startRowId === undefined &&
      this.selection.endRowId === undefined &&
      this.selection.startColumnId === undefined &&
      this.selection.endColumnId === undefined &&
      this.selection.header === true
    );
  }

  private selectRow(rowId: number) {
    this.selection.startRowId = rowId;
    this.selection.endRowId = rowId;
    this.selection.startColumnId = undefined;
    this.selection.endColumnId = undefined;
    this.selection.header = false;
  }

  private isSelectedRow(rowId: number): boolean {
    return (
      this.selection.startRowId === rowId &&
      this.selection.endRowId === rowId &&
      this.selection.startColumnId === undefined &&
      this.selection.endColumnId === undefined &&
      this.selection.header === false
    );
  }

  private selectCell(rowId: number, columnId: number) {
    this.selection.startRowId = rowId;
    this.selection.endRowId = rowId;
    this.selection.startColumnId = columnId;
    this.selection.endColumnId = columnId;
    this.selection.header = false;
  }

  private hoverCell(rowId: number, columnId: number) {
    this.hover.row = rowId;
    this.hover.column = columnId;
  }

  private resetHover() {
    this.hover.row = undefined;
    this.hover.column = undefined;
  }

  private isHovered(rowId: number, columnId: number): boolean {
    if (rowId !== undefined) {
      return this.hover.row === rowId;
    } else if (columnId !== undefined) {
      return this.hover.column === columnId;
    } else {
      return false;
    }
  }

  private selectDeleteColumn(columnId: number) {
    this.deleteSelection.row = undefined;
    this.deleteSelection.column = columnId;
  }

  private deselectDeleteColumn() {
    this.deleteSelection.row = undefined;
    this.deleteSelection.column = undefined;
  }

  private selectDeleteRow(rowId: number) {
    this.deleteSelection.row = rowId;
    this.deleteSelection.column = undefined;
  }

  private deselectDeleteRow() {
    this.deleteSelection.row = undefined;
    this.deleteSelection.column = undefined;
  }

  private isSelectedForDeletion(rowId: number, columnId: number): boolean {
    return this.deleteSelection.row === rowId || this.deleteSelection.column === columnId;
  }

  private startSelectCell(rowId: number, columnId: number) {
    this.selection.startRowId = rowId;
    this.selection.endRowId = undefined;
    this.selection.startColumnId = columnId;
    this.selection.endColumnId = undefined;
    this.selection.header = false;
    this.selecting = true;
  }

  private endSelectCell(rowId: number, columnId: number) {
    this.selection.endRowId = rowId;
    this.selection.endColumnId = columnId;
    this.selecting = false;
  }

  private moveSelectCell(rowId: number, columnId: number) {
    if (this.selecting) {
      this.selection.endRowId = rowId;
      this.selection.endColumnId = columnId;
    } else {
      this.hoverCell(rowId, columnId);
    }
  }

  private isSelectedCell(rowId: number, columnId: number): boolean {
    return (
      this.isBetweenInklusive(this.selection.startRowId, rowId, this.selection.endRowId) &&
      this.isBetweenInklusive(this.selection.startColumnId, columnId, this.selection.endColumnId) &&
      this.selection.header === false
    );
  }

  private isSelectedLeftCell(rowId: number, columnId: number): boolean {
    const startColumnId = this.selection.startColumnId ?? Number.MAX_VALUE;
    const endColumnId = this.selection.endColumnId ?? Number.MAX_VALUE;
    const leftColumnId = Math.min(startColumnId, endColumnId);
    return this.isSelectedCell(rowId, columnId) && leftColumnId === columnId;
  }

  private isSelectedRightCell(rowId: number, columnId: number): boolean {
    const startColumnId = this.selection.startColumnId ?? Number.MIN_VALUE;
    const endColumnId = this.selection.endColumnId ?? Number.MIN_VALUE;
    const rightColumnId = Math.max(startColumnId, endColumnId);
    return this.isSelectedCell(rowId, columnId) && rightColumnId === columnId;
  }

  private isSelectedTopCell(rowId: number, columnId: number): boolean {
    const startRowId = this.selection.startRowId ?? Number.MAX_VALUE;
    const endRowId = this.selection.endRowId ?? Number.MAX_VALUE;
    const topRowId = Math.min(startRowId, endRowId);
    return this.isSelectedCell(rowId, columnId) && topRowId === rowId;
  }

  private isSelectedBottomCell(rowId: number, columnId: number): boolean {
    const startRowId = this.selection.startRowId ?? Number.MIN_VALUE;
    const endRowId = this.selection.endRowId ?? Number.MIN_VALUE;
    const bottomRowId = Math.max(startRowId, endRowId);
    return this.isSelectedCell(rowId, columnId) && bottomRowId === rowId;
  }

  private isSelectedMiddleCell(rowId: number, columnId: number): boolean {
    return (
      this.isBetween(this.selection.startRowId, rowId, this.selection.endRowId) &&
      this.isBetween(this.selection.startColumnId, columnId, this.selection.endColumnId) &&
      this.selection.header === false
    );
  }

  private isBetween(start: number | undefined, value: number, end: number | undefined): boolean {
    return (
      start !== undefined &&
      end !== undefined &&
      value > Math.min(start, end) &&
      value < Math.max(start, end)
    );
  }

  private isBetweenInklusive(
    start: number | undefined,
    value: number,
    end: number | undefined
  ): boolean {
    return (
      start !== undefined &&
      end !== undefined &&
      value >= Math.min(start, end) &&
      value <= Math.max(start, end)
    );
  }

  private deselect() {
    this.selecting = false;
    this.selection.startRowId = undefined;
    this.selection.endRowId = undefined;
    this.selection.startColumnId = undefined;
    this.selection.endColumnId = undefined;
    this.selection.header = false;
  }

  private onClickOutside() {
    this.deselect();
  }

  private get font(): string {
    const fonts: string[] = uniq(
      this.getAllSelected()
        .map((cell) => (cell.style.font ? cell.style.font : EMPTY_STRING))
        .filter((font) => font !== EMPTY_STRING)
    );
    return fonts.length === 1 ? fonts[0] : DEFAULT_FONT;
  }

  private set font(value: string) {
    this.cellsUpdated((info) => (info.cell.style.font = value));
  }

  private get size(): string {
    const sizes: string[] = uniq(
      this.getAllSelected()
        .map((cell) => (cell.style.size ? cell.style.size : EMPTY_STRING))
        .filter((font) => font !== EMPTY_STRING)
    );
    return sizes.length === 1 ? sizes[0] : DEFAULT_FONT_SIZE;
  }

  private set size(value: string) {
    this.cellsUpdated((info) => (info.cell.style.size = value));
  }

  private get sizes(): DropdownItem[] {
    return FONT_SIZES.map((size) => ({
      name: size + "pt",
      value: size + "pt",
    }));
  }

  private get color(): string {
    const colors: string[] = uniq(
      this.getAllSelected()
        .map((cell) => (cell.style.color ? cell.style.color : EMPTY_STRING))
        .filter((font) => font !== EMPTY_STRING)
    );
    return colors.length === 1 ? colors[0] : DEFAULT_COLOR;
  }

  private set color(value: string) {
    this.cellsUpdated((info) => (info.cell.style.color = value));
  }

  private get isBold(): boolean {
    const selected = this.getAllSelected();
    return selected.length === 0 ? false : selected.every((cell) => cell.style.bold);
  }

  private toggleBold() {
    if (this.isBold) {
      this.cellsUpdated((info) => (info.cell.style.bold = undefined));
    } else {
      this.cellsUpdated((info) => (info.cell.style.bold = true));
    }
  }

  private get isItalic(): boolean {
    const selected = this.getAllSelected();
    return selected.length === 0 ? false : selected.every((cell) => cell.style.italic);
  }

  private toggleItalic() {
    if (this.isItalic) {
      this.cellsUpdated((info) => (info.cell.style.italic = undefined));
    } else {
      this.cellsUpdated((info) => (info.cell.style.italic = true));
    }
  }

  private get isUnderline(): boolean {
    const selected = this.getAllSelected();
    return selected.length === 0 ? false : selected.every((cell) => cell.style.underline);
  }

  private toggleUnderline() {
    if (this.isUnderline) {
      this.cellsUpdated((info) => (info.cell.style.underline = undefined));
    } else {
      this.cellsUpdated((info) => (info.cell.style.underline = true));
    }
  }

  private get isStrike(): boolean {
    const selected = this.getAllSelected();
    return selected.length === 0 ? false : selected.every((cell) => cell.style.strike);
  }

  private toggleStrike() {
    if (this.isStrike) {
      this.cellsUpdated((info) => (info.cell.style.strike = undefined));
    } else {
      this.cellsUpdated((info) => (info.cell.style.strike = true));
    }
  }

  private isAlign(align: TextAlign): boolean {
    const selected = this.getAllSelected();
    return selected.length === 0 ? false : selected.every((cell) => cell.style.align === align);
  }

  private setTextAlign(align: TextAlign) {
    this.cellsUpdated((info) => (info.cell.style.align = align));
  }

  private cellsUpdated(updateFunction: (cell: TableCellInfo) => void) {
    const oldCells = this.getAllSelectedInfo();
    const newCells = cloneDeep(oldCells);
    newCells.forEach(updateFunction);
    this.actions.cellsChanged(oldCells, newCells);
  }

  private getAllSelected(): TableCell[] {
    return this.getAllSelectedInfo().map((info) => info.cell);
  }

  private getAllSelectedInfo(): TableCellInfo[] {
    const selectedHeaderCells: TableCellInfo[] = [];
    for (let columnId = 0; columnId < this.table.header.length; columnId++) {
      if (
        this.isSelectedHeaderCell(columnId) ||
        this.isSelectedColumn(columnId + 1) ||
        this.isSelectedHeaderRow()
      ) {
        const info: TableCellInfo = {
          row: -1,
          column: columnId,
          cell: this.table.header[columnId].header,
        };
        selectedHeaderCells.push(info);
      }
    }

    const selectedBodyCells: TableCellInfo[] = [];
    for (let rowId = 0; rowId < this.table.rows.length; rowId++) {
      const row = this.table.rows[rowId];
      for (let columnId = 0; columnId < row.columns.length; columnId++) {
        if (this.isSelected(rowId, columnId)) {
          const info: TableCellInfo = {
            row: rowId,
            column: columnId,
            cell: row.columns[columnId],
          };
          selectedBodyCells.push(info);
        }
      }
    }
    return selectedHeaderCells.concat(selectedBodyCells);
  }

  private isSelected(rowId: number, columnId: number): boolean {
    const selectedLeftCell = this.isSelectedLeftCell(rowId, columnId);
    const selectedRightCell = this.isSelectedRightCell(rowId, columnId);
    const selectedTopCell = this.isSelectedTopCell(rowId, columnId);
    const selectedBottomCell = this.isSelectedBottomCell(rowId, columnId);
    const selectedMiddleCell = this.isSelectedMiddleCell(rowId, columnId);
    const selectedRow = this.isSelectedRow(rowId);
    const selectedColumn = this.isSelectedColumn(columnId + 1);
    const selectedCell =
      this.isSelectedCell(rowId, columnId) &&
      (selectedLeftCell ||
        selectedRightCell ||
        selectedTopCell ||
        selectedBottomCell ||
        selectedMiddleCell);
    return selectedRow || selectedColumn || selectedCell;
  }

  private cellUpdated(oldValue: TableCell, newValue: TableCell, row: number, column: number) {
    this.actions.cellChanged(row, column, oldValue, newValue);
  }

  private showContextMenu($event: MouseEvent, rowId: number, columnId: number) {
    const contextMenuEntries: ContextMenuEntry[] = [];
    if (rowId >= 0) {
      contextMenuEntries.push(
        SEPERATOR("spreadsheet-editor.context-menu.row.label"),
        {
          label: "spreadsheet-editor.context-menu.row.add.before",
          class: "new-page new-page--before",
          icon: "plus-circle",
          icon2: "chevron-up",
          action: () => this.actions.rowAdd(rowId, InsertPosition.BEFORE),
        },
        {
          label: "spreadsheet-editor.context-menu.row.add.after",
          class: "new-page new-page--after",
          icon: "plus-circle",
          icon2: "chevron-down",
          action: () => this.actions.rowAdd(rowId, InsertPosition.AFTER),
        },
        {
          label: "spreadsheet-editor.context-menu.row.duplicate",
          icon: "copy",
          action: () => this.actions.rowDuplicate(rowId),
        },
        {
          label: "spreadsheet-editor.context-menu.row.delete",
          icon: "trash-alt",
          dangerous: true,
          action: () => this.actions.rowDelete(rowId),
        }
      );
    }
    if (columnId >= 0) {
      contextMenuEntries.push(
        SEPERATOR("spreadsheet-editor.context-menu.column.label"),
        {
          label: "spreadsheet-editor.context-menu.column.add.before",
          class: "new-column new-column--left",
          icon: "plus-circle",
          icon2: "chevron-left",
          action: () => this.actions.columnAdd(columnId, InsertPosition.BEFORE),
        },
        {
          label: "spreadsheet-editor.context-menu.column.add.after",
          class: "new-column new-column--right",
          icon: "plus-circle",
          icon2: "chevron-right",
          action: () => this.actions.columnAdd(columnId, InsertPosition.AFTER),
        },
        {
          label: "spreadsheet-editor.context-menu.column.duplicate",
          icon: "copy",
          action: () => this.actions.columnDuplicate(columnId),
        },
        {
          label: "spreadsheet-editor.context-menu.column.delete",
          icon: "trash-alt",
          dangerous: true,
          action: () => this.actions.columnDelete(columnId),
        }
      );
    }
    const payload: ContextMenuConfig = {
      entries: contextMenuEntries,
      noWrap: true,
      mousePosition: {
        x: $event.x,
        y: $event.y,
      },
    };
    const event: ContextMenuShowEvent = {
      name: CONTEXT_MENU_SHOW_EVENT_NAME,
      payload: payload,
    };
    emitter.$emit(CONTEXT_MENU_SHOW_EVENT_NAME, event);
  }

  private addColumn() {
    const lastColumnId = this.modelValue.header.length - 1;
    this.actions.columnAdd(lastColumnId, InsertPosition.AFTER);
  }

  private addRow() {
    const lastRowId = this.modelValue.rows.length - 1;
    this.actions.rowAdd(lastRowId, InsertPosition.AFTER);
  }
}
</script>

<style lang="scss" scoped>
.spreadsheet {
  height: 100%;
  display: flex;
  flex-direction: column;

  > .table-wrapper {
    flex: 1 0 auto;
    overflow: auto;
    position: relative;
    max-height: calc(100vh - 240px - 6rem);

    > .top-header,
    > .left-header {
      position: absolute;
      top: 0;
      left: 0;
      background-color: var(--color-foreground--dark);
      border: 1px solid var(--color-foreground);
      min-width: 1.5rem;
      min-height: 1.5rem;
      z-index: 0;
    }

    > .top-header {
      right: 0;
    }

    > .left-header {
      bottom: 0;
    }

    > table {
      position: relative;
      z-index: 1;
    }
  }
}

.spreadsheet-tools {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.5em 0;
  background-color: var(--color-background--light);

  .icon {
    color: var(--color-foreground--dark);
    cursor: pointer;

    &:hover,
    &--active {
      color: var(--color-secondary);
    }
  }

  .menu-group {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    > * {
      margin: 0 0.5em;
    }

    &:not(:last-child) {
      border-right: 2px solid var(--color-foreground--dark);
    }
  }
}

table {
  border-spacing: 0;

  thead {
    tr {
      th:first-child:not(.selectable) {
        pointer-events: none;
      }

      th.selectable {
        .spreadsheet-handle--left {
          cursor: default;
        }
      }

      th:not(:first-child) {
        > .spreadsheet-handle--top {
          border-left-width: 0;
        }
      }
    }
  }

  td.p-0,
  th.p-0 {
    padding: 0;
  }

  tr.selected {
    outline: 1px solid var(--color-secondary);
  }

  td.selected,
  th.selected {
    position: relative;

    &::after {
      content: "";
      display: block;
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      border: 1px solid transparent;
      pointer-events: none;
    }

    &--top {
      &::after {
        border-top-color: var(--color-secondary);
      }
    }

    &--bottom {
      &::after {
        border-bottom-color: var(--color-secondary);
      }
    }

    &--left {
      &::after {
        border-left-color: var(--color-secondary);
      }
    }

    &--right {
      &::after {
        border-right-color: var(--color-secondary);
      }
    }

    &--deletion {
      background-color: var(--color-alert--light);
    }
  }

  td,
  th {
    user-select: none;

    &.selected-column {
      position: relative;

      &::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: -1px;
        right: -1px;
        bottom: 0;
        border-left: 1px solid var(--color-secondary);
        border-right: 1px solid var(--color-secondary);
        pointer-events: none;
      }

      &--top {
        &::after {
          top: -1px;
          border-top: 1px solid var(--color-secondary);
        }
      }

      &--bottom {
        &::after {
          bottom: -1px;
          border-bottom: 1px solid var(--color-secondary);
        }
      }
    }

    &:deep(:focus-visible) {
      outline: none;
    }
  }
}

.spreadsheet-handle {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-foreground--dark);
  border: 1px solid var(--color-foreground);
  min-width: 1.5rem;
  min-height: 1.5rem;
  cursor: grab;

  &--left {
    border-top-width: 0;
  }

  > svg {
    opacity: 0;
  }

  &:hover > svg {
    opacity: 1;
  }
}

.add {
  text-align: center;
  color: var(--color-background);

  &:hover {
    background-color: var(--color-primary);
  }

  &-row,
  &-column {
    margin: 0.25em;
    cursor: pointer;
    font-size: 0.8em;
  }
}

.delete {
  position: relative;
  text-align: center;
  opacity: 0;

  &:hover,
  &--show {
    opacity: 1;
  }

  &-button {
    color: var(--color-foreground);
    cursor: pointer;
    font-size: 0.8em;
    padding: 0.25em 0.5em;
    background-color: var(--color-alert);
    border-radius: var(--border-radius);
    margin: 0.25em;

    &:hover {
      background-color: var(--color-alert--light);
    }

    &--right:hover {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 20px;
        border: 10px solid transparent;
        border-left-color: var(--color-alert--light);
        z-index: -1;
      }
    }

    &--bottom:hover {
      border-top-left-radius: 0;
      border-top-right-radius: 0;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 20px;
        border: 10px solid transparent;
        border-top-color: var(--color-alert--light);
        z-index: -1;
      }
    }
  }
}
</style>
