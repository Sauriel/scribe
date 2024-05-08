import DocumentModel from "@/models/document";
import { createTable, Table } from "@/models/document/table";
import ElementModel from "@/modules/ElementModel";
import tableBorderTopLeft from "@/assets/elements/dandd/table/DnDClassTableBG-top-left.png";
import tableBorderTop from "@/assets/elements/dandd/table/DnDClassTableBG-top.png";
import tableBorderTopRight from "@/assets/elements/dandd/table/DnDClassTableBG-top-right.png";
import tableBorderRight from "@/assets/elements/dandd/table/DnDClassTableBG-right.png";
import tableBorderBottomRight from "@/assets/elements/dandd/table/DnDClassTableBG-bottom-right.png";
import tableBorderBottom from "@/assets/elements/dandd/table/DnDClassTableBG-bottom.png";
import tableBorderBottomLeft from "@/assets/elements/dandd/table/DnDClassTableBG-bottom-left.png";
import tableBorderLeft from "@/assets/elements/dandd/table/DnDClassTableBG-left.png";

export enum DandDTableType {
  SIMPLE = "SIMPLE",
  CLASS = "CLASS",
}

export interface DandDTableBorderImage {
  topLeft?: string;
  top?: string;
  topRight?: string;
  right?: string;
  bottomRight?: string;
  bottom?: string;
  bottomLeft?: string;
  left?: string;
}

export default interface DandDTableElementModel extends ElementModel {
  headline?: string;
  type: DandDTableType;
  rowBackground: string;
  table: Table;
  borderImage?: DandDTableBorderImage;
}

export function create(document: DocumentModel): DandDTableElementModel {
  return {
    component: "DandDTableElement",
    headline: "D&D Table",
    type: DandDTableType.SIMPLE,
    rowBackground: "#e0e5c1",
    table: createTable(3, 3),
  };
}

export const DEFAULT_BORDER_IMAGE: DandDTableBorderImage = {
    topLeft: tableBorderTopLeft,
    top: tableBorderTop,
    topRight: tableBorderTopRight,
    right: tableBorderRight,
    bottomRight: tableBorderBottomRight,
    bottom: tableBorderBottom,
    bottomLeft: tableBorderBottomLeft,
    left: tableBorderLeft,
  };