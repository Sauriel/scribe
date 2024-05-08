import LayoutElement from "./LayoutElement";

export enum NoteType {
  NOTE = "NOTE",
  DESCRIPTION = "DESCRIPTION"
}

export default interface NoteElement extends LayoutElement {
  text: string;
  type: NoteType;
}

export function createDefaultNoteElement(): NoteElement {
  return {
    name: "Note",
    component: "NoteElementLayout",
    icon: "sticky-note",
    text: "<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>",
    type: NoteType.NOTE,
    locked: false,
    preview: require("../../assets/settings/dnd5/preview/dnd-5e-preview--note.jpg")
  };
}