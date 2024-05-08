import { Module } from "vuex";
import { DocumentStoreState } from "@/store/document/documentStoreState";
import { state } from "@/store/document/documentStoreState";
import { getters } from "@/store/document/documentStoreGetters";
import { mutations } from "@/store/document/documentStoreMutations";
import { actions } from "@/store/document/documentStoreActions";

export const DOCUMENT_STORE_NAMESPACE = "documentStore";

export const documentStore: Module<DocumentStoreState, any> = {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
};

export const DocumentLocalStoreFallback = {
  selectedPageId: "app.document.page.selected",
  savedDocumentKey: "app.document.last-save",
};
