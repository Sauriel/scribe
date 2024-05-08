declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      EXPRESS_PORT: number;
      JWT_SECRET: string;
      JWT_REFRESH_TOKEN_EXPIRATION: number;
      ACCESS_CONTROL_ALLOW_ORIGIN: string;
      ACCESS_CONTROL_ALLOW_METHODS: string;
      ACCESS_CONTROL_ALLOW_HEADERS: string;
      MONGO_SERVER: string;
      MONGO_PORT: number;
      MONGO_USER: string;
      MONGO_PASSWORD: string;
      MONGO_DEFAULT_DATABASE: string;
      BASE_URL: string;
      FRONTEND_URL: string;
      PATREON_CLIENT_ID: string;
      PATREON_CLIENT_SECRET: string;
      PATREON_REDIRECT_URL: string;
      SSL_PRIVATE_KEY_LOCATION: string;
      SSL_CERT_LOCATION: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}