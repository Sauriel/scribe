import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import { prop as Property, getModelForClass, modelOptions, Severity, Ref } from "@typegoose/typegoose";
import { GraphQLJSONObject } from "graphql-type-json";
import { PublicUser, User } from "./user";

export enum DocumentSetting {
  DUNGEONS_AND_DRAGONS = "dandd"
}

registerEnumType(DocumentSetting, {
  name: "DocumentSetting",
  description: "The setting of this document."
});

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@ObjectType({ description: 'The Scribe Document' })
export class Document {
  [x: string]: any;
  @Field(() => ID)
  id!: String;

  @Field(type => DocumentSetting)
  @Property({ required: true })
  setting!: DocumentSetting;

  @Field(() => PublicUser)
  @Property({ required: true, ref: () => User })
  user!: Ref<User>;

  @Field(() => Number)
  @Property({ required: true })
  size!: number;

  @Field(() => String)
  @Property({ required: false })
  thumb?: string;

  @Field(() => Number)
  @Property({ required: true })
  version!: number;

  @Field(() => Boolean)
  @Property({ required: true })
  private!: boolean;

  @Field(() => String)
  @Property({ required: true })
  name!: string;

  @Field(() => GraphQLJSONObject)
  @Property({ required: true })
  format!: Object;

  @Field(() => [GraphQLJSONObject])
  @Property({ required: true })
  pages!: Object[];

  @Field(() => Number)
  @Property({ required: true })
  pageCount!: number;
  
  @Field(() => GraphQLJSONObject)
  @Property({ required: true })
  defaults!: Object;
}

export const DocumentModel = getModelForClass(Document);