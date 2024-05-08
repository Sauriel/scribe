<template>
  <div class="table">
    <table>
      <thead>
        <tr>
          <th v-for="(col, index) of table.header.cols" :key="index">
            <dropdown
              :items="alignments"
              v-model="col.align"
            />
            <text-input v-model="col.content" class="header-input" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) of table.rows" :key="rowIndex">
          <td
            v-for="(col, colIndex) of row.cols"
            :key="colIndex"
            :class="{
              'col--selected': selectedField.rowIndex === rowIndex && selectedField.colIndex === colIndex
            }"
            @contextmenu.prevent.stop="openContextMenu($event, { content: col.content, rowIndex, colIndex })"
            @click="selectedField = { content: col.content, rowIndex, colIndex }"
          >
            <table-editable-col
              v-model="col.content"
              :edit="selectedField.rowIndex === rowIndex && selectedField.colIndex === colIndex"
            />
          </td>
          <td v-if="rowIndex === 0" :rowspan="table.rows.length">
            <div class="add-col" @click="addNewCol">
              <span />
              <div class="icon">
                <font-awesome-icon icon="plus" />
              </div>
              <span />
            </div>
          </td>
        </tr>
        <tr class="no-bg">
          <td :colspan="table.header.cols.length">
            <div class="add-row" @click="addNewRow">
              <span />
              <div class="icon">
                <font-awesome-icon icon="plus" />
              </div>
              <span />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <vue-simple-context-menu
      :elementId="'table-col-menu--' + id"
      :options="colContextMenu"
      :ref="'colContextMenu--' + id"
      @option-clicked="optionClicked"
    />
  </div>
</template>

<script lang="ts">
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown.vue';
import { Table, TableColAlign, TableElementCol, TableElementHeadRow, TableElementRow } from '@/models/layout-elements/TableElement';
import { Component, Prop, Vue } from 'vue-property-decorator';
import TableEditableCol from "@/components/layout-elements/settings/table/TableEditableCol.vue";

enum TableFieldOperator {
  DIVIDER = "DIVIDER",
  DELETE_ROW = "DELETE_ROW",
  DELETE_COL = "DELETE_COL",
  INSERT_LEFT = "INSERT_LEFT",
  INSERT_RIGHT = "INSERT_RIGHT",
  INSERT_TOP = "INSERT_TOP",
  INSERT_BOTTOM = "INSERT_BOTTOM"
}

interface TableField {
  content: string;
  rowIndex: number;
  colIndex: number;
}

interface TableFieldContextOption {
  name: string;
  operation: TableFieldOperator;
  type?: string;
  class?: string;
}

interface ContextMenuItemClickedEvent {
  item: TableField;
  option: TableFieldContextOption;
}

const trashIconHtml = "<svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='trash-alt' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' class='svg-inline--fa fa-trash-alt fa-w-14'><path fill='currentColor' d='M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z'></path></svg>";
const arrowUpIconHtml = "<svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='arrow-up' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' class='svg-inline--fa fa-arrow-up fa-w-14'><path fill='currentColor' d='M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z'></path></svg>";
const arrowDownIconHtml = "<svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='arrow-down' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' class='svg-inline--fa fa-arrow-down fa-w-14'><path fill='currentColor' d='M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z'></path></svg>";
const arrowLeftIconHtml = "<svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='arrow-left' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' class='svg-inline--fa fa-arrow-left fa-w-14'><path fill='currentColor' d='M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z'></path></svg>";
const arrowRiwghtIconHtml = "<svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='arrow-right' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' class='svg-inline--fa fa-arrow-right fa-w-14'><path fill='currentColor' d='M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z'></path></svg>";

@Component({ components: { Dropdown, TableEditableCol }})
export default class TableSettings extends Vue {
  @Prop(String)
  readonly id!: string;

  @Prop(Object)
  readonly value!: Table;

  private get table(): Table {
    return this.value;
  }

  private set table(value: Table) {
    this.$emit("input", value);
  }

  private selectedField: TableField = { content: "", colIndex: -1, rowIndex: -1 };

