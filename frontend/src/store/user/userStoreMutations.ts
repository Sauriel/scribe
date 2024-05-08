import { MutationTree } from "vuex";
import { PERSISTED_USER_LOCAL_STORAGE, UserStoreState } from "@/store/user/userStoreState";
import EncryptionHelper from "@/helper/EncryptionHelper";
import { PersistedUserInformation } from "@/models/user";

export enum UserStoreMutations {
  SET_USER = "user",
  SET_PERSISTED_USER = "persistedUser",
}

export interface PersistUserPayload {
  user: PersistedUserInformation;
  keepLoggedIn: boolean;
}

export const mutations: MutationTree<UserStoreState> = {
  [UserStoreMutations.SET_USER](state, user) {
    state.user = user;
  },
  [UserStoreMutations.SET_PERSISTED_USER](state, payload: PersistUserPayload) {
    if (payload) {
      const encryptedPersistedUser = EncryptionHelper.encrypt<PersistedUserInformation>(payload.user);
      sessionStorage.setItem(PERSISTED_USER_LOCAL_STORAGE, encryptedPersistedUser);
      if (payload.keepLoggedIn) {
        localStorage.setItem(PERSISTED_USER_LOCAL_STORAGE, encryptedPersistedUser);
      }
    } else {
      localStorage.removeItem(PERSISTED_USER_LOCAL_STORAGE);
      sessionStorage.removeItem(PERSISTED_USER_LOCAL_STORAGE);
    }
    state.persistedUser = payload?.user;
  },
};
