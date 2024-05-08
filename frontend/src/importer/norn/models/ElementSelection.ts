import LayoutElement from "@/importer/norn/models/layout-elements/LayoutElement";
import VerticalLayoutElement from "@/importer/norn/models/layout-elements/VerticalLayoutElement";

export default interface ElementSelection {
  element: LayoutElement;
  index?: number;
  layout?: VerticalLayoutElement;
}
