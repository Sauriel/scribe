import DocumentModel from "@/models/document";
import ElementModel from "@/modules/ElementModel";

export declare type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export default interface DandDHeadingElementModel extends ElementModel {
  value: string;
  level: HeadingLevel;
}

export function create(document: DocumentModel): DandDHeadingElementModel {
  return {
    component: "DandDHeadingElement",
    value: "D&D Headline",
    level: 1,
  };
}
