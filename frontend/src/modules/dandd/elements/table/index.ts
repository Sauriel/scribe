import { cloneDeep } from "lodash";
import DandDTableElementModel from "@/modules/dandd/elements/table/DandDTableElementModel";
import { InsertPosition } from "@/models";
import { Table, TableCell, TableCellInfo, TablePayload, TableRow } from "@/models/document/table";
import {
  ModalUpdateEvent,
  MODAL_UPDATE_EVENT_NAME,
  SPREADSHEET_MODAL_COMPONENT_TAG,
} from "@/events/modal";
import emitter from "@/emitter";
import {
  AddDandDTableColumnAction,
  AddDandDTableRowAction,
  ChangeDandDTableCellAction,
  ChangeDandDTableCellsAction,
  ChangeDandDTableColumnOrderAction,
  ChangeDandDTableRowOrderAction,
  DeleteDandDTableColumnAction,
  DeleteDandDTableRowAction,
  DuplicateDandDTableColumnAction,
  DuplicateDandDTableRowAction,
  ReplaceDandDTableAction,
} from "@/modules/dandd/elements/table/historyAction";
import { historyManager } from "@/history/HistoryManager";
import objectHash from "object-hash";

export const openDandDTableEditFn = (element: DandDTableElementModel) => {
  const clone = cloneDeep(element);
  const elementHash = objectHash(clone);
  const payload: TablePayload = {
    table: element.table,
    actions: {
      cellChanged: (
        row: number,
        column: number,
        originalCell: TableCell,
        updatedCell: TableCell
      ) => {
        // This is probably only a text change
        const action = new ChangeDandDTableCellAction(
          element,
          row,
          column,
          originalCell,
          updatedCell
        );
        const gracefulActionName =
          "DandDTableElementModel.cell(" + column + "/" + row + ")-" + elementHash;
        historyManager.silentDo(action);
      },
      cellsChanged: (oldValue: TableCellInfo[], newValue: TableCellInfo[]) => {
        const action = new ChangeDandDTableCellsAction(element, oldValue, newValue);
        historyManager.silentDo(action);
      },
      rowOrderChanged: (fromId: number, toId: number, row: TableRow) => {
        const action = new ChangeDandDTableRowOrderAction(element, fromId, toId, row);
        historyManager.silentDo(action);
      },
      rowAdd: (rowId: number, position: InsertPosition) => {
        const action = new AddDandDTableRowAction(
          element,
          element.table.rows.length,
          element.table.rows.length + 1,
          rowId,
          position
        );
        historyManager.silentDo(action);
      },
      rowDuplicate: (rowId: number) => {
        const action = new DuplicateDandDTableRowAction(
          element,
          element.table.rows.length,
          element.table.rows.length + 1,
          rowId
        );
        historyManager.silentDo(action);
      },
      rowDelete: (rowId: number) => {
        const action = new DeleteDandDTableRowAction(
          element,
          element.table.rows.length,
          element.table.rows.length - 1,
          rowId
        );
        historyManager.silentDo(action);
      },
      columnOrderChanged: (fromId: number, toId: number) => {
        const action = new ChangeDandDTableColumnOrderAction(element, fromId, toId);
        historyManager.silentDo(action);
      },
      columnAdd: (columnId: number, position: InsertPosition) => {
        const action = new AddDandDTableColumnAction(
          element,
          element.table.header.length,
          element.table.header.length + 1,
          columnId,
          position
        );
        historyManager.silentDo(action);
      },
      columnDuplicate: (columnId: number) => {
        const action = new DuplicateDandDTableColumnAction(
          element,
          element.table.header.length,
          element.table.header.length + 1,
          columnId
        );
        historyManager.silentDo(action);
      },
      columnDelete: (columnId: number) => {
        const action = new DeleteDandDTableColumnAction(
          element,
          element.table.header.length,
          element.table.header.length - 1,
          columnId
        );
        historyManager.silentDo(action);
      },
    },
    onCancel: (table: Table) => {
      const action = new ReplaceDandDTableAction(element, element.table, clone.table);
      historyManager.silentDo(action);
    },
    onSave: (table: Table) => {
      const action = new ReplaceDandDTableAction(element, clone.table, element.table, true);
      historyManager.do(action);
    },
  };
  const event: ModalUpdateEvent<TablePayload> = {
    name: MODAL_UPDATE_EVENT_NAME,
    payload: {
      component: SPREADSHEET_MODAL_COMPONENT_TAG,
      visible: true,
      payload: payload,
      fullscreen: true,
    },
  };
  emitter.$emit(MODAL_UPDATE_EVENT_NAME, event);
};
