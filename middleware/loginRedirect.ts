import { getCurrentScribeUser } from '~~/utils/auth/user';

export default defineNuxtRouteMiddleware(async (to, _from) => {
  try {
    const user = await getCurrentScribeUser();
    if (user && to.name === 'login') {
      return navigateTo({
        path: `/${user.url}/profile`
      });
    }
  } catch (_e) {
    // it's ok if there is no user
  }
})