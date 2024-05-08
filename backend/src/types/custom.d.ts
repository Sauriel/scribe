import { Request, User } from "express";

export interface RequestError extends Error{
  statusCode?: number;
  data?: any;
}

export interface ApolloContext {
  req: Request;
  user?: User;
}