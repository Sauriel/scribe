import ElementModel from "@/modules/ElementModel";

export interface LayoutStoreState {
  editPanelComponent?: string;
  rightPanelComponent?: string;
  editPanelModel?: ElementModel;
  highlightedElement?: ElementModel;
  exportDocument: boolean;
  draggingElement: boolean;
}

export const state: LayoutStoreState = {
  editPanelComponent: undefined,
  rightPanelComponent: undefined,
  editPanelModel: undefined,
  highlightedElement: undefined,
  exportDocument: false,
  draggingElement: false,
};
