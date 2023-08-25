export type User = {
  firstName: string;
  lastName: string;
  userId: number;
  username: string;
};
export type Auth = {
  user: User;
  token: string;
};

/**
 * Signs in a user.
 */
export async function signIn(
  username: string,
  password: string
): Promise<Auth> {
  return await signUpOrIn('sign-in', username, password);
}

/**
 * Signs up a user.
 */
export async function signUp(
  username: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<User> {
  return await signUpOrIn('sign-up', username, password, firstName, lastName);
}

/**
 * Signs up or signs in depending on the action.
 */
async function signUpOrIn(
  action: 'sign-up',
  username: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<User>;

async function signUpOrIn(
  action: 'sign-in',
  username: string,
  password: string
): Promise<Auth>;

async function signUpOrIn(
  action: 'sign-up' | 'sign-in',
  username: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<User | Auth> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, firstName, lastName }),
  };
  const res = await fetch(`/api/auth/${action}`, req);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`${err.error}`);
  }
  return await res.json();
}
