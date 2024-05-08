import { Module } from "vuex";
import { GlobalStoreState, state } from "@/store/global/globalStoreState";
import { getters } from "@/store/global/globalStoreGetters";
import { mutations } from "@/store/global/globalStoreMutations";

export const GLOBAL_STORE_NAMESPACE = "globalStore";

export const globalStore: Module<GlobalStoreState, any> = {
  state,
  getters,
  mutations,
  namespaced: true,
};

export const GlobalLocalStoreFallback = {
  locale: "app.global.locale",
  showElementBorders: "app.global.element-borders",
  theme: "app.global.theme",
  autosave: "app.global.autosave",
  showInlineTipTapBubble: "app.global.inline-tiptap-bubble",
  allowAnalytics: "app.global.analytics.allowed",
  analyticsBannerShown: "app.global.analytics.banner.shown",
  lastSeenChangelog: "app.global.changelog.last-seen"
};
