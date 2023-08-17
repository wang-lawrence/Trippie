import { User } from '../../client/src/lib/auth';
import ClientError from './client-error.js';

export function validateLoggedIn(user: User | undefined) {
  if (!user) throw new ClientError(401, 'not logged in');
  return user.userId;
}

export function validateUser(userId: number, authUserId: number): void {
  if (userId !== authUserId)
    throw new ClientError(401, 'user not permitted to access data');
}
