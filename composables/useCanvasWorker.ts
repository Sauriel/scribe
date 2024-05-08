import type { Dimension } from '~~/models/canvas/context';
import type { DrawCanvasAddPageRequestEvent, DrawCanvasAddPageResponseEvent, DrawCanvasCompletedEvent, DrawCanvasDrawAllEvent, DrawCanvasEvent } from '~~/models/canvas/events';
import type ScribeDoc from '~~/models/document/document';
import { serializeDoc } from '~~/models/document/document';
import type { PageBreak } from '~~/models/elements/elements';
import DrawCanvasWorker from '~~/worker/canvasWorker.ts?worker';

// export type ModifyPageCallback = (pageIndex: number, currentPageBoundaries: Map<Dimension, number>, pageBreak: PageBreak) => void;
// export type NewPagePromise = () => Promise<OffscreenCanvas>;
export type PageDrawCompleteAction = (pageIndex: number, currentPageBoundaries: Map<Dimension, number>, pageBreak: PageBreak) => Promise<OffscreenCanvas | void>;

export default function() {
  const worker: Worker = new DrawCanvasWorker();

  function drawAllPages(canvas: OffscreenCanvas, document: ScribeDoc) {
    const message: DrawCanvasDrawAllEvent = {
      action: 'draw-all',
      document: serializeDoc(document),
      canvas
    };
    worker.postMessage(message, [ canvas ]);
  }

  function onNewPage(pageDrawCompleteAction: PageDrawCompleteAction) {
    worker.addEventListener('message', (event: MessageEvent<DrawCanvasEvent>) => {
      if (event.data.action === 'add-page') {
        const data = event.data as DrawCanvasAddPageRequestEvent;
        pageDrawCompleteAction(data.currentPageNumber - 1, data.currentPageBoundaries, data.pageBreak)
          .then((canvas: OffscreenCanvas | void) => {
            if (canvas) {
              const message: DrawCanvasAddPageResponseEvent = {
                action: 'page-added',
                canvas,
                id: data.id
              };
              worker.postMessage(message, [ canvas ]);
            }
          });
        }
    });
  }

  function onDrawCompleted(pageDrawCompleteAction: PageDrawCompleteAction) {
    worker.addEventListener('message', (event: MessageEvent<DrawCanvasEvent>) => {
      if (event.data.action === 'draw-completed') {
        const data = event.data as DrawCanvasCompletedEvent;
        pageDrawCompleteAction(data.currentPageNumber - 1, data.currentPageBoundaries, null);
      }
    });
  }

  return {
    drawAllPages,
    onNewPage,
    onDrawCompleted
  };
}