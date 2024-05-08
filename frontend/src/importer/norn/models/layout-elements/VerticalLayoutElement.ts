import LayoutElement from "@/importer/norn/models/layout-elements/LayoutElement";

export default interface VerticalLayoutElement extends LayoutElement {
  rows: LayoutElement[];
}

export function createDefaultVerticalLayoutElement(): VerticalLayoutElement {
  return {
    component: "VerticalLayout",
    isLayout: true,
    rows: [],
    locked: false,
    preview: false,
  };
}
