import CustomImage from "@/tiptap/image/image";
// @ts-ignore
import { ImageFloat } from "@/components/app/dialog/image/add/AddImageDialogContent.vue";

export * from "@/tiptap/image/image";

export default CustomImage;

export interface CustomImageAttributes {
  src: string;
  title?: string;
  alt?: string;
  width: string;
  height: string;
  float: ImageFloat;
  noBg: boolean;
  pngMask: boolean;
}
