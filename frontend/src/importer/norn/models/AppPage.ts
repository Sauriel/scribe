import BackgroundImage from "@/importer/norn/models/BackgroundImage";
import VerticalLayoutElement from "@/importer/norn/models/layout-elements/VerticalLayoutElement";

export default interface AppPage {
  backgroundImages: BackgroundImage[];
  layout: VerticalLayoutElement;
}
