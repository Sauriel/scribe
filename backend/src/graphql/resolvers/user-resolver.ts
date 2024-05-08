import { Resolver, Arg, Query, Mutation, Ctx } from 'type-graphql';
import { User, UserModel } from '../entities/user';
import GraphQLError from '../graphql-error';
import { UserLoginInput, UserCreateInput } from "./types/user-input";
import UserHelper from '../../helper/user-helper';
import { Context } from 'apollo-server-core';
import { ApolloContext } from '../../types/custom';
import isAfter from 'date-fns/isAfter';
import { PatreonInformation } from '../entities/patreon-information';
import { AccessTokenData } from '../types/user-types';

@Resolver()
export class UserResolver {
  @Query((_returns) => User, { nullable: false })
  async login(@Arg("input") input: UserLoginInput): Promise<User> {
    let user;
    try {
      user = await UserHelper.getUser(input.loginName);
    } catch (e: unknown) {
      throw new GraphQLError("No user found", "error.api.user.not-found", "RESOURCE_NOT_FOUND");
    }
    if (user.password !== input.password) {
      throw new GraphQLError("Wrong user credentials", "error.api.user.wrong-credentials", "BAD_USER_INPUT");
    }
    if (user.emailToken) {
      throw new GraphQLError("User not confirmed", "error.api.user.not-confirmed", "RESOURCE_NOT_FOUND");
    }
    UserHelper.addToken(user);
    return user;
  }

