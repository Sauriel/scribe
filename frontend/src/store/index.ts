import { createStore } from "vuex";
import { globalStore, GlobalLocalStoreFallback } from "@/store/global/globalStoreModule";
import { documentStore, DocumentLocalStoreFallback } from "@/store/document/documentStoreModule";
import { layoutStore, LayoutLocalStoreFallback } from "@/store/layout/layoutStoreModule";
import { userStore } from "@/store/user/userStoreModule";

export default createStore({
  modules: {
    globalStore,
    documentStore,
    layoutStore,
    userStore,
    pages: {
      namespaced: true,
      modules: {},
    },
  },
});

export const VuexLocalStoreFallbacks = {
  globalStore: GlobalLocalStoreFallback,
  layoutStore: LayoutLocalStoreFallback,
  documentStore: DocumentLocalStoreFallback,
};
