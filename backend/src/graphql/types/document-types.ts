import { ObjectType, Field, ID } from "type-graphql";
import { UserRights } from "../../helper/rights-helper";
import { Document } from "../entities/document";


@ObjectType({ description: 'The Saved Documents and Rights' })
export class SavedDocuments implements Partial<UserRights> {

  @Field(() => Number)
  documentCount!: number;

  @Field(() => Number)
  maxDocuments!: number;

  @Field(() => Number)
  totalSize!: number;

  @Field(() => Number)
  maxSize!: number;

  @Field(() => Boolean)
  allowPrivate!: boolean;

  @Field(() => [Document])
  documents!: Document[];
}


@ObjectType({ description: 'The Saved Documents' })
export class Documents {

  @Field(() => Number)
  documentCount!: number;

  @Field(() => [Document])
  documents!: Document[];
}