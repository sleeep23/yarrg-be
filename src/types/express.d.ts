import type { AuthenticatedUser } from 'src/auth/types/authenticated-user.type';

declare global {
  namespace Express {
    interface User {
      userId: AuthenticatedUser['userId'];
      displayName: AuthenticatedUser['displayName'];
    }
  }
}

export {};
