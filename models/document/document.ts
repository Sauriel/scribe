import type TextareaJSON from 'models/sc/textarea/model';
import type DocElement from '../elements/elements';
import type { Unit } from '../global';

export type DocMargin = {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export type DocCols = {
  quantity: number;
  gap: number;
  widths?: number[]; // in %
}

export type DocStyle = {
  background?: string;
}

type ScribeDoc = {
  id?: string;
  name: string;
  description?: TextareaJSON;
  private: boolean;
  allowComments: boolean
  project?: string;
  unit: Unit;
  width: number;
  height: number;
  margin: number | DocMargin;
  cols?: DocCols;
  style?: DocStyle;
  pages: number;
  content: DocElement[];
}

export function serializeDoc(doc: ScribeDoc): string {
  return JSON.stringify(doc);
}

export function deserializeDoc(doc: string): ScribeDoc {
  return JSON.parse(doc) as ScribeDoc;
}

export default ScribeDoc;