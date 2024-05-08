import { GetterTree } from "vuex";
import { GlobalStoreState } from "@/store/global/globalStoreState";

export enum GlobalStoreGetters {
  LOCALE = "locale",
  ELEMENT_BORDERS = "showElementBorders",
  MOVE_HANDLER_ON_HOVER = "showMoveHandleOnHover",
  THEME = "theme",
  ALLOW_FILE_UPLOAD = "allowFileUpload",
  AUTOSAVE = "autosave",
  INLINE_TIPTAP_BUBBLE = "showInlineTipTapBubble",
  ALLOW_ANALYTICS = "allowAnalytics",
  ANALYTICS_BANNER_SHOWN = "analyticsBannerShown",
  CHANGELOG_LAST_SEEN = "lastSeenChangelog",
}

export const getters: GetterTree<GlobalStoreState, any> = {
  [GlobalStoreGetters.LOCALE]: (state) => state.locale,
  [GlobalStoreGetters.ELEMENT_BORDERS]: (state) => state.showElementBorders,
  [GlobalStoreGetters.MOVE_HANDLER_ON_HOVER]: (state) => state.showMoveHandleOnHover,
  [GlobalStoreGetters.THEME]: (state) => state.theme,
  [GlobalStoreGetters.ALLOW_FILE_UPLOAD]: (state) => state.allowFileUpload,
  [GlobalStoreGetters.AUTOSAVE]: (state) => state.autosave,
  [GlobalStoreGetters.INLINE_TIPTAP_BUBBLE]: (state) => state.showInlineTipTapBubble,
  [GlobalStoreGetters.ALLOW_ANALYTICS]: (state) => state.allowAnalytics,
  [GlobalStoreGetters.ANALYTICS_BANNER_SHOWN]: (state) => state.analyticsBannerShown,
  [GlobalStoreGetters.CHANGELOG_LAST_SEEN]: (state) => state.lastSeenChangelog,
};
