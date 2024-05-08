import type { User } from '@auth/core/types';

declare type ScribeUser = {
  url: string;
} & User;

export default ScribeUser;