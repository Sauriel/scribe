import type CanvasDrawContext from './context';
import Cache from '~~/models/cache/cache';

const CACHE_LIFE = 10 * 60 * 1000; // 10 minutes

const BITMAP_CACHE = new Cache<ImageBitmap>();

const IMAGE_CACHE = new Cache<HTMLImageElement>();

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.src = url;
  });
}

async function drawImage(ctx: CanvasDrawContext, context: OffscreenCanvasRenderingContext2D, src: string, x: number, y: number, w: number, h: number): Promise<CanvasDrawContext> {
  let image = IMAGE_CACHE.get(src);
  if (!image) {
    image = await loadImage(src);
    IMAGE_CACHE.set(src, image, CACHE_LIFE);
  }
  context.drawImage(image, x, y, w, h)
  return Promise.resolve(ctx);
}

async function drawImageInWorker(ctx: CanvasDrawContext, context: OffscreenCanvasRenderingContext2D, src: string, x: number, y: number, w: number, h: number): Promise<CanvasDrawContext> {
  let image = BITMAP_CACHE.get(src);
  if (!image) {
    const imageBlob = await fetch(src).then(r => r.blob());
    image = await createImageBitmap(imageBlob);
    BITMAP_CACHE.set(src, image, CACHE_LIFE);
  }
  context.drawImage(image, x, y, w, h);
  return Promise.resolve(ctx);
}

export {
  drawImage,
  drawImageInWorker
};