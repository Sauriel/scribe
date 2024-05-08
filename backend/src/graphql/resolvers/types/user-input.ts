import { InputType, Field, ID } from "type-graphql";
import { Length, IsEmail, MinLength, IsString, IsNotEmpty, ValidateIf } from "class-validator";
import { User } from "../../entities/user";

@InputType()
export class UserCreateInput implements Partial<User> {
  @Field()
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  username!: String;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email!: String;

  @Field()
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password!: String;
}

@InputType()
export class UserLoginInput implements Partial<User> {
  @Field()
  @IsString()
  @IsNotEmpty()
  loginName!: String;

  @Field()
  @IsString()
  @IsNotEmpty()
  password!: String;
}