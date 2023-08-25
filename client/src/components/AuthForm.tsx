import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth, signIn, signUp } from '../lib/auth';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

type Props = {
  action: 'sign-up' | 'sign-in';
  onSignIn: (auth: Auth) => void;
};
export default function AuthForm({ action, onSignIn }: Props) {
  const navigate = useNavigate();
  const [error, setError] = useState<unknown>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    async function handleSignUp(
      username: string,
      password: string,
      firstName: string,
      lastName: string
    ) {
      await signUp(username, password, firstName, lastName);
      navigate('/sign-in');
    }
    async function handleSignIn(username: string, password: string) {
      const auth = await signIn(username, password);
      if (auth.user && auth.token) {
        onSignIn(auth);
        navigate('/saved-trips');
      }
    }
    event.preventDefault();
    if (event.currentTarget === null) throw new Error();
    const formData = new FormData(event.currentTarget);
    const entries = Object.fromEntries(formData.entries());
    const username = entries.username as string;
    const password = entries.password as string;
    const firstName = (entries?.firstName as string) ?? '';
    const lastName = (entries?.lastName as string) ?? '';

    try {
      if (action === 'sign-up') {
        await handleSignUp(username, password, firstName, lastName);
      } else {
        await handleSignIn(username, password);
      }
    } catch (err) {
      setError(err);
    }
  }

  const alternateActionTo = action === 'sign-up' ? '/sign-in' : '/sign-up';
  const alternateActionMsg =
    action === 'sign-up'
      ? 'Already have an account? '
      : "Don't have an account?  ";
  const alternateActionText =
    action === 'sign-up' ? 'Sign in instead' : 'Register now';
  const submitButtonText = action === 'sign-up' ? 'Register' : 'Log In';
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        {action === 'sign-up' && (
          <div className="flex justify-between mb-3">
            <div>
              <Label
                htmlFor="firstName"
                className="font-normal md:text-lg block text-center h-5 md:h-7">
                First Name
              </Label>
              <Input
                id="firstName"
                required
                autoFocus
                type="text"
                name="firstName"
                className="w-[155px]"
              />
            </div>
            <div>
              <Label
                htmlFor="lastName"
                className="font-normal md:text-lg block text-center h-5 md:h-7">
                Last Name
              </Label>
              <Input
                id="lastName"
                required
                autoFocus
                type="text"
                name="lastName"
                className="w-[155px]"
              />
            </div>
          </div>
        )}
        <Label
          htmlFor="username"
          className="text-center font-normal md:text-lg block text-center h-5 md:h-7">
          Username
        </Label>
        <Input
          id="username"
          required
          autoFocus
          type="text"
          name="username"
          className="w-[320px] mx-auto"
        />
      </div>
      <Label
        htmlFor="passwword"
        className="text-center font-normal md:text-lg block text-center h-5 md:h-7">
        Password
      </Label>
      <Input
        id="password"
        required
        type="password"
        name="password"
        className="w-[320px] mx-auto"
      />
      <div className="flex justify-center items-center mt-3">
        <small>
          {alternateActionMsg}
          <Link
            className="text-blue-700 underline active:text-purple-800"
            to={alternateActionTo}>
            {alternateActionText}
          </Link>
        </small>
      </div>
      <div className="flex justify-center mt-5">
        <Button type="submit" className="w-48 bg-gold text-lg">
          {submitButtonText}
        </Button>
      </div>
      <>
        {error && (
          <div style={{ color: 'red' }} className="mt-4 text-center">
            {error instanceof Error ? error.message : 'Unknown Error'}
          </div>
        )}
      </>
    </form>
  );
}
