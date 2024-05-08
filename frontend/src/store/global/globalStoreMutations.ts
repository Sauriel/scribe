import { MutationTree } from "vuex";
import { GlobalStoreState } from "@/store/global/globalStoreState";

export enum GlobalStoreMutations {
  SET_LOCALE = "locale",
  SET_ELEMENT_BORDERS = "showElementBorders",
  SET_MOVE_HANDLER_ON_HOVER = "showMoveHandleOnHover",
  SET_THEME = "theme",
  SET_ALLOW_FILE_UPLOAD = "allowFileUpload",
  SET_AUTOSAVE = "autosave",
  SET_INLINE_TIPTAP_BUBBLE = "showInlineTipTapBubble",
  SET_ALLOW_ANALYTICS = "allowAnalytics",
  SET_ANALYTICS_BANNER_SHOWN = "analyticsBannerShown",
  SET_CHANGELOG_LAST_SEEN = "lastSeenChangelog",
}

export const mutations: MutationTree<GlobalStoreState> = {
  [GlobalStoreMutations.SET_LOCALE](state, locale) {
    state.locale = locale;
  },
  [GlobalStoreMutations.SET_ELEMENT_BORDERS](state, showElementBorders) {
    state.showElementBorders = showElementBorders;
  },
  [GlobalStoreMutations.SET_MOVE_HANDLER_ON_HOVER](state, showMoveHandleOnHover) {
    state.showMoveHandleOnHover = showMoveHandleOnHover;
  },
  [GlobalStoreMutations.SET_THEME](state, theme) {
    state.theme = theme;
  },
  [GlobalStoreMutations.SET_ALLOW_FILE_UPLOAD](state, allowFileUpload) {
    state.allowFileUpload = allowFileUpload;
  },
  [GlobalStoreMutations.SET_AUTOSAVE](state, autosave) {
    state.autosave = autosave;
  },
  [GlobalStoreMutations.SET_INLINE_TIPTAP_BUBBLE](state, showInlineTipTapBubble) {
    state.showInlineTipTapBubble = showInlineTipTapBubble;
  },
  [GlobalStoreMutations.SET_ALLOW_ANALYTICS](state, allowAnalytics) {
    state.allowAnalytics = allowAnalytics;
  },
  [GlobalStoreMutations.SET_ANALYTICS_BANNER_SHOWN](state, analyticsBannerShown) {
    state.analyticsBannerShown = analyticsBannerShown;
  },
  [GlobalStoreMutations.SET_CHANGELOG_LAST_SEEN](state, lastSeenChangelog) {
    state.lastSeenChangelog = lastSeenChangelog;
  },
};
