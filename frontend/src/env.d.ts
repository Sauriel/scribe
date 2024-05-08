interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly MODE: "development" | "production";
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly BASE_URL: string;
  readonly PACKAGE_VERSION: string;
  readonly VITE_I18N_LOCALE: string;
  readonly VITE_I18N_FALLBACK_LOCALE: string;
  readonly VITE_AES_KEY: string;
  readonly VITE_GRAPHQL_URL: string;
  readonly VITE_PATREON_CLIENT_ID: string;
  readonly VITE_PATREON_REDIRECT_URL: string;
  readonly VITE_GTAG_ID: string;
  readonly VITE_GFONTS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly hot: any;
}