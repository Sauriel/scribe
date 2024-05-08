export interface PersistedUserInformation {
  id: string;
  refreshToken: string;
  refreshTokenExpireDate: string; // DateTime as ISO String
}