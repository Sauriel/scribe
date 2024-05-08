import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { UserModel } from "../graphql/entities/user";
import MailHelper, { MailConfig, Sender } from "./mail-helper";
import { DBUser } from "../models";
import addMinutes from "date-fns/addMinutes";
import { AccessTokenData } from "../graphql/types/user-types";

export type UserExists = "email" | "username" | null;

export default class UserHelper {
  public static addToken(user: DBUser) {
    const refreshToken = uuidv4();
    user.refreshToken = refreshToken;
    const refreshTokenExpireDate = new Date();
    const expirationDuration: number = Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION) || 30;
    refreshTokenExpireDate.setDate(refreshTokenExpireDate.getDate() + expirationDuration);
    user.refreshTokenExpireDate = refreshTokenExpireDate;
    user.save();
    const userData = this.createUserData(user);
    const accessTokenData = this.generateToken(userData, 15);
    user.accessToken = accessTokenData.accessToken;
    user.accessTokenExpireDate = accessTokenData.accessTokenExpireDate;
  }

  public static removeToken(user: DBUser) {
    user.refreshToken = undefined;
    user.refreshTokenExpireDate = undefined;
    user.save();
  }

  public static createUserData(user: DBUser): Express.User {
    return {
      userId: user.id,
    };
  }

  public static generateToken(userData: Express.User, expiresInMinutes: number): AccessTokenData {
    return {
      accessToken: jwt.sign(userData, process.env.JWT_SECRET || "", { expiresIn: expiresInMinutes + "m" }),
      accessTokenExpireDate: addMinutes(new Date(), expiresInMinutes)
    };
  }

  public static async checkIfUserExists(username?: String, email?: String): Promise<UserExists> {
    let user = null;
    if (email) {
      user = await UserModel.findOne({ email: email });
      if (!!user) {
        return "email";
      }
    }
    if (username) {
      user = await UserModel.findOne({ username: username });
      if (!!user) {
        return "username";
      }
    }
    return null;
  }

  public static async getUser(loginName: String): Promise<DBUser> {
    let user = null;
    user = await UserModel.findOne({ email: loginName });
    if (!user) {
      user = await UserModel.findOne({ username: loginName });
    }
    return user !== null ? user : Promise.reject("User not found.");
  }

  public static sendRegistrationEmail(user: DBUser) {
    const emailToken = uuidv4();
    user.emailToken = emailToken;
    user.save();
    const validationUrl = process.env.FRONTEND_URL + "/registration?token=" + emailToken;
    const mail: MailConfig = {
      from: Sender.REGISTRATION,
      to: user.email as string,
      subject: "Welcome to Scribe",
      html: `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;700&display=swap');

          body {
            background-color: #263238;
            color: #eceff1;
            font-family: Fira Sans, sans-serif;
          }

          h1 {
            position: relative;
            font-size: 2em;
            font-weight: 700;
            margin: 0 0 30px;
            z-index: 1;
            text-shadow: -4px -4px 0 #263238,4px -4px 0 #263238,-4px 4px 0 #263238,4px 4px 0 #263238;
          }

          h1::before {
            content: "";
            border-bottom: 2px solid #6a1b9a;
            display: block;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 1px;
            z-index: -1;
          }

          #welcome {
            width: 600px;
            margin: 2em auto;
          }

          #content {
            text-align: center;
          }

          a {
            color: #9c4dcc;
          }

          a.button {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            margin: 10px auto;
            min-height: 30px;
            min-width: 30px;
            background-color: #6a1b9a;
            border: 1px solid #38006b;
            color: #eceff1;
            border-radius: 4px;
            padding: 10px 20px;
            cursor: pointer;
            background-position: center;
            transition: background .8s;
            text-decoration: none;
          }

          a.button:hover {
            border-color: #6a1b9a;
            background: #9c4dcc radial-gradient(circle, transparent 1%, #9c4dcc 1%) center/15000%;
          }
        </style>
        <div id="welcome">
          <h1>Welcome to Scribe</h1>
          <div id="content">
            <p>We just need to validate your email address before we get started. Just click on the button below and you're done:</p>
            <a class=button href="${validationUrl}">Confirm email address</a>
            <p>If the button does not work, please copy this URL to your browser bar:</p>
            <a href="${validationUrl}">${validationUrl}</a>
          </div>
        </div>
      `
    };
    MailHelper.sendMail(mail)
  }

  public static sendPasswordForgottenEmail(user: DBUser) {
    const passwordResetToken = uuidv4();
    user.passwordResetToken = passwordResetToken;
    user.save();
    const validationUrl = process.env.FRONTEND_URL + "/passwordReset?token=" + passwordResetToken;
    const mail: MailConfig = {
      from: Sender.REGISTRATION,
      to: user.email as string,
      subject: "Password Reset for Scribe",
      html: `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;700&display=swap');

          body {
            background-color: #263238;
            color: #eceff1;
            font-family: Fira Sans, sans-serif;
          }

          h1 {
            position: relative;
            font-size: 2em;
            font-weight: 700;
            margin: 0 0 30px;
            z-index: 1;
            text-shadow: -4px -4px 0 #263238,4px -4px 0 #263238,-4px 4px 0 #263238,4px 4px 0 #263238;
          }

          h1::before {
            content: "";
            border-bottom: 2px solid #6a1b9a;
            display: block;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 1px;
            z-index: -1;
          }

          #welcome {
            width: 600px;
            margin: 2em auto;
          }

          #content {
            text-align: center;
          }

          a {
            color: #9c4dcc;
          }

          a.button {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            margin: 10px auto;
            min-height: 30px;
            min-width: 30px;
            background-color: #6a1b9a;
            border: 1px solid #38006b;
            color: #eceff1;
            border-radius: 4px;
            padding: 10px 20px;
            cursor: pointer;
            background-position: center;
            transition: background .8s;
            text-decoration: none;
          }

          a.button:hover {
            border-color: #6a1b9a;
            background: #9c4dcc radial-gradient(circle, transparent 1%, #9c4dcc 1%) center/15000%;
          }
        </style>
        <div id="welcome">
          <h1>You requested a password reset/h1>
          <div id="content">
            <p>Please click on the button below to reset yur password:</p>
            <a class=button href="${validationUrl}">Confirm email address</a>
            <p>If the button does not work, please copy this URL to your browser bar:</p>
            <a href="${validationUrl}">${validationUrl}</a>
          </div>
        </div>
      `
    };
    MailHelper.sendMail(mail)
  }
}