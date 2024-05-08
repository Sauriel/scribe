import GithubProvider from '@auth/core/providers/github';
import DiscordProvider from '@auth/core/providers/discord';
import GoogleProvider from '@auth/core/providers/google';
import AppleProvider from '@auth/core/providers/apple';
import FacebookProvider from '@auth/core/providers/facebook';
import TwitterProvider from '@auth/core/providers/twitter';
import TwitchProvider from '@auth/core/providers/twitch';
import CredentialsProvider  from '@auth/core/providers/credentials';
import type { AuthConfig } from '@auth/core/types';
import { NuxtAuthHandler } from '#auth';
import { TypeORMAdapter } from '@auth/typeorm-adapter';
import loginUser from '~~/server/users/login';

// The #auth virtual import comes from this module. You can use it on the client
// and server side, however not every export is universal. For example do not
// use sign-in and sign-out on the server side.

const runtimeConfig = useRuntimeConfig();

// Refer to Auth.js docs for more details
export const authOptions: AuthConfig = {
  secret: runtimeConfig.authJs.secret,
  adapter: TypeORMAdapter({
    type: 'postgres',
    host: runtimeConfig.db.postgres.host,
    port: Number(runtimeConfig.db.postgres.port),
    username: runtimeConfig.db.postgres.username,
    password: runtimeConfig.db.postgres.password,
    database: runtimeConfig.db.postgres.database,
    synchronize: true // should be false in production
  }),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        remember: { label: 'Remember me', type: 'checkbox' },
      },
      authorize(credentials, request) {
        const result = loginUser(credentials, request)
        return result;
      }
    }),
    GithubProvider({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret,
    }),
    DiscordProvider({
      clientId: runtimeConfig.discord.clientId,
      clientSecret: runtimeConfig.discord.clientSecret,
    }),
    GoogleProvider({
      clientId: runtimeConfig.google.clientId,
      clientSecret: runtimeConfig.google.clientSecret,
    }),
    AppleProvider({
      clientId: runtimeConfig.apple.clientId,
      clientSecret: runtimeConfig.apple.clientSecret,
    }),
    FacebookProvider({
      clientId: runtimeConfig.facebook.clientId,
      clientSecret: runtimeConfig.facebook.clientSecret,
    }),
    TwitterProvider({
      clientId: runtimeConfig.twitter.clientId,
      clientSecret: runtimeConfig.twitter.clientSecret,
    }),
    TwitchProvider({
      clientId: runtimeConfig.twitch.clientId,
      clientSecret: runtimeConfig.twitch.clientSecret,
    }),
  ]
};

export default NuxtAuthHandler(authOptions, runtimeConfig);
// If you don't want to pass the full runtime config,
//  you can pass something like this: { public: { authJs: { baseUrl: "" } } }