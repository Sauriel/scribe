import { User } from "./../graphql/user/models";

/*
 *  Patreon tier names & IDs
 *  Scribe Master = 7860972
 *  Scribe Professional = 7860971
 *  Scribe Novice = 7860970
 */
export const SCRIBE_NOVICE = "7860970";
export const SCRIBE_PROFESSIONAL = "7860971";
export const SCRIBE_MASTER = "7860972";

const SCRIBE_PRO_TIERS = [SCRIBE_PROFESSIONAL, SCRIBE_MASTER];

export default class RightsHelper {
  public static isProMember(user: User | undefined): boolean {
    if (!user || !user.patreon || user.patreon.status !== "active_patron") {
      return false;
    }
    return SCRIBE_PRO_TIERS.includes(user.patreon.tierId);
  }
}