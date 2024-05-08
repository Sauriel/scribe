import BackgroundImage from "./BackgroundImage";
import VerticalLayoutElement from "./layout-elements/VerticalLayoutElement";

export default interface AppPage {
  backgroundImages: BackgroundImage[];
  layout: VerticalLayoutElement;
}