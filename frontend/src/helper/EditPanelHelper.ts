import { isEqual } from "lodash";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import ElementModel from "@/modules/ElementModel";
import VuexHelper from "@/helper/VuexHelper";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreMutations } from "@/store/layout/layoutStoreMutations";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

const EDIT_PANEL = "EditPanel";

export interface EditPanelConfig {
  element?: ElementModel;
  component?: string;
}

export default class EditPanelHelper {
  public static setElementEditPanel(config: EditPanelConfig = {}) {
    const editPanelComponent = config.element
      ? config.element.component + "Panel"
      : config.component;
    layoutStore.commit(LayoutStoreMutations.SET_EDIT_PANEL_MODEL, config.element);
    layoutStore.commit(
      LayoutStoreMutations.SET_RIGHT_PANEL_COMPONENT,
      editPanelComponent ? EDIT_PANEL : undefined
    );
    layoutStore.commit(LayoutStoreMutations.SET_EDIT_PANEL_COMPONENT, editPanelComponent);
  }

  public static showExportPanel() {
    layoutStore.commit(LayoutStoreMutations.SET_EXPORT_DOCUMENT, true);
    layoutStore.commit(LayoutStoreMutations.SET_RIGHT_PANEL_COMPONENT, "ExportPanel");
    layoutStore.commit(LayoutStoreMutations.SET_EDIT_PANEL_MODEL, undefined);
    layoutStore.commit(LayoutStoreMutations.SET_EDIT_PANEL_COMPONENT, undefined);
  }

  public static editPanelForElementIsShown(element: ElementModel): boolean {
    if (layoutStore.getters(LayoutStoreGetters.RIGHT_PANEL_COMPONENT) === EDIT_PANEL) {
      const editPanelComponent = element.component + "Panel";
      const selectedEditPanelComponent = layoutStore.getters(
        LayoutStoreGetters.EDIT_PANEL_COMPONENT
      );
      const selectedEditPanelModel = layoutStore.getters(LayoutStoreGetters.EDIT_PANEL_MODEL);
      return (
        editPanelComponent === selectedEditPanelComponent &&
        isEqual(element, selectedEditPanelModel)
      );
    }
    return false;
  }
}
