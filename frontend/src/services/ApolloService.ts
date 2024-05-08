import { GetTokenQuery } from "./../graphql/user/models";
import { UserStoreGetters } from "./../store/user/userStoreGetters";
import { useMutation, useQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/apollo";
import VuexHelper from "@/helper/VuexHelper";
import { USER_STORE_NAMESPACE } from "@/store/user/userStoreModule";
import { User } from "@/graphql/user/models";
import isAfter from "date-fns/isAfter";
import parseISO from "date-fns/parseISO";
import getTokenSchema from "@/graphql/user/getToken.gql";

provideApolloClient(apolloClient);

const userStore = VuexHelper.createNamespace(USER_STORE_NAMESPACE);
export default class ApolloService {
  public async query<T>(schema: any, variables: Record<string, any> = {}, noCache = false): Promise<T> {
    await this.checkAccessTokenValidity();
    const { onResult, onError } = useQuery(schema, variables, { fetchPolicy: noCache ? "no-cache" : undefined, errorPolicy: "all" });
    return new Promise((resolve, reject) => {
      onResult(queryResult => {
        if (queryResult.data) {
          resolve(queryResult.data);
        } else {
          reject(queryResult.errors || "BACKEND_ERROR");
        }
      });
      onError(error => {
        reject(error);
      });
    });
  }

  public async mutation<T>(schema: any, variables: Record<string, any> = {}, noCache = false): Promise<T> {
    await this.checkAccessTokenValidity();
    const { mutate: executeMutation, onDone, onError } = useMutation(schema, { fetchPolicy: noCache ? "no-cache" : undefined, errorPolicy: "all" });
    executeMutation(variables);
    return new Promise((resolve, reject) => {
      onDone(mutationResult => {
        if (mutationResult.data) {
          resolve(mutationResult.data);
        } else {
          reject(mutationResult.errors || "BACKEND_ERROR");
        }
      });
      onError(error => {
        reject(error);
      });
    });
  }

  private async checkAccessTokenValidity() {
    const user = userStore.getters<User>(UserStoreGetters.USER);
    if (user) {
      const now = new Date();
      const accessTokenExpireDate = parseISO(user.accessTokenExpireDate);
      if (isAfter(now, accessTokenExpireDate)) {
        user.accessToken = "";
        user.accessTokenExpireDate = "";
        const variables = {
          refreshToken: user.refreshToken,
          userId: user.id
        };
        const { onResult, onError } = useQuery(getTokenSchema, variables, { fetchPolicy:  "no-cache", errorPolicy: "all" });
        const result: GetTokenQuery = await new Promise((resolve, reject) => {
          onResult(queryResult => {
            if (queryResult.data) {
              resolve(queryResult.data);
            } else {
              reject(queryResult.errors || "BACKEND_ERROR");
            }
          });
          onError(error => {
            reject(error);
          });
        });
        user.accessToken = result.getToken.accessToken;
        user.accessTokenExpireDate = result.getToken.accessTokenExpireDate;
      }
    }
  }
}

export const APOLLO_SERVICE = "apolloService";
export const apolloService = new ApolloService();
