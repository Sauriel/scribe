import LayoutElement from "./LayoutElement";

export default interface ParagraphElement extends LayoutElement {
  text: string;
  initial: boolean;
}

export function createDefaultParagraphElement(): ParagraphElement {
  return {
    name: "Paragraph",
    component: "ParagraphElementLayout",
    icon: "paragraph",
    text: "<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>",
    initial: false,
    locked: false,
    preview: require("../../assets/settings/dnd5/preview/dnd-5e-preview--paragraph.jpg")
  };
}