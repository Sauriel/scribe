import { Request, Response } from "express";
// @ts-ignore
import { oauth } from "@nathanhigh/patreon";
import fetch from "isomorphic-fetch";
import { CampaignMemberAttributes, IdentityResponse, IncludedTierAttributes, OauthResponse } from "./models/patreon";
import { UserModel } from "../graphql/entities/user";
import { DBUser } from "../models";

const PATREON_API_BASE = "https://www.patreon.com/api/oauth2/v2";
const CLIENT_ID = process.env.PATREON_CLIENT_ID;
const CLIENT_SECRET = process.env.PATREON_CLIENT_SECRET;
const oauthClient = oauth(CLIENT_ID, CLIENT_SECRET);
const REDIRECT_URL = process.env.PATREON_REDIRECT_URL;

function getPatreonUserInformation(accessToken: string):Promise<IdentityResponse> {
  const identityUrl = new URL(`${PATREON_API_BASE}/identity`);
  identityUrl.searchParams.set("include", "memberships,campaign,memberships.currently_entitled_tiers");
  identityUrl.searchParams.set("fields[user]", "full_name,email");
  identityUrl.searchParams.set("fields[campaign]", "vanity,summary");
  identityUrl.searchParams.set("fields[member]", "email,full_name,is_follower,last_charge_date,last_charge_status,lifetime_support_cents,currently_entitled_amount_cents,next_charge_date,pledge_relationship_start,note,patron_status");
  identityUrl.searchParams.set("fields[tier]", "amount_cents,created_at,description,discord_role_ids,edited_at,patron_count,published,published_at,title,url");
  const options: any = getFetchOptions(identityUrl, accessToken);
  return fetch(identityUrl.href, options).then(res => res.json());
}

function savePatronData(token: OauthResponse, identity: IdentityResponse, user: DBUser | null): Promise<any> {
  if (!user) {
    throw new Error("Could not find user.");
  }
  const campaignMember = identity.included.find(i => i.type === "member");
  const tier = identity.included.find(i => i.type === "tier");
  user.patreon = {
    id: "",
    accessToken: token.access_token,
    accessTokenExpires: new Date(Date.now() + token.expires_in),
    refreshToken: token.refresh_token,
    checkedOn: new Date(),
    discord: (tier?.attributes as IncludedTierAttributes)?.discord_role_ids || undefined,
    email: identity.data.attributes.email,
    name: identity.data.attributes.full_name,
    note: (campaignMember?.attributes as CampaignMemberAttributes)?.note || undefined,
    status: (campaignMember?.attributes as CampaignMemberAttributes)?.patron_status as string || undefined,
    tier: (tier?.attributes as IncludedTierAttributes)?.title || undefined,
    tierId: tier?.id || undefined
  };
  return user.save();
}

export function confirmPatreonController(request: Request, response: Response) {
  const oauthGrantCode = request.query.code;
  const scribeUserId = request.query.state;

  let token: OauthResponse;
  let identity: IdentityResponse;

  oauthClient.getTokens(oauthGrantCode, REDIRECT_URL)
    .then((json: OauthResponse) => {
      token = json;
      return getPatreonUserInformation(token.access_token);
    })
    .then((json: IdentityResponse) => {
      if (json.errors) {
        throw new Error(json.errors);
      }
      identity = json;
      return UserModel.findById(scribeUserId);
    })
    .then((user: DBUser | null) => savePatronData(token, identity, user))
    .then(() => {
      response.redirect(process.env.FRONTEND_URL + "/thanks?source=patreon")
    })
    .catch((err: any) => handleError(err, response));
};

function handleError(error: any, res?: Response) {
  console.error(error);
  if (res) {
    res.sendStatus(500);
  }
}

function getFetchOptions(url: URL, accessToken: string) {
  return {
    method: "GET",
    url: url.href,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    credentials: "include"
  };
}

export function checkPatreonInformation(user: DBUser): Promise<any> {
  let token: OauthResponse;
  let identity: IdentityResponse;

  return oauthClient.refreshToken(user.patreon?.refreshToken)
    .then((json: OauthResponse) => {
      token = json;
      return getPatreonUserInformation(token.access_token);
    })
    .then((json: IdentityResponse) => {
      if (json.errors) {
        throw new Error(json.errors);
      }
      identity = json;
      return savePatronData(token, identity, user);
    })
    .catch((err: any) => handleError(err));
}