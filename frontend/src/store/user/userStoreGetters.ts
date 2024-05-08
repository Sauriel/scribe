import { GetterTree } from "vuex";
import { PERSISTED_USER_LOCAL_STORAGE, UserStoreState } from "@/store/user/userStoreState";
import { PersistedUserInformation } from "@/models/user";
import EncryptionHelper from "@/helper/EncryptionHelper";

export enum UserStoreGetters {
  USER = "user",
  PERSISTED_USER = "persistedUser",
  IS_LOGGED_IN = "isLoggedIn",
}

export const getters: GetterTree<UserStoreState, any> = {
  [UserStoreGetters.USER]: (state) => state.user,
  [UserStoreGetters.PERSISTED_USER]: (state) => {
    const fromLS = sessionStorage.getItem(PERSISTED_USER_LOCAL_STORAGE) || localStorage.getItem(PERSISTED_USER_LOCAL_STORAGE);
    if (fromLS) {
      state.persistedUser = EncryptionHelper.decrypt<PersistedUserInformation>(fromLS);
    }
    return state.persistedUser;
  },
  [UserStoreGetters.IS_LOGGED_IN]: (state) => !!state.user || !!state.persistedUser ||!!sessionStorage.getItem(PERSISTED_USER_LOCAL_STORAGE) || !!localStorage.getItem(PERSISTED_USER_LOCAL_STORAGE),
};
