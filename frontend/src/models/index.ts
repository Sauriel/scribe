export interface DragAndDropEvent<T> {
  added?: {
    element: T;
    newIndex: number;
  };
  removed?: {
    element: T;
    oldIndex: number;
  };
  moved?: {
    element: T;
    oldIndex: number;
    newIndex: number;
  };
}

export interface DragAndDropWrapper<T> {
  index: number;
  value: T;
}

export interface DragAndDropWrapperWithContext<T, K> extends DragAndDropWrapper<T> {
  context: K;
}

export declare type Setter<T, K> = (object: T, value: K) => void;
export declare type Getter<T, K> = (object: T) => K;

export interface NamedColor {
  name: string;
  value: string;
}

export enum TextAlign {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  CENTER = "CENTER",
  JUSTIFY = "JUSTIFY",
}

export enum InsertPosition {
  BEFORE = "BEFORE",
  AFTER = "AFTER",
}

export interface LinkConfig {
  href: string;
  openInNewTab: boolean;
}

export interface StringWrapper {
  value: string;
}

export interface EnumWrapper<T> {
  value: T;
}

export interface ImageSource {
  data?: string;
  url?: string;
}
