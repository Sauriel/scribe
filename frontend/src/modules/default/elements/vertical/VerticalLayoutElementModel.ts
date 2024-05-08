import DocumentModel from "@/models/document";
import ElementModel, { LayoutElementModel } from "@/modules/ElementModel";

export default interface VerticalLayoutElementModel extends LayoutElementModel {}

export function create(
  document: DocumentModel,
  elements: ElementModel[] = []
): VerticalLayoutElementModel {
  return {
    component: "VerticalLayoutElement",
    elements: elements,
  };
}
