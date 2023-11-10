import { User } from './users/users.service';

declare module 'express-session' {
  interface SessionData {
    user?: User;
  }
}
