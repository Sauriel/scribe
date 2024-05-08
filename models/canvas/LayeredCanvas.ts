export type CanvasLayer = {
  index: number;
  canvas: OffscreenCanvas;
  context: OffscreenCanvasRenderingContext2D;
}

export default class LayeredCanvas {
  private readonly backgrounds: OffscreenCanvas[];
  private readonly layers: OffscreenCanvas[];
  private readonly foregrounds: OffscreenCanvas[];

  constructor(private readonly origin: OffscreenCanvas) {
    this.backgrounds = [];
    this.layers = [];
    this.foregrounds = [];
  }

  public addBackgroundLayer(): CanvasLayer {
    return this.addLayerTo(this.backgrounds);
  }

  public addLayer(): CanvasLayer {
    return this.addLayerTo(this.layers);
  }

  public addForegroundLayer(): CanvasLayer {
    return this.addLayerTo(this.foregrounds);
  }

  private addLayerTo(list: OffscreenCanvas[]): CanvasLayer {
    const canvas = new OffscreenCanvas(this.origin.width, this.origin.height);
    const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    const index = list.push(canvas) - 1;
    return {
      index, 
      canvas, 
      context
    }
  }

  public merge() {
    const context = this.origin.getContext('2d', { alpha: false }) as OffscreenCanvasRenderingContext2D;
    context.fillStyle = 'white';
    context.fillRect(0, 0, this.origin.width, this.origin.height);
    for (const canvas of this.backgrounds) {
      context.drawImage(canvas, 0, 0);
    }
    for (const canvas of this.layers) {
      context.drawImage(canvas, 0, 0);
    }
    for (const canvas of this.foregrounds) {
      context.drawImage(canvas, 0, 0);
    }
  }
}