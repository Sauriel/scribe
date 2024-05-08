import { User } from "../graphql/entities/user";
import { Document as GQLDocument } from "../graphql/entities/document";
import { IObjectWithTypegooseFunction } from "@typegoose/typegoose/lib/types";

export declare type DBUser = User & IObjectWithTypegooseFunction;

export declare type DBDocument = GQLDocument & IObjectWithTypegooseFunction;