import { Document, DocumentModel } from "./../entities/document";
import { Resolver, Arg, Mutation, Ctx, Query } from 'type-graphql';
import { UserModel } from '../entities/user';
import GraphQLError from '../graphql-error';
import { ApolloContext } from '../../types/custom';
import { calculateObjectSize } from "bson";
import { DocumentInput, FindAllDocumentsInput } from "./types/document-input";
import RightsHelper from "../../helper/rights-helper";
import { Documents, SavedDocuments } from "../types/document-types";
import { DBDocument } from "../../models";

@Resolver()
export class DocumentResolver {

  @Query((_returns) => SavedDocuments, { nullable: false })
  async doc_list(@Ctx() context: ApolloContext): Promise<SavedDocuments> {
    const contextUser = context.user;
    if (!contextUser) {
      throw new GraphQLError("Not authenticated", "error.api.authentication.missing", "UNAUTHENTICATED");
    }
    const userId = contextUser.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new GraphQLError("No user found", "error.api.user.not-found", "RESOURCE_NOT_FOUND");
    }
    const rights = RightsHelper.getRights(user);
    const userDocuments = await DocumentModel.find({ user: user });
    const documentSizes = userDocuments.map(doc => doc.size).reduce((previous, current) => previous + current, 0);
    return {
      allowPrivate: rights.allowPrivate,
      maxDocuments: rights.maxDocuments,
      maxSize: rights.maxSize,
      documentCount: userDocuments.length,
      totalSize: documentSizes,
      documents: userDocuments
    };
  }

  @Query((_returns) => Document, { nullable: false })
  async doc_find(@Arg("id") id: string, @Ctx() context: ApolloContext): Promise<Document> {
    const document = await DocumentModel.findById(id).populate("user");
    if (!document) {
      throw new GraphQLError("Could not find document", "error.api.document.not-found", "RESOURCE_NOT_FOUND");
    }
    const contextUser = context.user;
    if (document.private && document.user?.id !== contextUser?.userId) {
      throw new GraphQLError("Could not find document", "error.api.document.not-found", "RESOURCE_NOT_FOUND");
    }
    return document;
  }

  @Mutation(() => Document, { nullable: false })
  async doc_save(@Arg("input") input: DocumentInput, @Ctx() context: ApolloContext): Promise<Document> {
    const contextUser = context.user;
    if (!contextUser) {
      throw new GraphQLError("Not authenticated", "error.api.authentication.missing", "UNAUTHENTICATED");
    }
    const userId = contextUser.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new GraphQLError("No user found", "error.api.user.not-found", "RESOURCE_NOT_FOUND");
    }
    const rights = RightsHelper.getRights(user);
    const userDocuments = await DocumentModel.find({ user: user });
    const numberOfDocuments = userDocuments.length;
    if (!input.id && numberOfDocuments >= rights.maxDocuments) {
      throw new GraphQLError("Document quote exceeded", "error.api.document.quota.exceeded", "FORBIDDEN");
    }
    const documentSizes = userDocuments.map(doc => doc.size).reduce((previous, current) => previous + current, 0);
    const byteSize = calculateObjectSize(input);
    if (documentSizes + byteSize >= rights.maxSize) {
      throw new GraphQLError("File size is to much", "error.api.document.file-size.exceeded", "FORBIDDEN");
    }
    if (input.private && !rights.allowPrivate) {
      throw new GraphQLError("Saving a private document is not allowed", "error.api.document.private.forbidden", "FORBIDDEN");
    }
    if (input.id) {
      const document = await DocumentModel.findById(input.id).populate("user") as DBDocument;
      if (!document) {
        throw new GraphQLError("Could not find document", "error.api.document.not-found", "RESOURCE_NOT_FOUND");
      }
      if (!document.user?.equals(user._id)) {
        throw new GraphQLError("Wrong user for document", "error.api.document.wrong-user", "FORBIDDEN");
      }
      document.private = input.private;
      document.thumb = input.thumb;
      document.version = input.version;
      document.name = input.name;
      document.format = input.format;
      document.pages = input.pages;
      document.defaults = input.defaults;
      document.pageCount = input.pages.length;
      document.setting = (input.defaults as any).setting;
      document.size = byteSize;
      return document.save();
    }
    const doc: Document = {
      id: "",
      ...input,
      user: user,
      private: !!input.private,
      pageCount: input.pages.length,
      setting: (input.defaults as any).setting,
      size: byteSize
    };
    return await (await DocumentModel.create(doc)).save();
  }

  @Mutation(() => Boolean, { nullable: false })
  async doc_delete(@Arg("id") id: string, @Ctx() context: ApolloContext): Promise<boolean> {
    const contextUser = context.user;
    if (!contextUser) {
      throw new GraphQLError("Not authenticated", "error.api.authentication.missing", "UNAUTHENTICATED");
    }
    const userId = contextUser.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new GraphQLError("No user found", "error.api.user.not-found", "RESOURCE_NOT_FOUND");
    }
    const document = await DocumentModel.findById(id);
    if (!document) {
      throw new GraphQLError("Could not find document", "error.api.document.not-found", "RESOURCE_NOT_FOUND");
    }
    await document.remove();
    return true;
  }

  @Query((_returns) => Documents, { nullable: false })
  async doc_findAll(@Arg("input", { nullable: true }) input?: FindAllDocumentsInput): Promise<Documents> {
    const count = await DocumentModel.count({ private: false });
    const paging = input?.paging ? {
      skip: input.paging.limit * (input.paging.page - 1),
      limit: input.paging.limit,
      sort: "name"
    } : undefined;
    const result = await DocumentModel.find({ private: false }, undefined, paging).populate("user");
    const documents: Documents = {
      documentCount: count,
      documents: result
    };
    return documents;
  }
}