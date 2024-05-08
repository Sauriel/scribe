import { SettingName } from "@/models/setting";
import { PageFormat } from "@/models/document/pageFormat";
import BackgroundImage from "@/models/document/images";
import ElementModel from "@/modules/ElementModel";
import { ImageSource } from "@/models/";

export declare type DocumentVersion = 1;

export const CURRENT_DOCUMENT_VERSION: DocumentVersion = 1;

export default interface DocumentModel {
  version: DocumentVersion;
  name: string;
  format: PageFormat;
  pages: PageModel[];
  defaults: PageDefaults;
}

export declare type PagingPosition = "left" | "center" | "right";

export interface Paging {
  show: boolean;
  alternate: boolean;
  position: PagingPosition;
}

export interface PageFooter {
  image?: ImageSource;
  text?: string;
  paging: Paging;
}

export interface PageDefaults {
  setting: SettingName;
  background: string;
  footer?: PageFooter;
  font?: string;
}

export interface PageModel {
  background?: string;
  backgroundImages: BackgroundImage[];
  elements: ElementModel[];
  footer?: PageFooter;
}
