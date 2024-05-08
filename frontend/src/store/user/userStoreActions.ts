import { User } from "@/graphql/user/models";
import { ActionTree } from "vuex";
import { UserStoreState } from "@/store/user/userStoreState";
import { PersistUserPayload, UserStoreMutations } from "@/store/user/userStoreMutations";
import { PersistedUserInformation } from "@/models/user";

export enum UserStoreActions {
  USER = "user",
}

export interface UserActionPayload {
  user: User;
  keepLoggedIn: boolean;
}

export const actions: ActionTree<UserStoreState, any> = {
  [UserStoreActions.USER]({ commit }, payload?: UserActionPayload) {
    if (payload && payload.user) {
      const persistedUser: PersistedUserInformation = {
        id: payload.user.id,
        refreshToken: payload.user.refreshToken,
        refreshTokenExpireDate: payload.user.refreshTokenExpireDate
      };
      const persistedUserPayload: PersistUserPayload = {
        user: persistedUser,
        keepLoggedIn: payload.keepLoggedIn
      };
      commit(UserStoreMutations.SET_USER, payload.user);
      commit(UserStoreMutations.SET_PERSISTED_USER, persistedUserPayload);
    } else {
      commit(UserStoreMutations.SET_USER, undefined);
      commit(UserStoreMutations.SET_PERSISTED_USER, undefined);
    }
  },
};
