import type ScribeUser from '~~/models/user/user';
import { getCurrentScribeUser } from '~~/utils/auth/user';

export default function () {
  const user = ref<ScribeUser | null>(null);

  getCurrentScribeUser()
    .then(scribeUser => user.value = scribeUser)
    .catch(_e => {
      // no user (yet)
    });

  return {
    user
  }
}