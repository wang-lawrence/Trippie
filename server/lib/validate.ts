import { User } from '../../client/src/lib/auth';
import ClientError from './client-error.js';

export function validateUser(user: User | undefined) {
  if (!user) throw new ClientError(401, 'not logged in');
  return user.userId;
}
