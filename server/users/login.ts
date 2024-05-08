import type { User } from '@auth/core/types';

export type LoginCredentials = Partial<Record<'email' | 'password' | 'remember', unknown>>;

export type CredentialUser = User | null;

export default async function loginUser(credentials: LoginCredentials, _request: Request): Promise<CredentialUser> {
  const email = credentials.email as string;
  return {
    id: '0',
    email: email,
  };
}