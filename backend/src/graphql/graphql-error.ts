import { ApolloError } from "apollo-server-core";

declare type ErrorCode = "GRAPHQL_PARSE_FAILED" | "GRAPHQL_VALIDATION_FAILED" | "BAD_USER_INPUT" | "UNAUTHENTICATED" | "FORBIDDEN" | "PERSISTED_QUERY_NOT_FOUND" | "PERSISTED_QUERY_NOT_SUPPORTED" | "INTERNAL_SERVER_ERROR" | "RESOURCE_NOT_FOUND" | "INVALID_DATA" | "EXISTING_DATA";

export default class GraphQLError extends ApolloError {
  constructor(message: string, messageKey: string, errorCode: ErrorCode = "INTERNAL_SERVER_ERROR") {
    const extensions: Record<string, any> = {
      messageKey: messageKey
    };
    super(message, errorCode, extensions);
  }
}