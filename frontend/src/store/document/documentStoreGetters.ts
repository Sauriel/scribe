import { GetterTree } from "vuex";
import { DocumentStoreState } from "@/store/document/documentStoreState";

export enum DocumentStoreGetters {
  DOCUMENT = "document",
  SELECTED_PAGE = "selectedPage",
  SELECTED_BACKGROUND_IMAGE = "selectedBackgroundImage",
  SAVED_DOCUMENT_KEY = "savedDocumentKey",
  DOCUMENT_ZOOM = "zoom",
}

export const getters: GetterTree<DocumentStoreState, any> = {
  [DocumentStoreGetters.DOCUMENT]: (state) => state.document,
  [DocumentStoreGetters.SELECTED_PAGE]: (state) => state.selectedPageId,
  [DocumentStoreGetters.SELECTED_BACKGROUND_IMAGE]: (state) => state.selectedBackgroundImage,
  [DocumentStoreGetters.SAVED_DOCUMENT_KEY]: (state) => state.savedDocumentKey,
  [DocumentStoreGetters.DOCUMENT_ZOOM]: (state) => state.zoom,
};
