import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import VuexHelper from "@/helper/VuexHelper";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";
import { LayoutStoreMutations } from "@/store/layout/layoutStoreMutations";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);
const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

export default class DocumentStoreHelper {
  public static resetDocumentStore() {
    documentStore.commit(DocumentStoreMutations.SET_SELECTED_PAGE, undefined);
    documentStore.commit(DocumentStoreMutations.SET_SELECTED_BACKGROUND_IMAGE, undefined);
    layoutStore.commit(LayoutStoreMutations.SET_EDIT_PANEL_COMPONENT, undefined);
    layoutStore.commit(LayoutStoreMutations.SET_RIGHT_PANEL_COMPONENT, undefined);
    layoutStore.commit(LayoutStoreMutations.SET_EDIT_PANEL_MODEL, undefined);
    layoutStore.commit(LayoutStoreMutations.SET_HIGHLIGHTED_MODEL, undefined);
    layoutStore.commit(LayoutStoreMutations.SET_EXPORT_DOCUMENT, false);
  }
}
