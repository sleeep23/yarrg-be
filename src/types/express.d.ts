import type { AuthenticatedUser } from 'src/auth/authenticated-user.type';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
