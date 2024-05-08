import type LayoutElement from '~~/components/editor/sidebar/main/element/icon/models';
import type CanvasDrawContext from '~~/models/canvas/context';
import type { ElementFunctions } from '../elements';
import type DocElement from '../elements';

type PageBreakElement = DocElement;

export default PageBreakElement;

export async function renderElement(ctx: CanvasDrawContext, element: DocElement, elementIndex: number): Promise<CanvasDrawContext> {
  await ctx.breakPage({ elementIndex, type: 'after' });
  return Promise.resolve(ctx);
}

export function createElement(): PageBreakElement {
  return {
    name: 'page-break',
    wrappable: true,
    pageBreak: null,
    marginBottom: 0
  }
}

export const PageBreakLayoutElement: LayoutElement = {
  name: 'page-break',
  icon: 'ic:round-insert-page-break',
  type: 'layout',
  design: 'general',
};

export const PageBreakElementFunctions: Record<string, ElementFunctions> = {
  'page-break': {
    create: createElement,
    render: renderElement
  }
};