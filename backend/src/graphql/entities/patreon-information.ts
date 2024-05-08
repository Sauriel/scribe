import { ObjectType, Field, ID } from "type-graphql";
import { prop as Property, modelOptions, Severity } from "@typegoose/typegoose";

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@ObjectType({ description: 'The UserPatreonInformation model' })
export class PatreonInformation {
  [x: string]: any;
  @Field(() => ID)
  id!: String;

  @Field(() => Date)
  @Property({ required: true })
  checkedOn!: Date;

  @Property({ required: true })
  accessToken!: string;

  @Property({ required: true })
  accessTokenExpires!: Date;

  @Property({ required: true })
  refreshToken!: string;

  @Field(() => String, { nullable: true })
  @Property()
  note?: string;

  @Field(() => String, { nullable: true })
  @Property()
  status?: string;

  @Field(() => String)
  @Property({ required: true })
  email!: string;

  @Field(() => String)
  @Property({ required: true })
  name!: string;

  @Field(() => String, { nullable: true })
  @Property()
  tier?: string;

  @Field(() => String, { nullable: true })
  @Property()
  tierId?: string;

  @Field(() => [String], { nullable: true })
  @Property()
  discord?: string[];
}