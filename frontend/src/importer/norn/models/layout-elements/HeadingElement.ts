import LayoutElement from "@/importer/norn/models/layout-elements/LayoutElement";

export declare type HeadingType = "h1" | "h2" | "h3" | "h4" | "h5";

export default interface HeadingElement extends LayoutElement {
  text: string;
  type: HeadingType;
}

export function createDefaultHeadingElement(): HeadingElement {
  return {
    name: "Heading",
    component: "HeadingElementLayout",
    icon: "heading",
    text: "Change your Heading",
    type: "h1",
    locked: false,
    preview: "",
  };
}
