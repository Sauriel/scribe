import DocumentModel from "@/models/document";
import localforage from "localforage";
import { max, min } from "lodash";

const DOCUMENT_SAVE_KEY = "document-";
const DOCUMENT_NAME_SAVE_KEY_PREFIX = "name_of_";
const DOCUMENT_SAVE_KEY_FIRST_ID = 1;

export interface LocalForageEntry<T> {
  key: string;
  value: T;
}

export default class LocalForageHelper {
  public static async save(document: DocumentModel, existingKey?: string): Promise<string> {
    let key = "";
    let nameKey = "";
    if (!existingKey) {
      const id = await this.getNextFreeIndex();
      key = DOCUMENT_SAVE_KEY + id;
      nameKey = DOCUMENT_NAME_SAVE_KEY_PREFIX + DOCUMENT_SAVE_KEY + id;
    } else {
      key = existingKey;
      nameKey = DOCUMENT_NAME_SAVE_KEY_PREFIX + existingKey;
    }
    await localforage.setItem(key, JSON.stringify(document));
    await localforage.setItem(nameKey, document.name);
    return key;
  }

  public static async delete(key: string): Promise<LocalForageEntry<string>[]> {
    await localforage.removeItem(key);
    await localforage.removeItem(DOCUMENT_NAME_SAVE_KEY_PREFIX + key);
    return this.getAllSavedDocumentNames();
  }

  public static async load(key: string): Promise<DocumentModel> {
    const value = await localforage.getItem(key);
    return JSON.parse(value as string);
  }

  private static async getNextFreeIndex(): Promise<number> {
    const stringKeys = await localforage.keys();
    const keys = stringKeys
      .filter((key) => key.startsWith(DOCUMENT_SAVE_KEY))
      .map((key) => Number.parseInt(key.replace(DOCUMENT_SAVE_KEY, "")));
    if (keys.length === 0) {
      keys.push(DOCUMENT_SAVE_KEY_FIRST_ID);
    }
    const maxNumber = max(keys) || DOCUMENT_SAVE_KEY_FIRST_ID;
    const missingKeys: number[] = [];
    for (let i = 1; i <= maxNumber + 1; i++) {
      if (!keys.includes(i)) {
        missingKeys.push(i);
      }
    }
    return min(missingKeys) || DOCUMENT_SAVE_KEY_FIRST_ID;
  }

  public static async getAllSavedDocumentNames(): Promise<LocalForageEntry<string>[]> {
    const names: LocalForageEntry<string>[] = [];
    await localforage.iterate((value, key) => {
      if (key.startsWith(DOCUMENT_NAME_SAVE_KEY_PREFIX + DOCUMENT_SAVE_KEY)) {
        names.push({
          key: key.replace(DOCUMENT_NAME_SAVE_KEY_PREFIX, ""),
          value: value as string,
        });
      }
    });
    return names;
  }
}
