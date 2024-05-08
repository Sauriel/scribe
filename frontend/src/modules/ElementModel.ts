export default interface ElementModel {
  readonly component: string;
  customCss?: string;
}

export interface LayoutElementModel extends ElementModel {
  readonly elements: ElementModel[];
}
