import { ObjectType, Field, ID } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { PatreonInformation } from "./patreon-information";

@ObjectType({ description: 'The User model' })
export class User {
  [x: string]: any;
  @Field(() => ID)
  id!: String;

  @Field(() => String)
  @Property({ required: true })
  username!: String;

  @Property()
  isAdmin?: boolean;

  @Field(() => String)
  @Property({ required: true })
  email!: String;

  @Property({ required: true })
  password!: String;

  @Field(() => String)
  accessToken!: String;

  @Field(() => Date)
  accessTokenExpireDate!: Date;

  @Field(() => String, { nullable: true })
  @Property()
  refreshToken?: String;

  @Field(() => Date, { nullable: true })
  @Property()
  refreshTokenExpireDate?: Date;

  @Property()
  emailToken?: String;

  @Property()
  passwordResetToken?: String;

  @Field(() => PatreonInformation, { nullable: true })
  @Property()
  patreon?: PatreonInformation;
}

export const UserModel = getModelForClass(User);

@ObjectType({ description: "The public User model" })
export class PublicUser implements Partial<User> {
  [x: string]: any;
  @Field(() => ID)
  id!: String;

  @Field(() => String)
  username!: String;
}