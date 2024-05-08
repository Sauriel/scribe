import { Document } from "./../../entities/document";
import { InputType, Field } from "type-graphql";
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsObject, IsArray } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";
import { Paging } from "./global-inputs";

@InputType()
export class DocumentInput implements Partial<Document> {
  @Field({ nullable: true })
  @IsString()
  id?: String;

  @Field({ nullable: true })
  @IsBoolean()
  private!: boolean;

  @Field()
  @IsString()
  thumb?: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  version!: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Field(type => GraphQLJSONObject)
  @IsObject()
  @IsNotEmpty()
  format!: Object;

  @Field(type => [GraphQLJSONObject])
  @IsArray()
  @IsNotEmpty()
  pages!: Object[];

  @Field(type => GraphQLJSONObject)
  @IsObject()
  @IsNotEmpty()
  defaults!: Object;
}

@InputType()
export class FindAllDocumentsFilter {
  
  @Field(type => String, { nullable: true })
  @IsString()
  searchTerm?: string;
  
  @Field(type => String, { nullable: true })
  @IsString()
  userId?: string;
}

@InputType()
export class FindAllDocumentsInput {
  
  @Field(type => Paging, { nullable: true })
  @IsObject()
  paging?: Paging;
  
  @Field(type => FindAllDocumentsFilter, { nullable: true })
  @IsObject()
  filter?: FindAllDocumentsFilter;
}