import type ScribeUser from '~~/models/user/user';

async function getCurrentScribeUser(): Promise<ScribeUser> {
  const { session, status } = useAuth();
  if (status.value === 'authenticated') {
    const user = session.value?.user;
    if (user) {
      return {
        ...user,
        id: '0',
        url: user.name ?? 'unknown'
      }
    }
  }
  throw new Error('There is no current user.')
}

export { getCurrentScribeUser };