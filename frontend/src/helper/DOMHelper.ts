import DOMPurify from "dompurify";

export default class DOMHelper {
  public static sanitize(html: string): string {
    return DOMPurify.sanitize(html);
  }
}