  private colContextMenu: TableFieldContextOption[] = [
    {
      name: trashIconHtml + "Delete row",
      operation: TableFieldOperator.DELETE_ROW,
      class: "delete"
    },
    {
      name: arrowUpIconHtml + "Insert new row above",
      operation: TableFieldOperator.INSERT_TOP
    },
    {
      name: arrowDownIconHtml + "Insert new row below",
      operation: TableFieldOperator.INSERT_BOTTOM
    },
    {
      name: "",
      operation: TableFieldOperator.DIVIDER,
      type: "divider"
    },
    {
      name: trashIconHtml + "Delete column",
      operation: TableFieldOperator.DELETE_COL,
      class: "delete"
    },
    {
      name: arrowLeftIconHtml + "Insert new column to the left",
      operation: TableFieldOperator.INSERT_LEFT
    },
    {
      name: arrowRiwghtIconHtml + "Insert new column to the right",
      operation: TableFieldOperator.INSERT_RIGHT
    }
  ];

  private get alignments(): DropdownItem[] {
    const types: DropdownItem[] = [
      { name: "Left", value: TableColAlign.LEFT },
      { name: "Center", value: TableColAlign.CENTER },
      { name: "Right", value: TableColAlign.RIGHT }
      ];
    return types;
  }

  private removeCol(colIndex: number) {
    this.table.header.cols.splice(colIndex, 1);
    for (const row of this.table.rows) {
      row.cols.splice(colIndex, 1);
    }
  }

  private addNewCol() {
    this.addCol(this.table.header.cols.length);
  }

  private addCol(colIndex: number) {
    this.table.header.cols.splice(colIndex, 0, { content: "Header", align: TableColAlign.CENTER });
    for (const row of this.table.rows) {
      row.cols.splice(colIndex, 0, { content: "—" });
    }
  }

  private removeRow(rowIndex: number) {
    this.table.rows.splice(rowIndex, 1);
  }

  private addNewRow() {
    this.addRow(this.table.rows.length);
  }

  private addRow(rowIndex: number) {
    const colCount = this.table.header.cols.length;
    const cols: TableElementCol[] = new Array(colCount);
    for (let i = 0; i < colCount; i++) {
      cols[i] = { content: "—" };
    }
    const row: TableElementRow = { cols };
    this.table.rows.splice(rowIndex, 0, row);
  }

  private openContextMenu(event: MouseEvent, field: TableField) {
    this.selectedField = field;
    const contextMenuRef = "colContextMenu--" + this.id;
    // @ts-ignore
    this.$refs[contextMenuRef].showMenu(event, field);
  }

  private optionClicked (event: ContextMenuItemClickedEvent) {
    this.selectedField = { content: "", colIndex: -1, rowIndex: -1 };
    switch (event.option.operation) {
      case TableFieldOperator.DELETE_ROW:
        this.removeRow(event.item.rowIndex);
        break;
      case TableFieldOperator.INSERT_TOP:
        this.addRow(event.item.rowIndex);
        break;
      case TableFieldOperator.INSERT_BOTTOM:
        this.addRow(event.item.rowIndex + 1);
        break;
      case TableFieldOperator.DELETE_COL:
        this.removeCol(event.item.colIndex);
        break;
      case TableFieldOperator.INSERT_LEFT:
        this.addCol(event.item.colIndex);
        break;
      case TableFieldOperator.INSERT_RIGHT:
        this.addCol(event.item.colIndex + 1);
        break;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/colors.scss";

table {
  margin-top: 10px;
  border-spacing: 0;

  thead {
    background-color: $backgroundDark;

    th {
      .header-input {
        font-weight: bold;
        width: 120px;
      }
    }
  }

  td, th {
    padding: 5px 10px;
  }

  &:hover {
    .add-row, .add-col {
      opacity: 1;
    }
  }

  td {
    height: 1px;

    &.col--selected {
      outline: 2px solid $info;
    }

    .add-row, .add-col {
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity .2s ease-in-out;
      cursor: pointer;

      > span {
        flex: 1 1 auto;
        border-bottom: 2px solid $info;
      }

      .icon {
        flex: 0 0 auto;
        background-color: $info;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $background;
      }
    }

    .add-row {
       > span {
        height: 0;
        border-bottom: 2px solid $info;
      }
    }

    .add-col {
      flex-direction: column;
      height: 100%;

       > span {
        width: 0;
        border-right: 2px solid $info;
      }
    }
  }

  tbody tr:nth-child(even):not(.no-bg) {
    background-color: $backgroundLight;
  }
}

.table::v-deep ul[id^=table-col-menu--] {
  background-color: $foreground;
  color: $background;
  position: fixed;

  .vue-simple-context-menu {
    &__item {
      svg {
        margin-right: 10px;
      }

      &.delete {
        background-color: $alert;
        color: $foreground;
      }

      &:hover {
        background-color: $primary;
      }
    }
  }
}
</style>
