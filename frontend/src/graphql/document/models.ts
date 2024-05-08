import DocumentModel from "@/models/document";
import { Paging } from "../models";

export interface PublicUser {
  id: string;
  username: string;
}

export interface DocumentInput extends DocumentModel {
  id?: string;
  private?: boolean;
  thumb?: string;
}

export interface DocSaveMutation {
  doc_save: Document;
}

export interface Document extends DocumentModel {
  id: string;
  private: boolean;
  setting: DocumentSetting;
  user: PublicUser;
  size: number;
  pageCount: number;
  thumb?: string;
}

export enum DocumentSetting {
  DUNGEONS_AND_DRAGONS = "dandd"
}

export interface DocListQuery {
  doc_list: SavedDocuments;
}

export interface SavedDocuments {
  allowPrivate: boolean;
  documentCount: number;
  maxDocuments: number;
  totalSize: number;
  maxSize: number;
  documents: Document[];
}

export interface DocDeleteMutation {
  doc_delete: boolean;
}

export interface DocFindQuery {
  doc_find: Document;
}

export interface DocFindAllQuery {
  doc_findAll: Documents;
}

export interface Documents {
  documentCount: number;
  documents: Document[];
}

export interface FindAllDocumentsInput {
  paging?: Paging;
  filter?: FindAllDocumentsFilter;
}

export interface FindAllDocumentsFilter {
  searchTerm?: string;
  userId?: string;
}