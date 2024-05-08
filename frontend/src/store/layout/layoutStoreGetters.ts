import { GetterTree } from "vuex";
import { LayoutStoreState } from "@/store/layout/layoutStoreState";

export enum LayoutStoreGetters {
  EDIT_PANEL_COMPONENT = "editPanelComponent",
  RIGHT_PANEL_COMPONENT = "rightPanelComponent",
  EDIT_PANEL_MODEL = "editPanelModel",
  HIGHLIGHTED_MODEL = "highlightedElement",
  EXPORT_DOCUMENT = "exportDocument",
  DRAGGING_ELEMENT = "draggingElement",
}

export const getters: GetterTree<LayoutStoreState, any> = {
  [LayoutStoreGetters.EDIT_PANEL_COMPONENT]: (state) => state.editPanelComponent,
  [LayoutStoreGetters.RIGHT_PANEL_COMPONENT]: (state) => state.rightPanelComponent,
  [LayoutStoreGetters.EDIT_PANEL_MODEL]: (state) => state.editPanelModel,
  [LayoutStoreGetters.HIGHLIGHTED_MODEL]: (state) => state.highlightedElement,
  [LayoutStoreGetters.EXPORT_DOCUMENT]: (state) => state.exportDocument,
  [LayoutStoreGetters.DRAGGING_ELEMENT]: (state) => state.draggingElement,
};
