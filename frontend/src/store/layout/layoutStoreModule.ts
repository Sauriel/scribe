import { Module } from "vuex";
import { LayoutStoreState, state } from "@/store/layout/layoutStoreState";
import { getters } from "@/store/layout/layoutStoreGetters";
import { mutations } from "@/store/layout/layoutStoreMutations";

export const LAYOUT_STORE_NAMESPACE = "layoutStore";

export const layoutStore: Module<LayoutStoreState, any> = {
  state,
  getters,
  mutations,
  namespaced: true,
};

export const LayoutLocalStoreFallback = {};
