import { createI18n, LocaleMessages, VueMessageType } from "vue-i18n";
import { messages } from "vite-i18n-resources";

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: import.meta.env.VITE_I18N_LOCALE || "en",
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || "en",
  messages: messages,
});

export default i18n;

/**
 * it's ugly but we can use this to translate strings inside js code
 * @param key
 */
export const translate = (key: string, variables?: Record<string, string>) => {
  if (!key) {
    return "";
  }
  if (variables) {
    return i18n.global.t(key, variables);
  }
  return i18n.global.t(key);
};