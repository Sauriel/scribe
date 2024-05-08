const COMBINING = /[\u0300-\u036F]/g;
const SPACE_REGEX = /\s+/g;
const SPACE_REPLACE = "_";

export default class StringHelper {
 public static normalizeForURI(s: string): string {
    return encodeURIComponent(s.normalize("NFKD").replace(COMBINING, "").replace(SPACE_REGEX, SPACE_REPLACE));
  }
}