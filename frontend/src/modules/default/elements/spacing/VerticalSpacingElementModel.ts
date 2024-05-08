import DocumentModel from "@/models/document";
import { Units } from "@/models/document/pageFormat";
import ElementModel from "@/modules/ElementModel";

export default interface VerticalSpacingElementModel extends ElementModel {
  height: number;
}

export function create(document: DocumentModel): VerticalSpacingElementModel {
  const documentUnit = document.format.unit;
  let baseHeight = 10;
  switch (documentUnit.suffix) {
    case "in":
      baseHeight = 0.5 * Units.INCH.pixelPerUnit; // Base height is 0.5 in
      break;
    case "mm":
      baseHeight = 10 * Units.MILLIMETER.pixelPerUnit; // Base height is 10 mm
      break;
    case "px":
    default:
      baseHeight = 50; // Base height is 50 px
      break;
  }
  return {
    component: "VerticalSpacingElement",
    height: baseHeight,
  };
}
