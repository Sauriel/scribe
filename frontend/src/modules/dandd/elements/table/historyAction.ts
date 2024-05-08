import { Table, TableColumn } from "@/models/document/table";
import { InsertPosition } from "@/models/index";
import {
  createRow,
  createCell,
  createHeader,
  TableCell,
  TableCellInfo,
  TableRow,
} from "@/models/document/table";
import { Action, HistoryContext } from "@/history/HistoryManager";
import DandDTableElementModel, { DandDTableBorderImage, DandDTableType } from "@/modules/dandd/elements/table/DandDTableElementModel";
import { assign, cloneDeep, isEqual } from "lodash";

export class ChangeDandDTableCellAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.table.cell.change";
  public readonly originalValue: TableCell;

  constructor(
    public readonly element: DandDTableElementModel,
    public readonly row: number,
    public readonly column: number,
    originalValue: TableCell,
    public readonly newValue: TableCell
  ) {
    this.originalValue = cloneDeep(originalValue);
  }

  public revert(context: HistoryContext): boolean {
    const cell = this.getCell();
    if (isEqual(cell, this.newValue)) {
      cell.value = this.originalValue.value;
      cell.style = this.originalValue.style;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    const cell = this.getCell();
    if (isEqual(cell, this.originalValue)) {
      cell.value = this.newValue.value;
      cell.style = this.newValue.style;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }

  private getCell(): TableCell {
    if (this.row < 0) {
      // is header
      return this.element.table.header[this.column].header;
    } else {
      return this.element.table.rows[this.row].columns[this.column];
    }
  }
}

export class ChangeDandDTableCellsAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.table.cells.change";
  public readonly originalValue: TableCellInfo[];

  constructor(
    public readonly element: DandDTableElementModel,
    originalValue: TableCellInfo[],
    public readonly newValue: TableCellInfo[]
  ) {
    this.originalValue = cloneDeep(originalValue);
  }

  public revert(context: HistoryContext): boolean {
    if (this.newAllEquals(this.newValue)) {
      this.changeValues(this.originalValue);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.newAllEquals(this.originalValue)) {
      this.changeValues(this.newValue);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }

  private changeValues(infos: TableCellInfo[]) {
    for (const info of infos) {
      const cell = this.getCell(info);
      cell.value = info.cell.value;
      cell.style = info.cell.style;
    }
  }

  private newAllEquals(infos: TableCellInfo[]): boolean {
    let allEquals = true;
    for (const info of infos) {
      allEquals = allEquals && isEqual(info.cell, this.getCell(info));
    }
    return allEquals;
  }

  private getCell(info: TableCellInfo): TableCell {
    if (info.row < 0) {
      // is header
      return this.element.table.header[info.column].header;
    } else {
      return this.element.table.rows[info.row].columns[info.column];
    }
  }
}

export class ChangeDandDTableColumnOrderAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.table.order.column.change";

  constructor(
    public readonly element: DandDTableElementModel,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.isInRange()) {
      this.changeOrder(this.newValue, this.originalValue);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.isInRange()) {
      this.changeOrder(this.originalValue, this.newValue);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }

  private isInRange(): boolean {
    return (
      this.element.table.header.length >= this.originalValue &&
      this.element.table.header.length >= this.newValue
    );
  }

  private changeOrder(from: number, to: number) {
    const table = this.element.table;
    const header = cloneDeep(table.header[from]);
    table.header.splice(from, 1); // delete from: from
    table.header.splice(to, 0, header); // insert into: to
    for (const row of table.rows) {
      const cell = cloneDeep(row.columns[from]);
      row.columns.splice(from, 1); // delete from: from
      row.columns.splice(to, 0, cell); // insert into: to
    }
  }
}

export class ChangeDandDTableRowOrderAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.table.order.row.change";
  public readonly row: TableRow;

  constructor(
    public readonly element: DandDTableElementModel,
    public readonly originalValue: number,
    public readonly newValue: number,
    row: TableRow
  ) {
    this.row = cloneDeep(row);
  }

  public revert(context: HistoryContext): boolean {
    const row = this.element.table.rows[this.newValue];
    if (isEqual(row, this.row)) {
      this.element.table.rows.splice(this.newValue, 1); // delete from: newIndex
      this.element.table.rows.splice(this.originalValue, 0, row); // insert into: oldIndex
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    const row = this.element.table.rows[this.originalValue];
    if (isEqual(row, this.row)) {
      this.element.table.rows.splice(this.originalValue, 1); // delete from: oldIndex
      this.element.table.rows.splice(this.newValue, 0, row); // insert into: newIndex
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangeDandDTableTypeAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.table.type.change";

  constructor(
    public readonly element: DandDTableElementModel,
    public readonly originalValue: DandDTableType,
    public readonly newValue: DandDTableType
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.type === this.newValue) {
      this.element.type = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.type === this.originalValue) {
      this.element.type = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class AddDandDTableRowAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.table.row.add";

  constructor(
    public readonly element: DandDTableElementModel,
    public readonly originalValue: number,
    public readonly newValue: number,
    public readonly rowId: number,
    public readonly position: InsertPosition
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.table.rows.length === this.newValue) {
      if (this.position === InsertPosition.BEFORE) {
        this.element.table.rows.splice(this.rowId, 1);
      } else {
        this.element.table.rows.splice(this.rowId + 1, 1);
      }
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.table.rows.length === this.originalValue) {
      const newRow = createRow(this.element.table.header.length);
      if (this.position === InsertPosition.BEFORE) {
        this.element.table.rows.splice(this.rowId, 0, newRow);
      } else {
        this.element.table.rows.splice(this.rowId + 1, 0, newRow);
      }
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class DuplicateDandDTableRowAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.table.row.duplicate";

  constructor(
    public readonly element: DandDTableElementModel,
    public readonly originalValue: number,
    public readonly newValue: number,
    public readonly rowId: number
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.table.rows.length === this.newValue) {
      this.element.table.rows.splice(this.rowId, 1);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.table.rows.length === this.originalValue) {
      const newRow = cloneDeep(this.element.table.rows[this.rowId]);
      this.element.table.rows.splice(this.rowId, 0, newRow);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class DeleteDandDTableRowAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.table.row.delete";
  private readonly backup: TableRow;

  constructor(
    public readonly element: DandDTableElementModel,
    public readonly originalValue: number,
    public readonly newValue: number,
    public readonly rowId: number
  ) {
    this.backup = cloneDeep(this.element.table.rows[this.rowId]);
  }

  public revert(context: HistoryContext): boolean {
    if (this.element.table.rows.length === this.newValue) {
      this.element.table.rows.splice(this.rowId, 0, this.backup);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.table.rows.length === this.originalValue) {
      this.element.table.rows.splice(this.rowId, 1);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class AddDandDTableColumnAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.table.column.add";

  constructor(
    public readonly element: DandDTableElementModel,
    public readonly originalValue: number,
    public readonly newValue: number,
    public readonly columnId: number,
    public readonly position: InsertPosition
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.table.header.length === this.newValue) {
      if (this.position === InsertPosition.BEFORE) {
        this.element.table.header.splice(this.columnId, 1);
      } else {
        this.element.table.header.splice(this.columnId + 1, 1);
      }
      for (const row of this.element.table.rows) {
        if (this.position === InsertPosition.BEFORE) {
          row.columns.splice(this.columnId, 1);
        } else {
          row.columns.splice(this.columnId + 1, 1);
        }
      }
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.table.header.length === this.originalValue) {
      const newHeader = createHeader();
      if (this.position === InsertPosition.BEFORE) {
        this.element.table.header.splice(this.columnId, 0, newHeader);
      } else {
        this.element.table.header.splice(this.columnId + 1, 0, newHeader);
      }
      for (const row of this.element.table.rows) {
        const newColumn = createCell();
        if (this.position === InsertPosition.BEFORE) {
          row.columns.splice(this.columnId, 0, newColumn);
        } else {
          row.columns.splice(this.columnId + 1, 0, newColumn);
        }
      }
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class DuplicateDandDTableColumnAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.table.column.duplicate";

  constructor(
    public readonly element: DandDTableElementModel,
    public readonly originalValue: number,
    public readonly newValue: number,
    public readonly columnId: number
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.table.header.length === this.newValue) {
      this.element.table.header.splice(this.columnId, 1);
      for (const row of this.element.table.rows) {
        row.columns.splice(this.columnId, 1);
      }
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.table.header.length === this.originalValue) {
      const newHeader = cloneDeep(this.element.table.header[this.columnId]);
      this.element.table.header.splice(this.columnId, 0, newHeader);
      for (const row of this.element.table.rows) {
        const newColumn = cloneDeep(row.columns[this.columnId]);
        row.columns.splice(this.columnId, 0, newColumn);
      }
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class DeleteDandDTableColumnAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.table.column.delete";
  private readonly backupHeader: TableColumn;
  private readonly backupBody: TableCell[];

  constructor(
    public readonly element: DandDTableElementModel,
    public readonly originalValue: number,
    public readonly newValue: number,
    public readonly columnId: number
  ) {
    this.backupHeader = cloneDeep(this.element.table.header[columnId]);
    this.backupBody = [];
    for (const row of this.element.table.rows) {
      this.backupBody.push(cloneDeep(row.columns[columnId]));
    }
  }

  public revert(context: HistoryContext): boolean {
    if (this.element.table.header.length === this.newValue) {
      this.element.table.header.splice(this.columnId, 0, this.backupHeader);
      for (let i = 0; i < this.element.table.rows.length; i++) {
        this.element.table.rows[i].columns.splice(this.columnId, 0, this.backupBody[i]);
      }
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.table.header.length === this.originalValue) {
      this.element.table.header.splice(this.columnId, 1);
      for (const row of this.element.table.rows) {
        row.columns.splice(this.columnId, 1);
      }
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ReplaceDandDTableAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.table.replace";
  public readonly originalValue: Table;
  public readonly newValue: Table;

  constructor(
    public readonly element: DandDTableElementModel,
    originalValue: Table,
    newValue: Table,
    private readonly ignoreOriginalValue?: boolean
  ) {
    this.originalValue = cloneDeep(originalValue);
    this.newValue = cloneDeep(newValue);
  }

  public revert(context: HistoryContext): boolean {
    if (isEqual(this.element.table, this.newValue)) {
      assign(this.element.table, this.originalValue);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.ignoreOriginalValue || isEqual(this.element.table, this.originalValue)) {
      assign(this.element.table, this.newValue);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangeDandDTableBorderAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.table.border.change";
  public readonly originalValue: DandDTableBorderImage | undefined;
  public readonly newValue: DandDTableBorderImage | undefined;

  constructor(
    public readonly element: DandDTableElementModel,
    originalValue: DandDTableBorderImage | undefined,
    newValue: DandDTableBorderImage | undefined,
  ) {
    this.originalValue = originalValue ? cloneDeep(originalValue) : undefined;
    this.newValue = newValue ? cloneDeep(newValue) : undefined;
  }

  public revert(context: HistoryContext): boolean {
    if (isEqual(this.element.borderImage, this.newValue)) {
      if (!this.originalValue) {
        this.element.borderImage = undefined;
      } else {
        assign(this.element.borderImage, this.originalValue);
      }
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (isEqual(this.element.borderImage, this.originalValue)) {
      if (!this.newValue) {
        this.element.borderImage = undefined;
      } else {
        assign(this.element.borderImage, this.newValue);
      }
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}
