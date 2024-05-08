import type { CanvasCoordinates } from '~~/models/canvas/context';
import type { DrawCanvasAddPageRequestEvent, DrawCanvasAddPageResponseEvent, DrawCanvasCompletedEvent, DrawCanvasDrawAllEvent, DrawCanvasEvent } from '~~/models/canvas/events';
import { deserializeDoc } from '~~/models/document/document';
import type { PageBreak } from '~~/models/elements/elements';
import drawDocument from './canvas/draw';

const WEBWORKER_INSTANCE = self; // DedicatedWorkerGlobalScope
const PROMISE_TIMEOUT = 1000;

function addNewPageCallback(pageCount: number, elementBoundaries: CanvasCoordinates, pageBreak: PageBreak): Promise<OffscreenCanvas> {
  return new Promise<OffscreenCanvas>((resolve, reject) => {
    let timeoutId: number | undefined = undefined;
    const id = `page#${pageCount + 1}`;

    WEBWORKER_INSTANCE.addEventListener('message', (event: MessageEvent<DrawCanvasEvent>) => {
      if (event.data.action === 'page-added') {
        const data = event.data as DrawCanvasAddPageResponseEvent;
        if (data.id === id) {
          clearTimeout(timeoutId);
          resolve(data.canvas);
        }
      }
    });

    const message: DrawCanvasAddPageRequestEvent = {
      action: 'add-page',
      id,
      pageBreak,
      currentPageNumber: pageCount,
      currentPageBoundaries: elementBoundaries.getCoordinates()
    };
    postMessage(message);

    timeoutId = setTimeout(reject, PROMISE_TIMEOUT);
  });
}

WEBWORKER_INSTANCE.addEventListener('message', (event: MessageEvent<DrawCanvasEvent>) => {
  if (event.data.action === 'draw-all') {
    const data = event.data as DrawCanvasDrawAllEvent;
    const doc = deserializeDoc(data.document);
    drawDocument([ data.canvas ], doc, addNewPageCallback)
      .then(context => {
        const message: DrawCanvasCompletedEvent = {
          action: 'draw-completed',
          currentPageNumber: context.currentCanvasIndex + 1,
          currentPageBoundaries: context.canvasCoordinates.get(context.currentCanvasIndex)?.getCoordinates() || new Map()
        };
        postMessage(message);
      });
  }
});