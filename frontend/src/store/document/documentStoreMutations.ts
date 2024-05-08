import { MutationTree } from "vuex";
import { DocumentStoreState } from "@/store/document/documentStoreState";

export enum DocumentStoreMutations {
  SET_DOCUMENT = "document",
  SET_SELECTED_PAGE = "selectedPage",
  SET_SELECTED_BACKGROUND_IMAGE = "selectedBackgroundImage",
  SET_SAVED_DOCUMENT_KEY = "savedDocumentKey",
  SET_DOCUMENT_ZOOM = "zoom",
}

export const mutations: MutationTree<DocumentStoreState> = {
  [DocumentStoreMutations.SET_DOCUMENT](state, document) {
    state.document = document;
  },
  [DocumentStoreMutations.SET_SELECTED_PAGE](state, selectedPageId) {
    state.selectedPageId = selectedPageId;
  },
  [DocumentStoreMutations.SET_SELECTED_BACKGROUND_IMAGE](state, selectedBackgroundImage) {
    state.selectedBackgroundImage = selectedBackgroundImage;
  },
  [DocumentStoreMutations.SET_SAVED_DOCUMENT_KEY](state, savedDocumentKey) {
    state.savedDocumentKey = savedDocumentKey;
  },
  [DocumentStoreMutations.SET_DOCUMENT_ZOOM](state, zoom) {
    state.zoom = zoom;
  },
};
