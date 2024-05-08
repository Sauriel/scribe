import AppDocument from "@/models/AppDocument";
import { PageFormat } from "@/models/AppDocumentSettings";
import AppPage from "@/models/AppPage";
import LayoutElement from "@/models/layout-elements/LayoutElement";
import { Module } from "vuex";

export declare type Tool = "PagesOverview" | "Settings" | "Elements";
export declare type SettingsSubTool = "GlobalSettings" | "PageSettings" | "ElementSettings";

const LS_SHOW_OVERVIEW = "settings.layout.page-overview.right";
const LS_SHOW_OVERVIEW_SHOW = "show";
const LS_SHOW_OVERVIEW_HIDE = "hide";
const LS_ELEMENTS_ALWAYS_SHOW_BORDER = "settings.elements.always-show-border";
const LS_QUICK_ACCESS_ONLY_ON_PAGE_END = "settings.elements.quick-access-only-on-page-end";
const LS_FAVORITE_ELEMENTS = "settings.elements.favorites";
const LS_TRUE = "true";
const LS_FALSE = "false";

export interface IState {
  selectedPageId: number;
  editingPage?: AppPage;
  document?: AppDocument;
  selectedTool: Tool;
  selectedSettingsSubTool: SettingsSubTool;
  showOverview: boolean;
  alwaysShowElementBorder: boolean;
  quickAccessRowOnlyOnPageEnd: boolean;
  favoriteElements: LayoutElement[];
}

export const appStore: Module<IState, any> = {
  namespaced: true,
  state: {
    selectedPageId: -1,
    editingPage: undefined,
    document: undefined,
    selectedTool: "Elements",
    selectedSettingsSubTool: "GlobalSettings",
    showOverview: true,
    alwaysShowElementBorder: true,
    quickAccessRowOnlyOnPageEnd: true,
    favoriteElements: []
  },
  getters: {
    selectedPageId: state => {
      if (state.selectedPageId < 0 && state.document && state.document.pages.length > 0) {
        state.selectedPageId = 0;
      }
      return state.selectedPageId
    },
    editingPage: state => state.editingPage,
    document: state => state.document,
    selectedTool: state => state.selectedTool,
    selectedSettingsSubTool: state => state.selectedSettingsSubTool,
    documentPageFormat: state => state.document ? state.document.settings.pageSize : undefined,
    showOverview: state => {
      const fromLS = localStorage.getItem(LS_SHOW_OVERVIEW);
      if (fromLS != null) {
        state.showOverview = fromLS === LS_SHOW_OVERVIEW_SHOW;
      }
      return state.showOverview;
    },
    alwaysShowElementBorder: state => {
      const fromLS = localStorage.getItem(LS_ELEMENTS_ALWAYS_SHOW_BORDER);
      if (fromLS != null) {
        state.alwaysShowElementBorder = fromLS === LS_TRUE;
      }
      return state.alwaysShowElementBorder;
    },
    quickAccessRowOnlyOnPageEnd: state => {
      const fromLS = localStorage.getItem(LS_QUICK_ACCESS_ONLY_ON_PAGE_END);
      if (fromLS != null) {
        state.quickAccessRowOnlyOnPageEnd = fromLS === LS_TRUE;
      }
      return state.quickAccessRowOnlyOnPageEnd;
    },
    favoriteElements: state => {
      const fromLS = localStorage.getItem(LS_FAVORITE_ELEMENTS);
      if (fromLS != null) {
        state.favoriteElements = JSON.parse(fromLS) as LayoutElement[];
      }
      return state.favoriteElements;
    }
  },
  mutations: {
    setSelectedPageId(state: IState, value: number) {
      state.selectedPageId = value;
    },
    setEditingPage(state: IState, value: AppPage) {
      state.editingPage = value;
    },
    setDocument(state: IState, value: AppDocument) {
      state.document = value;
    },
    setSelectedTool(state: IState, value: Tool) {
      state.selectedTool = value;
    },
    setSettingsSubTool(state: IState, value: SettingsSubTool) {
      state.selectedSettingsSubTool = value;
    },
    setDocumentPageFormat(state: IState, value: PageFormat) {
      if (state.document) {
        state.document.settings.pageSize = value;
      }
    },
    setShowOverview(state: IState, value: boolean) {
      localStorage.setItem(LS_SHOW_OVERVIEW, value ? LS_SHOW_OVERVIEW_SHOW : LS_SHOW_OVERVIEW_HIDE);
      state.showOverview = value;
    },
    setAlwaysShowElementBorder(state: IState, value: boolean) {
      localStorage.setItem(LS_ELEMENTS_ALWAYS_SHOW_BORDER, value ? LS_TRUE : LS_FALSE);
      state.alwaysShowElementBorder = value;
    },
    setQuickAccessRowOnlyOnPageEnd(state: IState, value: boolean) {
      localStorage.setItem(LS_QUICK_ACCESS_ONLY_ON_PAGE_END, value ? LS_TRUE : LS_FALSE);
      state.quickAccessRowOnlyOnPageEnd = value;
    },
    setFavoriteElements(state: IState, value: LayoutElement[]) {
      localStorage.setItem(LS_FAVORITE_ELEMENTS, JSON.stringify(value));
      state.favoriteElements = value;
    },
    addFavoriteElement(state: IState, value: LayoutElement) {
      const favorites = state.favoriteElements;
      favorites.push(value);
      localStorage.setItem(LS_FAVORITE_ELEMENTS, JSON.stringify(favorites));
    },
    removeFavoriteElement(state: IState, value: LayoutElement) {
      const favorites = state.favoriteElements;
      const index = favorites.findIndex(fav => fav.component == value.component);
      if (index >= 0) {
        favorites.splice(index, 1);
        localStorage.setItem(LS_FAVORITE_ELEMENTS, JSON.stringify(favorites));
      } else {
        console.error("Could not remove favorite element.", value);
      }
    }
  }
}