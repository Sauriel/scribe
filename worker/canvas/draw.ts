import type { AddNewPagePromise } from '~~/models/canvas/context';
import CanvasDrawContext from '~~/models/canvas/context';
import { drawImageInWorker } from '~~/models/canvas/image';
import type ScribeDoc from '~~/models/document/document';
import { ELEMENT_FUNCTIONS } from '~~/models/elements/elements';

async function drawInitialCanvasElements(ctx: CanvasDrawContext): Promise<CanvasDrawContext> {
  const { context } = ctx.canvas.addBackgroundLayer();
  if (ctx.doc.style) {
    if (ctx.doc.style.background) {
      await drawImageInWorker(ctx, context, ctx.doc.style.background, 0, 0, ctx.doc.width, ctx.doc.height);
    }
  }
  return Promise.resolve(ctx);
}

export default async function drawDocument(canvasList: OffscreenCanvas[], doc: ScribeDoc, addNewPage: AddNewPagePromise): Promise<CanvasDrawContext> {
  // const consoleTimer = 'Draw the document';
  // console.time(consoleTimer);
  const ctx = new CanvasDrawContext(doc, canvasList, addNewPage, drawInitialCanvasElements);
  await drawInitialCanvasElements(ctx);
  for (const [index, element] of doc.content.entries()) {
    await ELEMENT_FUNCTIONS[element.name].render(ctx, element, index);
  }
  ctx.canvas.merge();
  // console.timeEnd(consoleTimer);
  // console.log(`# of elements: ${doc.content.length} - # of pages: ${canvasList.length}`);
  return ctx;
}