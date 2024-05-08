import type { PageBreak } from '../elements/elements';
import type { Dimension } from './context';

export type DrawCanvasEventActions = 'draw-all' | 'add-page' | 'page-added' | 'draw-completed';

export type DrawCanvasEvent = {
  action: DrawCanvasEventActions;
}

export type DrawCanvasDrawAllEvent = DrawCanvasEvent & {
  canvas: OffscreenCanvas;
  document: string; // serialized Doc
};

export type DrawCanvasAddPageRequestEvent = DrawCanvasEvent & {
  id: string;
  pageBreak: PageBreak;
  currentPageNumber: number;
  currentPageBoundaries: Map<Dimension, number>;
};

export type DrawCanvasAddPageResponseEvent = DrawCanvasEvent & {
  id: string;
  canvas: OffscreenCanvas;
};

export type DrawCanvasCompletedEvent = DrawCanvasEvent & {
  currentPageNumber: number;
  currentPageBoundaries: Map<Dimension, number>;
};