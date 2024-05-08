import type LayoutElement from '~~/components/editor/sidebar/main/element/icon/models';
import type { ElementFunctions } from '../elements';
import { ColumnBreakElementFunctions, ColumnBreakLayoutElement } from './column-break';
import { PageBreakElementFunctions, PageBreakLayoutElement } from './page-break';

export const LayoutElements: LayoutElement[] = [
  PageBreakLayoutElement,
  ColumnBreakLayoutElement,
  {
    name: 'vertical-space',
    icon: 'fluent-mdl2:spacer',
    type: 'layout',
    design: 'general',
    favorite: true,
  },
  {
    name: 'horizontal-rule',
    icon: 'material-symbols:horizontal-rule-rounded',
    type: 'layout',
    design: 'general',
  },
  {
    name: 'note',
    icon: 'ri:sticky-note-fill',
    type: 'layout',
    design: 'dnd5e',
    favorite: true,
  }
];

export const LayoutElementFunctions: Record<string, ElementFunctions> = {
  ...PageBreakElementFunctions,
  ...ColumnBreakElementFunctions
};