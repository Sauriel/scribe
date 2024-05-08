import { createI18n } from 'vue-i18n'
// @ts-ignore because there are no types.
import { messages } from 'vite-i18n-resources';

export const I18N = {
  instance: null
};

export default defineNuxtPlugin((nuxtApp) => {
  I18N.instance = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en', // env https://serversideup.net/using-environment-variables-in-nuxt-3/
    fallbackLocale: 'en',
    messages: messages
  });

  nuxtApp.vueApp.use(I18N.instance);
})

if (import.meta.hot) {
  import.meta.hot.on('locales-update', (data) => {
    Object.keys(data).forEach((lang) => {
      I18N.instance.global.setLocaleMessage(lang, data[lang]);
    });
  });
}

export const translate = (key: string, variables?: Record<string, string>) => {
  if (!key) {
    return '';
  }
  if (variables) {
    return I18N.instance.global.t(key, variables);
  }
  return I18N.instance.global.t(key);
};