  @Query((_returns) => User, { nullable: false })
  async softLogin(@Arg("userId") userId: String, @Arg("refreshToken") refreshToken: String): Promise<User> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new GraphQLError("No user found", "error.api.user.not-found", "RESOURCE_NOT_FOUND");
    }
    if (refreshToken != user.refreshToken) {
      throw new GraphQLError("Invalid refresh token", "error.api.token.refresh.invalid", "INVALID_DATA")
    }
    if (isAfter(new Date(), user.refreshTokenExpireDate || 0)) {
      throw new GraphQLError("Expired refresh token", "error.api.token.refresh.expired", "INVALID_DATA")
    }
    if (user.emailToken) {
      throw new GraphQLError("User not confirmed", "error.api.user.not-confirmed", "RESOURCE_NOT_FOUND");
    }
    UserHelper.addToken(user);
    return user;
  }

  @Query((_returns) => AccessTokenData, { nullable: false })
  async getToken(@Arg("userId") userId: String, @Arg("refreshToken") refreshToken: String): Promise<AccessTokenData> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new GraphQLError("No user found", "error.api.user.not-found", "RESOURCE_NOT_FOUND");
    }
    if (refreshToken != user.refreshToken) {
      throw new GraphQLError("Invalid refresh token", "error.api.token.refresh.invalid", "INVALID_DATA")
    }
    if (isAfter(new Date(), user.refreshTokenExpireDate || 0)) {
      throw new GraphQLError("Expired refresh token", "error.api.token.refresh.expired", "INVALID_DATA")
    }
    if (user.emailToken) {
      throw new GraphQLError("User not confirmed", "error.api.user.not-confirmed", "RESOURCE_NOT_FOUND");
    }
    const userData = UserHelper.createUserData(user);
    return UserHelper.generateToken(userData, 15);
  }

  @Query((_returns) => String, { nullable: false })
  async confirmEmail(@Arg("token") token: String): Promise<String> {
    const user = await UserModel.findOne({ emailToken: token });
    if (!user) {
      throw new GraphQLError("No user found", "error.api.user.not-found", "RESOURCE_NOT_FOUND");
    }
    user.emailToken = undefined;
    user.save();
    return user.email;
  }

  @Mutation(() => Boolean, { nullable: false })
  async createUser(@Arg("input") input: UserCreateInput, @Ctx() context: ApolloContext): Promise<Boolean> {
    const existingUser = await UserHelper.checkIfUserExists(input.username, input.email);
    if (existingUser) {
      throw new GraphQLError("User already exists", "error.api.user.exists." + existingUser, "EXISTING_DATA");
    }
    const user = await (await UserModel.create({ ...input })).save();
    UserHelper.sendRegistrationEmail(user);
    return !!user;
  }

  @Mutation(() => Boolean, { nullable: false })
  async logout(@Arg("userId") userId: String, @Ctx() context: ApolloContext): Promise<Boolean> {
    const contextUser = context.user;
    if (!contextUser) {
      throw new GraphQLError("Not authenticated", "error.api.authentication.missing", "UNAUTHENTICATED");
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new GraphQLError("No user found", "error.api.user.not-found", "RESOURCE_NOT_FOUND");
    }
    UserHelper.removeToken(user);
    return true;
  }

  @Query((_returns) => PatreonInformation, { nullable: true })
  async patreonInformation(@Ctx() context: ApolloContext): Promise<PatreonInformation | undefined> {
    const contextUser = context.user;
    if (!contextUser) {
      throw new GraphQLError("Not authenticated", "error.api.authentication.missing", "UNAUTHENTICATED");
    }
    const userId = contextUser.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new GraphQLError("No user found", "error.api.user.not-found", "RESOURCE_NOT_FOUND");
    }
    return user.patreon;
  }

  @Mutation(() => Boolean, { nullable: false })
  async changeUserName(@Arg("username") username: String, @Ctx() context: ApolloContext): Promise<Boolean> {
    const contextUser = context.user;
    if (!contextUser) {
      throw new GraphQLError("Not authenticated", "error.api.authentication.missing", "UNAUTHENTICATED");
    }
    const existingUser = await UserHelper.checkIfUserExists(username, undefined);
    if (existingUser) {
      throw new GraphQLError("User already exists", "error.api.user.exists." + existingUser, "EXISTING_DATA");
    }
    const userId = contextUser.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new GraphQLError("No user found", "error.api.user.not-found", "RESOURCE_NOT_FOUND");
    }
    user.username = username;
    user.save();
    return true;
  }

  @Mutation(() => Boolean, { nullable: false })
  async changeUserEmail(@Arg("email") email: String, @Ctx() context: ApolloContext): Promise<Boolean> {
    const contextUser = context.user;
    if (!contextUser) {
      throw new GraphQLError("Not authenticated", "error.api.authentication.missing", "UNAUTHENTICATED");
    }
    const existingUser = await UserHelper.checkIfUserExists(undefined, email);
    if (existingUser) {
      throw new GraphQLError("User already exists", "error.api.user.exists." + existingUser, "EXISTING_DATA");
    }
    const userId = contextUser.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new GraphQLError("No user found", "error.api.user.not-found", "RESOURCE_NOT_FOUND");
    }
    user.email = email;
    user.save();
    return true;
  }

  @Mutation(() => Boolean, { nullable: false })
  async changeUserPassword(@Arg("password") password: String, @Ctx() context: ApolloContext): Promise<Boolean> {
    const contextUser = context.user;
    if (!contextUser) {
      throw new GraphQLError("Not authenticated", "error.api.authentication.missing", "UNAUTHENTICATED");
    }
    const userId = contextUser.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new GraphQLError("No user found", "error.api.user.not-found", "RESOURCE_NOT_FOUND");
    }
    user.password = password;
    user.save();
    return true;
  }

  @Mutation((_returns) => Boolean, { nullable: false })
  async passwordForgotten(@Arg("loginName") loginName: String): Promise<Boolean> {
    try {
      const user = await UserHelper.getUser(loginName);
      UserHelper.sendPasswordForgottenEmail(user);
      return true;
    } catch (e: unknown) {
      return false;
    }
  }

  @Mutation((_returns) => Boolean, { nullable: false })
  async resetPassword(@Arg("token") token: String, @Arg("password") password: String): Promise<Boolean> {
    const user = await UserModel.findOne({ passwordResetToken: token });
    if (!user) {
      throw new GraphQLError("No user found", "error.api.user.not-found", "RESOURCE_NOT_FOUND");
    }
    user.passwordResetToken = undefined;
    user.password = password;
    user.save();
    return true;
  }
}