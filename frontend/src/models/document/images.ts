import { ImageSource } from "@/models/";

export interface Position {
  x: number;
  y: number;
}

export default interface BackgroundImage {
  name: string;
  imageSrc: ImageSource;
  maskId: string;
  width: number;
  height: number;
  position: Position;
}
