import DocumentModel from "@/models/document";
import { SelectedBackground } from "@/models/document/backgrounds";

export interface DocumentStoreState {
  document?: DocumentModel;
  selectedPageId?: number;
  selectedBackgroundImage?: SelectedBackground;
  savedDocumentKey?: string;
  zoom: number;
}

export const state: DocumentStoreState = {
  document: undefined,
  selectedPageId: undefined,
  selectedBackgroundImage: undefined,
  savedDocumentKey: undefined,
  zoom: 100,
};
