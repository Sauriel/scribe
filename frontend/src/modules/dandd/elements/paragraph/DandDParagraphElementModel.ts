import DocumentModel from "@/models/document";
import ElementModel from "@/modules/ElementModel";
// @ts-ignore
import { TipTapDefaults } from "@/components/app/ui/tiptap/TipTap.vue";

export default interface DandDParagraphElementModel extends ElementModel {
  value: string;
  initial: boolean;
  firstLineUppercase: boolean;
}

export function create(document: DocumentModel): DandDParagraphElementModel {
  return {
    component: "DandDParagraphElement",
    value:
      "<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>",
    initial: false,
    firstLineUppercase: false,
  };
}

export const dndParagraphDefaults: TipTapDefaults = {
  font: "Book Insanity",
  size: 9,
  color: "#1d1d1b",
  background: "#eee5ce",
};
