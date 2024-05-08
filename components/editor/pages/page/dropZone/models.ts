import type { Dimension } from '~~/models/canvas/context';

export type DropZoneDimension = {
  nextElementIndex: number;
} & Dimension;

export type ElementDroppedEvent = {
  index: number;
  name: string;
}