import type LayoutElement from '~~/components/editor/sidebar/main/element/icon/models';
import type { Dimension } from '../canvas/context';
import type CanvasDrawContext from '../canvas/context';
import type { ElementFunctions } from './elements';
import type DocElement from './elements';

type TestElement = DocElement & {
  content: string;
  color: string;
};

export default TestElement;

export async function renderTestElement(ctx: CanvasDrawContext, element: DocElement, elementIndex: number): Promise<CanvasDrawContext> {
  const testElement = element as TestElement;
  let context = ctx.canvas.addLayer().context;
  const BORDER_WIDTH = 4;
  const elementHeight = 120;
  let usedHeight = 0;

  const shouldBreakPageOrColumn = (ctx.boundary.top + elementHeight) >= ctx.boundary.bottom;

  if (!shouldBreakPageOrColumn) {
    context.fillStyle = testElement.color;
    context.fillRect(ctx.boundary.left, ctx.boundary.top, ctx.boundary.right - ctx.boundary.left, elementHeight);
    context.fillStyle = 'black';
    context.fillRect(ctx.boundary.left, ctx.boundary.top, ctx.boundary.right - ctx.boundary.left, BORDER_WIDTH);
    context.fillRect(ctx.boundary.left, ctx.boundary.top, BORDER_WIDTH, elementHeight);
    context.fillRect(ctx.boundary.right - BORDER_WIDTH, ctx.boundary.top, BORDER_WIDTH, elementHeight);
    context.fillRect(ctx.boundary.left, ctx.boundary.top + elementHeight - BORDER_WIDTH, ctx.boundary.right - ctx.boundary.left, BORDER_WIDTH);
    context.font = '24px Verdana';
    context.textBaseline = 'top'
    context.fillText(testElement.content, ctx.boundary.left + (BORDER_WIDTH * 2), ctx.boundary.top + (BORDER_WIDTH * 2))
    usedHeight = elementHeight;
    const elementDimension: Dimension = {
      left: ctx.boundary.left,
      top: ctx.boundary.top,
      width: ctx.boundary.right - ctx.boundary.left,
      height : elementHeight
    };
    ctx.addElementDimension(elementIndex, elementDimension);
  } else {
    let remainingHeight = elementHeight;
    while (remainingHeight > 0) {
      const boundaryHeight = ctx.boundary.bottom - ctx.boundary.top;
      const height = Math.min(boundaryHeight, remainingHeight);
      context.fillStyle = testElement.color;
      context.fillRect(ctx.boundary.left, ctx.boundary.top, ctx.boundary.right - ctx.boundary.left, height);
      context.fillStyle = 'black';
      if (remainingHeight === elementHeight) {
        context.fillRect(ctx.boundary.left, ctx.boundary.top, ctx.boundary.right - ctx.boundary.left, BORDER_WIDTH);
      }
      context.fillRect(ctx.boundary.left, ctx.boundary.top, BORDER_WIDTH, height);
      context.fillRect(ctx.boundary.right - BORDER_WIDTH, ctx.boundary.top, BORDER_WIDTH, height);
      context.font = '24px Verdana';
      context.textBaseline = 'top'
      context.fillText(testElement.content, ctx.boundary.left + (BORDER_WIDTH * 2), ctx.boundary.top + (BORDER_WIDTH * 2))
      remainingHeight -= height;
      usedHeight = height;
      const elementDimension: Dimension = {
        left: ctx.boundary.left,
        top: ctx.boundary.top,
        width: ctx.boundary.right - ctx.boundary.left,
        height : height,
        splitted: true
      };
      ctx.addElementDimension(elementIndex, elementDimension);
      if (remainingHeight > 0) {
        await ctx.breakColumnOrPage({ elementIndex, type: 'inside' });
        context = ctx.canvas.addLayer().context;
      } else {
        context.fillRect(ctx.boundary.left, ctx.boundary.top + height - BORDER_WIDTH, ctx.boundary.right - ctx.boundary.left, BORDER_WIDTH);
      }
    }
  }

  ctx.boundary.top = ctx.boundary.top + usedHeight + testElement.marginBottom;

  return Promise.resolve(ctx);
}

export function createTestElement(config?: string): TestElement {
  const color = '#' + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, '0');
  const content = config || `TestElement ${color}`;
  return {
    name: 'test-element',
    wrappable: true,
    pageBreak: null,
    marginBottom: 20,
    content,
    color
  }
}

export const TestLayoutElement: LayoutElement = {
  name: 'test-element',
  icon: 'pajamas:issue-type-test-case',
  type: 'layout',
  design: 'general',
  favorite: true,
};

export const TestElementFunctions: Record<string, ElementFunctions> = {
  'test-element': {
    create: createTestElement,
    render: renderTestElement
  }
};