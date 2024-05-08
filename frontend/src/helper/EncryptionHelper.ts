import JSONpack from "jsonpack";
import CryptoJS from "crypto-js";
import hmacSha256 from "crypto-js/hmac-sha256";

const AES_KEY = import.meta.env.VITE_AES_KEY || "norn";

export default class EncryptionHelper {
  public static encrypt<T>(value: T): string {
    // @ts-ignore
    const packed = JSONpack.pack(value);
    const encrypted = CryptoJS.AES.encrypt(packed, AES_KEY).toString();
    return encrypted;
  }

  public static decrypt<T>(value: string): T {
    const decrypted = CryptoJS.AES.decrypt(value, AES_KEY).toString(CryptoJS.enc.Utf8);
    const unpacked = JSONpack.unpack<T>(decrypted);
    return unpacked;
  }
  public static encryptString(value: string): string {
    return CryptoJS.AES.encrypt(value, AES_KEY).toString();
  }

  public static decryptString(value: string): string {
    return CryptoJS.AES.decrypt(value, AES_KEY).toString(CryptoJS.enc.Utf8);
  }

  public static hashString(value: string): string {
    return hmacSha256(value, AES_KEY).toString(CryptoJS.enc.Base64);
  }
}
