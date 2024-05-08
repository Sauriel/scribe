import { PageFormat } from "../AppDocumentSettings";
import LayoutElement from "./LayoutElement";

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
    preview: require("../../assets/settings/dnd5/preview/dnd-5e-preview--spacer.jpg")
  };
}