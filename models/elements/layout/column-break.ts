import type LayoutElement from '~~/components/editor/sidebar/main/element/icon/models';
import type { Dimension } from '~~/models/canvas/context';
import type CanvasDrawContext from '~~/models/canvas/context';
import type { ElementFunctions } from '../elements';
import type DocElement from '../elements';

type ColumnBreakElement = DocElement;

export default ColumnBreakElement;

export async function renderElement(ctx: CanvasDrawContext, element: DocElement, elementIndex: number): Promise<CanvasDrawContext> {
  const elementDimension: Dimension = {
    left: ctx.boundary.left,
    top: ctx.boundary.top,
    width: ctx.boundary.right - ctx.boundary.left,
    height : 0
  };
  ctx.addElementDimension(elementIndex, elementDimension);
  await ctx.breakColumnOrPage({ elementIndex, type: 'after' }); // ToDo [2023-07-01]: maybe add another dimension after this.
  return Promise.resolve(ctx);
}

export function createElement(): ColumnBreakElement {
  return {
    name: 'column-break',
    wrappable: true,
    pageBreak: null,
    marginBottom: 0
  }
}

export const ColumnBreakLayoutElement: LayoutElement = {
  name: 'column-break',
  icon: 'fluent:column-arrow-right-20-filled',
  type: 'layout',
  design: 'general',
};

export const ColumnBreakElementFunctions: Record<string, ElementFunctions> = {
  'column-break': {
    create: createElement,
    render: renderElement
  }
};