import DocumentModel from "@/models/document";
import ElementModel from "@/modules/ElementModel";
// @ts-ignore
import { TipTapDefaults } from "@/components/app/ui/tiptap/TipTap.vue";

export enum DandDNoteType {
  NOTE = "NOTE", // Color box wih black border top and bottom
  INTRO = "INTRO", // Light colored box with black borders left and right
}

export default interface DandDNoteElementModel extends ElementModel {
  value: string;
  type: DandDNoteType;
  backgroundColor: string;
}

export function create(document: DocumentModel): DandDNoteElementModel {
  return {
    component: "DandDNoteElement",
    value:
      "<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>",
    type: DandDNoteType.NOTE,
    backgroundColor: "#f2edce",
  };
}

export const dndNoteDefaults: TipTapDefaults = {
  font: "Scaly Sans Remake",
  size: 8,
  color: "#1d1d1b",
};
