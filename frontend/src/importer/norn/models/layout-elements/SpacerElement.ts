import { PageFormat } from "@/importer/norn/models/AppDocumentSettings";
import LayoutElement from "@/importer/norn/models/layout-elements/LayoutElement";

export default interface SpacerElement extends LayoutElement {
  height: number;
}

export function createDefaultSpacerElement(page: PageFormat): SpacerElement {
  return {
    name: "Vertical Spacing",
    component: "SpacerElementLayout",
    fixDropZones: true,
    icon: "arrows-alt-v",
    height: page.height / 10,
    locked: false,
    preview: "",
  };
}
