import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsNumber } from "class-validator";

@InputType()
export class Paging {
  
  @Field(type => Number)
  @IsNumber()
  @IsNotEmpty()
  page!: number;
  
  @Field(type => Number)
  @IsNumber()
  @IsNotEmpty()
  limit!: number;
}