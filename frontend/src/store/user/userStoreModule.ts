import { Module } from "vuex";
import { UserStoreState, state } from "@/store/user/userStoreState";
import { getters } from "@/store/user/userStoreGetters";
import { mutations } from "@/store/user/userStoreMutations";
import { actions } from "@/store/user/userStoreActions";

export const USER_STORE_NAMESPACE = "userStore";

export const userStore: Module<UserStoreState, any> = {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
};

