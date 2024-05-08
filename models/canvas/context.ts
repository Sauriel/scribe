import type { DocMargin } from '~~/models/document/document';
import type ScribeDoc from '~~/models/document/document';
import type { PageBreak } from '../elements/elements';
import LayeredCanvas from './LayeredCanvas';

export type AddNewPagePromise = (pageCount: number, elementBoundaries: CanvasCoordinates, pageBreak: PageBreak) => Promise<OffscreenCanvas>;

export type Boundary = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type Dimension = {
  top: number;
  left: number;
  width: number;
  height: number;
  splitted?: boolean;
};

export type Page = {
  index: number;
  canvas: HTMLCanvasElement;
  offscreenCanvas: OffscreenCanvas | null;
  clickAreas: Map<Dimension, number>;
};

export class CanvasCoordinates {
  private elements: Map<number, Dimension[]> = new Map();

  public addElement(elementIndex: number, dimension: Dimension) {
    let boundaries = this.elements.get(elementIndex);
    if (!boundaries) {
      boundaries = [];
      this.elements.set(elementIndex, boundaries);
    }
    boundaries.push(dimension);
  }

  public getCoordinates(): Map<Dimension, number> {
    const coordinates: Map<Dimension, number> = new Map();
    this.elements.forEach((dimensions, elementId) => dimensions.forEach(dimension => coordinates.set(dimension, elementId)));
    return coordinates;
  }
}

export default class CanvasDrawContext {
  public boundary: Boundary;
  public currentColumn: number;
  public currentCanvasIndex: number;
  public canvasCoordinates: Map<number, CanvasCoordinates>;
  private layeredCanvases: LayeredCanvas[];
  public canvas: LayeredCanvas;

  constructor(
    public readonly doc: ScribeDoc,
    private readonly canvasList: OffscreenCanvas[],
    private readonly addNewPage: AddNewPagePromise,
    private readonly drawInitialCanvasElements: (ctx: CanvasDrawContext) => Promise<CanvasDrawContext>,
  ) {
    this.currentCanvasIndex = 0;
    this.currentColumn = 0;
    this.boundary = this.calculateBoundary();
    this.canvasCoordinates = new Map();
    this.layeredCanvases = canvasList.map(canvas => new LayeredCanvas(canvas));
    this.canvas = this.layeredCanvases[this.currentCanvasIndex];
  }

  private calculateBoundary(): Boundary {
    let margin: DocMargin;
    if (typeof this.doc.margin !== 'number' ) {
      margin = this.doc.margin as DocMargin;
    } else {
      margin = {
        top: this.doc.margin as number,
        right: this.doc.margin as number,
        bottom: this.doc.margin as number,
        left: this.doc.margin as number
      };
    }
    const top = Math.round(margin.top);
    const bottom = Math.round(this.doc.height - margin.bottom);
    let left: number;
    let right: number;
    if (!this.doc.cols) {
      left = Math.round(margin.left);
      right = Math.round(this.doc.width - margin.right);
    } else {
      const width = this.doc.width - margin.left - margin.right;
      const gaps = (this.doc.cols.quantity - 1) * this.doc.cols.gap;
      const widthWithoutGaps = width - gaps;
      if (!this.doc.cols.widths) {
        const colWidth = widthWithoutGaps / this.doc.cols.quantity;
        left = Math.round(margin.left + ((colWidth + this.doc.cols.gap) * this.currentColumn));
        right = Math.round(left + colWidth);
      } else {
        let previousColsAdded = 0;
        for (let i = 0; i < this.currentColumn; i++) {
          previousColsAdded += (widthWithoutGaps / 100) * this.doc.cols.widths[i];
        }
        previousColsAdded += this.doc.cols.gap * this.currentColumn;
        left = Math.round(margin.left + previousColsAdded);
        right = Math.round(left + (widthWithoutGaps / 100) * this.doc.cols.widths[this.currentColumn]);
      }
    }

    return {
      top,
      right,
      bottom,
      left
    };
  }

  public async breakPage(pageBreak: PageBreak) {
    this.currentColumn = 0;
    this.layeredCanvases[this.currentCanvasIndex].merge();
    const canvas = await this.addNewPage(this.canvasList.length, this.canvasCoordinates.get(this.currentCanvasIndex) || new CanvasCoordinates(), pageBreak);
    this.canvasList.push(canvas);
    this.layeredCanvases.push(new LayeredCanvas(canvas));
    this.currentCanvasIndex++;
    this.canvas = this.layeredCanvases[this.currentCanvasIndex];
    this.boundary = this.calculateBoundary();
    await this.drawInitialCanvasElements(this);
  }

  private breakColumn() {
    this.currentColumn++;
    this.boundary = this.calculateBoundary();
  }

  public async breakColumnOrPage(pageBreak: PageBreak) {
    if (this.doc.cols && this.doc.cols.quantity > 1) {
      if (this.currentColumn < (this.doc.cols.quantity - 1)) {
        this.breakColumn();
      } else {
        await this.breakPage(pageBreak);
      }
    } else {
      await this.breakPage(pageBreak);
    }
  }

  public addElementDimension(elementIndex: number, elementDimension: Dimension) {
    let coordinates = this.canvasCoordinates.get(this.currentCanvasIndex);
    if (!coordinates) {
      coordinates = new CanvasCoordinates();
      this.canvasCoordinates.set(this.currentCanvasIndex, coordinates);
    }
    coordinates.addElement(elementIndex, elementDimension);
  }
}