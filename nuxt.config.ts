import i18nResources from 'vite-plugin-i18n-resources';
import { resolve } from 'path';

const isDev = process.env.NODE_ENV !== 'production';

export default defineNuxtConfig({
  modules: [
    'nuxt-font-metrics',
    '@pinia/nuxt',
    'nuxt-icon',
    'nuxt-security',
    'nuxt-lodash',
    '@hebilicious/authjs-nuxt',
  ],

  typescript: {
    shim: false
  },

  css: [
    '@/styles/global.css',
  ],

  vite: {
    plugins: [
      i18nResources({
        path: resolve(__dirname, 'locales'),
      }),
    ],
  },

  build: {
    transpile: []
  },

  app: {
    head: {
      title: 'Scribe - Tabletop Publisher',
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        }
      ]
    }
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy: {
        value: 'unsafe-none', // because webworker doesn't seem to work with the default of 'require-corp'
        route: '/**'
      },
      contentSecurityPolicy: {
        'img-src': [process.env.BASE_URL ?? '', 'https://authjs.dev']
      }
    }
  },

  runtimeConfig: {
    authJs: {
      secret: process.env.AUTH_JS_SECRET,
    },
    github: {
      clientId: process.env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
    },
    discord: {
      clientId: process.env.AUTH_DISCORD_CLIENT_ID,
      clientSecret: process.env.AUTH_DISCORD_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    },
    apple: {
      clientId: process.env.AUTH_APPLE_CLIENT_ID,
      clientSecret: process.env.AUTH_APPLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: process.env.AUTH_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET,
    },
    twitter: {
      clientId: process.env.AUTH_TWITTER_CLIENT_ID,
      clientSecret: process.env.AUTH_TWITTER_CLIENT_SECRET,
    },
    twitch: {
      clientId: process.env.AUTH_TWITCH_CLIENT_ID,
      clientSecret: process.env.AUTH_TWITCH_CLIENT_SECRET,
    },
    db: {
      postgres: {
        host: process.env.DB_POSTGRES_HOST,
        port: process.env.DB_POSTGRES_PORT,
        username: process.env.DB_POSTGRES_USERNAME,
        password: process.env.DB_POSTGRES_PASSWORD,
        database: process.env.DB_POSTGRES_DATABASE,
      }
    },
    public: {
      aesKey: process.env.NUXT_PUBLIC_AES_KEY,
      apiKeys: {
        googleFonts: process.env.GOOGLES_FONT_API_KEY,
      },
      authJs: {
        baseUrl: process.env.BASE_URL, // The base URL is used for the Origin Check in prod only
        verifyClientOnEveryRequest: true // whether to hit the /auth/session endpoint on every client request
      }
    },
  },

  nitro: {
    preset: 'node'
  },

  devtools: {
    enabled: true
  },

  //  authJs: {
  //    verifyClientOnEveryRequest: true,
  //    guestRedirectTo: "/",
  //    baseUr
  //  },

  alias: {
    'cookie': resolve(__dirname, 'node_modules/cookie'),
    'jose': resolve(__dirname, 'node_modules/jose/dist/browser/index.js'),
    '@panva/hkdf': resolve(__dirname, 'node_modules/@panva/hkdf/dist/web/index.js')
  },
});
