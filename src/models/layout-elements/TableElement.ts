import LayoutElement from "./LayoutElement";

export enum TableColAlign {
  LEFT = "LEFT",
  CENTER = "CENTER",
  RIGHT = "RIGHT"
}

export interface TableConfig {
  rows: number;
  cols: number;
}

export enum TableType {
  SIMPLE = "SIMPLE",
  CLASS = "CLASS"
}

export interface TableElementRow {
  cols: TableElementCol[];
}

export interface TableElementHeadRow extends TableElementRow {
  cols: TableElementHeadCol[];
}

export interface TableElementCol {
  content: string;
}

export interface TableElementHeadCol extends TableElementCol {
  align: TableColAlign;
}

export interface Table {
  header: TableElementHeadRow;
  rows: TableElementRow[];
}

export default interface TableElement extends LayoutElement {
  type: TableType;
  headline: string;
  table: Table;
  secondTable: Table | null;
}

export function createTable(config: TableConfig): Table {
  const header: TableElementHeadRow = { cols : new Array(config.cols) };
  for (let i = 0; i < config.cols; i++) {
    header.cols[i] = {
      content: "Header",
      align: TableColAlign.CENTER
    };
  }

  const rows: TableElementRow[] = new Array(config.rows);
  for (let j = 0; j < config.rows; j++) {
    rows[j] = { cols : new Array(config.cols) };
    for (let i = 0; i < config.cols; i++) {
      rows[j].cols[i] = {
        content: "—"
      };
    }
  }

  return {
    header: header,
    rows: rows
  };
}

export function createDefaultTableElement(config: TableConfig): TableElement {
  return {
    name: "Table",
    component: "TableElementLayout",
    icon: "table",
    type: TableType.SIMPLE,
    headline: "Headline",
    table: createTable(config),
    secondTable: null,
    locked: false,
    preview: require("../../assets/settings/dnd5/preview/dnd-5e-preview--table.jpg")
  };
}