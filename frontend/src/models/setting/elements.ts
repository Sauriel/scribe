import DocumentModel from "@/models/document";
import ElementModel, { LayoutElementModel } from "@/modules/ElementModel";
import { callbackCreate as createHorizontalLayout } from "@/modules/default/elements/horizontal/HorizontalLayoutElementModel";
import { create as createVerticalSpacing } from "@/modules/default/elements/spacing/VerticalSpacingElementModel";
import { create as createDandDHeading } from "@/modules/dandd/elements/heading/DandDHeadingElementModel";
import { create as createDandDParagraph } from "@/modules/dandd/elements/paragraph/DandDParagraphElementModel";
import { create as createDandDNote } from "@/modules/dandd/elements/note/DandDNoteElementModel";
import { create as createDandDTable } from "@/modules/dandd/elements/table/DandDTableElementModel";
import { callbackCreate as createDandDMonster } from "@/modules/dandd/elements/monster/DandDMonsterElementModel";
import { create as createDandDSpell } from "@/modules/dandd/elements/spell/DandDSpellElementModel";

export default interface DesignBlock {
  icon: string | string[];
  label: string;
  create?: (document: DocumentModel, layout?: LayoutElementModel) => ElementModel;
  callbackCreate?: (
    document: DocumentModel,
    callback: (model: ElementModel) => void,
    layout?: LayoutElementModel
  ) => void;
}

export const BASE_BLOCKS: DesignBlock[] = [
  {
    icon: "arrows-alt-v",
    label: "vertical-spacing",
    create: createVerticalSpacing,
  },
  {
    icon: "columns",
    label: "columns",
    callbackCreate: createHorizontalLayout,
  },
  {
    icon: "th",
    label: "grid",
  },
  {
    icon: "film",
    label: "video",
  },
  {
    icon: "music",
    label: "audio",
  },
  {
    icon: "cube",
    label: "3d-viewer",
  },
];

export const DND_BLOCKS: DesignBlock[] = [
  {
    icon: "heading",
    label: "heading",
    create: createDandDHeading,
  },
  {
    icon: "paragraph",
    label: "paragraph",
    create: createDandDParagraph,
  },
  {
    icon: "sticky-note",
    label: "note",
    create: createDandDNote,
  },
  {
    icon: "table",
    label: "table",
    create: createDandDTable,
  },
  {
    icon: "dragon",
    label: "monster",
    callbackCreate: createDandDMonster,
  },
  {
    icon: "scroll",
    label: "cover",
  },
  {
    icon: "hat-wizard",
    label: "spell",
    create: createDandDSpell,
  },
  {
    icon: "book",
    label: "spell-list",
  },
];

export const DEFAULT_BLOCKS: DesignBlock[] = [
  {
    icon: "heading",
    label: "heading",
  },
  {
    icon: "paragraph",
    label: "paragraph",
  },
  {
    icon: "sticky-note",
    label: "note",
  },
  {
    icon: "table",
    label: "table",
  },
];
