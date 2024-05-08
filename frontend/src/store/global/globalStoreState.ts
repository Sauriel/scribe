import { DEFAULT } from "@/models/ThemeVariables";

export declare type AppLocale = "en" | "de";

export interface GlobalStoreState {
  locale?: AppLocale;
  showElementBorders?: boolean;
  showMoveHandleOnHover?: boolean;
  theme?: string;
  allowFileUpload: boolean;
  autosave: boolean;
  showInlineTipTapBubble: boolean;
  allowAnalytics?: boolean;
  analyticsBannerShown?: boolean;
  lastSeenChangelog?: string;
}

export const state: GlobalStoreState = {
  locale: undefined,
  showElementBorders: undefined,
  showMoveHandleOnHover: undefined,
  theme: undefined,
  allowFileUpload: false,
  autosave: false,
  showInlineTipTapBubble: true,
  analyticsBannerShown: undefined,
  lastSeenChangelog: undefined
};
