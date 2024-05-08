import { User } from "@/graphql/user/models";
import { PersistedUserInformation } from "@/models/user";

export interface UserStoreState {
  user?: User;
  persistedUser?: PersistedUserInformation;
}

export const state: UserStoreState = {
  user: undefined,
  persistedUser: undefined,
};

export const PERSISTED_USER_LOCAL_STORAGE = "app.user";
