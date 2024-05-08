import LayoutElement from "./LayoutElement";
import VerticalLayoutElement, { createDefaultVerticalLayoutElement } from "./VerticalLayoutElement";

export interface Column {
  width: number;
  element: LayoutElement;
}

export default interface HorizontalLayoutElement extends LayoutElement {
  columns: Column[];
}

export function createDefaultHorizontalLayoutElement(columnWidths: number[]): HorizontalLayoutElement {
  const columns: Column[] = [];
  for (const columnWidth of columnWidths) {
    const column: Column = {
      width: columnWidth,
      element: createDefaultVerticalLayoutElement()
    };
    columns.push(column);
  }
  return {
    name: "Horizontal Layout",
    component: "HorizontalLayout",
    isLayout: true,
    fixDropZones: true,
    icon: "columns",
    columns: columns,
    locked: false,
    preview: require("../../assets/settings/dnd5/preview/dnd-5e-preview--columns.jpg")
  };
}