import CryptoJS from 'crypto-js';
import hmacSha256 from 'crypto-js/hmac-sha256';

export default function () {
  const config = useRuntimeConfig();

  function hashString(value: string): string {
    return hmacSha256(value, config.public.aesKey).toString(CryptoJS.enc.Base64);
  }

  return {
    hashString
  }
}