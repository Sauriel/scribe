import type CanvasDrawContext from '~~/models/canvas/context';
import { LayoutElementFunctions } from './layout';
import { TestElementFunctions } from './test';

export type PageBreakType = 'inside' | 'after';

export type PageBreak = {
  elementIndex: number;
  type: PageBreakType;
} | null;

type DocElement = {
  name: string;
  wrappable: boolean;
  pageBreak: PageBreakType | null;
  marginBottom: number;
}

export type CanvasRenderFunction = (ctx: CanvasDrawContext, element: DocElement, elementIndex: number) => Promise<CanvasDrawContext>;
export type CreateElementFunction = (config?: any) => DocElement; // ToDo [2023-07-01]: Maybe change to array
export type ElementFunctions = {
  create: CreateElementFunction;
  render: CanvasRenderFunction;
}

export const ELEMENT_FUNCTIONS: Record<string, ElementFunctions> = {
  ...TestElementFunctions,
  ...LayoutElementFunctions
};

export default DocElement;