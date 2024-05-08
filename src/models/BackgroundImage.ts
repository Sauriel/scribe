export const Mask = {
  None: "none",
  Stains: {
    TopRight: "stains stains--top-right",
    TopRight2: "stains stains--top-right2",
    Top: "stains stains--top"
  }
}

export interface Img {
  src: string;
  width: number;
  height: number;
}

export default interface BackgroundImage {
  image: Img;
  src: string;
  mask: string;
  horizontalPosition: number;
  verticalPosition: number;
}