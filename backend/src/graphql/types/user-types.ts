import { Field, ObjectType } from "type-graphql";



@ObjectType({ description: 'AccessToken for User' })
export class AccessTokenData {

  @Field(() => String)
  accessToken!: string;

  @Field(() => Date)
  accessTokenExpireDate!: Date;
}