import { User } from "@/graphql/user/models";
import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from "@apollo/client/core";
import { userStore } from "@/store/user/userStoreModule";

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: import.meta.env.VITE_GRAPHQL_URL,
})

// Cache implementation
const cache = new InMemoryCache()

const authMiddleware = new ApolloLink((operation, forward) => {
  // @ts-ignore
  const user = userStore.state.user as User;
  if (user && user.accessToken !== "") {
    operation.setContext({
      headers: {
        authorization: `Bearer ${user.accessToken}`
      }
    });
  }

  return forward(operation);
})

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache
})