import { PatreonStatus } from "../controller/models/patreon";
import { DBUser } from "../models";

export enum PatreonTier {
  SCRIBE_MASTER = process.env.PATREON_TIER_MASTER, // 20 documents, 20 MB, private
  SCRIBE_PROFESSIONAL = process.env.PATREON_TIER_PROFESSIONAL, // 10 documents, 10 MB, private
  SCRIBE_NOVICE = process.env.PATREON_TIER_NOVICE, // 5 documents, 5 MB, no private
  NONE = "0", // 3 documents, 3 MB, no private
}

function MB2Byte(mb: number): number {
  return mb * 1024 * 1024;
}

export interface UserRights {
  patreonTier: PatreonTier;
  allowPrivate: boolean;
  maxDocuments: number;
  maxSize: number;
}

const DEFAULT_RIGHTS: UserRights = {
  patreonTier: PatreonTier.NONE,
  allowPrivate: false,
  maxDocuments: 3,
  maxSize: MB2Byte(3),
};

const ADMIN = "admin";

const RIGHTS = new Map<string, UserRights>([
  ["0", DEFAULT_RIGHTS],
  [
    process.env.PATREON_TIER_NOVICE,
    {
      patreonTier: PatreonTier.SCRIBE_NOVICE,
      allowPrivate: false,
      maxDocuments: 5,
      maxSize: MB2Byte(5),
    },
  ],
  [
    process.env.PATREON_TIER_PROFESSIONAL,
    {
      patreonTier: PatreonTier.SCRIBE_PROFESSIONAL,
      allowPrivate: true,
      maxDocuments: 10,
      maxSize: MB2Byte(10),
    },
  ],
  [
    process.env.PATREON_TIER_MASTER,
    {
      patreonTier: PatreonTier.SCRIBE_MASTER,
      allowPrivate: true,
      maxDocuments: 20,
      maxSize: MB2Byte(20),
    },
  ],
  [
    ADMIN,
    {
      patreonTier: PatreonTier.NONE,
      allowPrivate: true,
      maxDocuments: 1000,
      maxSize: MB2Byte(1024),
    },
  ],
]);

export default class RightsHelper {
  public static getRights(user: DBUser): UserRights {
    let rights;
    if (user.isAdmin) {
      rights = RIGHTS.get(ADMIN);
    } else if (
      user.patreon &&
      (user.patreon.status as PatreonStatus) === "active_patron"
    ) {
      const patreonId = user.patreon.tierId || "0";
      rights = RIGHTS.get(patreonId);
    }
    return rights || DEFAULT_RIGHTS;
  }
}
