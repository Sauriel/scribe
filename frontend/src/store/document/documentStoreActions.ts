import { ActionTree } from "vuex";
import { DocumentStoreState } from "@/store/document/documentStoreState";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";
import emitter from "@/emitter";
import { PageSelectedEvent, PAGE_SELECTED_EVENT_NAME } from "@/events/page";

export enum DocumentStoreActions {
  SELECT_PAGE = "SELECT_PAGE",
}

export const actions: ActionTree<DocumentStoreState, any> = {
  [DocumentStoreActions.SELECT_PAGE]({ commit }, payload: number) {
    const event: PageSelectedEvent = {
      name: PAGE_SELECTED_EVENT_NAME,
      payload: payload,
    };
    emitter.$emit(PAGE_SELECTED_EVENT_NAME, event);
    commit(DocumentStoreMutations.SET_SELECTED_PAGE, payload);
  },
};
