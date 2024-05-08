export default interface LayoutElement {
  component: string;
  parentLayoutId?: number;
  isLayout?: boolean;
  fixDropZones?: boolean;
  id?: number;
  name?: string;
  icon?: string;
  locked: boolean;
  preview: any;
}
