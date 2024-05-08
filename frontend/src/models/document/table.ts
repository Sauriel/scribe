import { InsertPosition, TextAlign } from "@/models";

export interface TableCellInfo {
  row: number;
  column: number;
  cell: TableCell;
}

export interface TableActions {
  cellChanged: (
    row: number,
    column: number,
    originalCell: TableCell,
    updatedCell: TableCell
  ) => void;
  cellsChanged: (originalCells: TableCellInfo[], updatedCells: TableCellInfo[]) => void;
  rowOrderChanged: (fromId: number, toId: number, row: TableRow) => void;
  rowDuplicate: (rowId: number) => void;
  rowDelete: (rowId: number) => void;
  rowAdd: (rowId: number, position: InsertPosition) => void;
  columnOrderChanged: (fromId: number, toId: number) => void;
  columnDuplicate: (columnId: number) => void;
  columnDelete: (columnId: number) => void;
  columnAdd: (columnId: number, position: InsertPosition) => void;
}

export interface TablePayload {
  table: Table;
  actions: TableActions;
  onCancel?: (table: Table) => void;
  onSave?: (table: Table) => void;
}

export interface TableStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  color?: string;
  background?: string;
  font?: string;
  size?: string;
  align?: TextAlign;
}

export interface TableCell {
  value: string;
  style: TableStyle;
}

export interface TableRow {
  columns: TableCell[];
}

export interface TableColumn {
  header: TableCell;
}

export interface Table {
  header: TableColumn[];
  rows: TableRow[];
}

export function createTable(columnCount = 3, rowCount = 3): Table {
  const header: TableColumn[] = [];
  const rows: TableRow[] = [];
  for (let i = 0; i < columnCount; i++) {
    header.push(createHeader());
  }
  for (let i = 0; i < rowCount; i++) {
    rows.push(createRow(columnCount));
  }
  return {
    header: header,
    rows: rows,
  };
}

export function createHeader(value = "Header"): TableColumn {
  return {
    header: createCell(value, { bold: true }),
  };
}

export function createRow(columnCount: number): TableRow {
  const row: TableRow = {
    columns: [],
  };
  for (let i = 0; i < columnCount; i++) {
    row.columns.push(createCell());
  }
  return row;
}

export function createCell(value = "—", style: TableStyle = {}): TableCell {
  return {
    value: value,
    style: style,
  };
}
