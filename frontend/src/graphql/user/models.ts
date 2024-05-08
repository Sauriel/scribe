export interface User {
  id: string;
  username: string;
  email: string;
  accessToken: string;
  accessTokenExpireDate: string; // DateTime as ISO String
  refreshToken: string;
  refreshTokenExpireDate: string; // DateTime as ISO String
  patreon?: PatreonInformation;
}

export interface PatreonInformation {
  id: string;
  checkedOn: string; // DateTime as ISO String
  note?: string;
  status?: PatreonStatus;
  email: string;
  name: string;
  tier?: string;
  tierId: string;
  discord?: string[];
}

export declare type PatreonStatus = "active_patron" | "declined_patron" | "former_patron";

export interface LoginQuery {
  login: User;
}

export interface SoftLoginQuery {
  softLogin: User;
}

export interface ConfirmEmailQuery {
  confirmEmail: string;
}


export interface CreateUserMutation {
  createUser: boolean;
}

export interface LogoutMutation {
  logout: boolean;
}

export interface PatreonInformationQuery {
  patreonInformation: PatreonInformation;
}

export interface ChangeUserNameMutation {
  changeUserName: boolean;
}

export interface ChangeUserEmailMutation {
  changeUserEmail: boolean;
}

export interface ChangeUserPasswordMutation {
  changeUserPassword: boolean;
}

export interface PasswordForgottenMutation {
  passwordForgotten: boolean;
}

export interface ResetPasswordMutation {
  resetPassword: boolean;
}

export interface GetTokenQuery {
  getToken: AccessTokenData;
}

export interface AccessTokenData {
  accessToken: string;
  accessTokenExpireDate: string; // DateTime as ISO String
}