// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used to identify the Request we are extending
import { Request } from 'express';
import { User } from '../../client/src/lib/auth';

declare global {
  namespace Express {
    export interface Request {
      /** `User` object populated by `authMiddleware`. */
      user?: User;
    }
  }
}
