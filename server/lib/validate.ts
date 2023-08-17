import { User } from '../../client/src/lib/auth';
import ClientError from './client-error.js';

export function validateLoggedIn(user: User | undefined) {
  if (!user) throw new ClientError(401, 'not logged in');
  return user.userId;
}

export function validateParam([...params]): void {
  [...params].map((param) => {
    if (!param) throw new ClientError(400, 'Missing required fields');
    return null;
  });
}
