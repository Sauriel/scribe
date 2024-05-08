import LayoutElement from '@/models/layout-elements/LayoutElement';
import VerticalLayoutElement from './layout-elements/VerticalLayoutElement';

export default interface ElementSelection {
  element: LayoutElement;
  index?: number;
  layout?: VerticalLayoutElement;
}