import AppDocument from "@/importer/norn/models/AppDocument";
import NornImporter from "@/importer/norn/NornImporter";
import DocumentModel from "@/models/document";

export default class ImportHelper {
  public static importNornDocument(json: string): DocumentModel | null {
    return new NornImporter(this.parseJson<AppDocument>(json)).convert();
  }

  private static parseJson<T>(json: string): T {
    const fixedJson = json
      .replace(/\x19/g, "'")
      .replace(/[\x00-\x1F\x7F]/g, "#")
      .replace(/[\x11-\x14]/g, "#")
      .replace(/\\\">\"/g, '\\">');
    const object: T = JSON.parse(fixedJson);
    return object;
  }
}
