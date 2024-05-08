export interface Link {
  self: string;
}

export interface OauthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
  version: string;
}

/* identity */

export interface IdentityResponse {
  data: Identity;
  included: IdentityIncluded[];
  links: Link;
  errors?: any;
}

export interface Identity {
  attributes: IdentityAttributes;
  id: string;
  relationships: IdentityRelationships;
  type: string;
}

export interface IdentityAttributes {
  email: string;
  full_name: string;
}

export interface IdentityRelationships {
  memberships: IdentityMemberships;
}

export interface IdentityMemberships {
  data: IdentityRelationship[];
}

export interface IdentityRelationship {
  id: string;
  type: string;
}

export interface IdentityIncluded {
  attributes: IncludedTierAttributes | CampaignMemberAttributes;
  relationships?: CampaignMemberRelationships;
  id: string;
  type: IdentityIncludedType;
}

export declare type IdentityIncludedType = "member" | "tier";

export interface IncludedTierAttributes {
  amount_cents: number;
  created_at: string;
  description: string;
  discord_role_ids: string[] | null;
  edited_at: string;
  patron_count: number;
  published: boolean;
  published_at: string;
  title: string;
  url: string;
}

export interface CampaignMemberAttributes {
  currently_entitled_amount_cents: number;
  email: string;
  full_name: string;
  is_follower: boolean;
  last_charge_date: string | null;
  last_charge_status: LastChargeStatus | null;
  lifetime_support_cents: number;
  next_charge_date: string | null;
  note: string;
  patron_status: PatreonStatus | null;
  pledge_relationship_start: string | null;
}

export declare type LastChargeStatus = "Paid" | "Declined" | "Deleted" | "Pending" | "Refunded" | "Fraud" | "Other";

export declare type PatreonStatus = "active_patron" | "declined_patron" | "former_patron";

export interface CampaignMemberRelationships {
  currently_entitled_tiers: CurrentlyEntitledTiers;
}

export interface CurrentlyEntitledTiers {
  data: CurrentlyEntitledTier[];
}

export interface CurrentlyEntitledTier {
  id: string;
  type: string;
}