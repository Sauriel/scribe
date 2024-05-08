import { MutationTree } from "vuex";
import { LayoutStoreState } from "@/store/layout/layoutStoreState";

export enum LayoutStoreMutations {
  SET_EDIT_PANEL_COMPONENT = "editPanelComponent",
  SET_RIGHT_PANEL_COMPONENT = "rightPanelComponent",
  SET_EDIT_PANEL_MODEL = "editPanelModel",
  SET_HIGHLIGHTED_MODEL = "highlightedElement",
  SET_EXPORT_DOCUMENT = "exportDocument",
  SET_DRAGGING_ELEMENT = "draggingElement",
}

export const mutations: MutationTree<LayoutStoreState> = {
  [LayoutStoreMutations.SET_EDIT_PANEL_COMPONENT](state, editPanelComponent) {
    state.editPanelComponent = editPanelComponent;
  },
  [LayoutStoreMutations.SET_RIGHT_PANEL_COMPONENT](state, rightPanelComponent) {
    state.rightPanelComponent = rightPanelComponent;
  },
  [LayoutStoreMutations.SET_EDIT_PANEL_MODEL](state, editPanelModel) {
    state.editPanelModel = editPanelModel;
  },
  [LayoutStoreMutations.SET_HIGHLIGHTED_MODEL](state, highlightedElement) {
    state.highlightedElement = highlightedElement;
  },
  [LayoutStoreMutations.SET_EXPORT_DOCUMENT](state, exportDocument) {
    state.exportDocument = exportDocument;
  },
  [LayoutStoreMutations.SET_DRAGGING_ELEMENT](state, draggingElement) {
    state.draggingElement = draggingElement;
  },
};
