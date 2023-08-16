import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import UserContext from '../components/UserContext';

type Props = {
  action: 'sign-in' | 'sign-up';
};
export default function AuthPage({ action }: Props) {
  const navigate = useNavigate();
  const { user, handleSignIn } = useContext(UserContext);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const welcomeMessage = action === 'sign-in' ? 'Sign In' : 'Create Account';
  return (
    <div className="bg-img">
      <div className="container roboto">
        <header className="text-center mt-5 lg:mt-8 h-20">
          <h2 className="mb-4 text-3xl font-semibold tracking-wide">
            {welcomeMessage}
          </h2>
        </header>
        <div className="flex justify-center p-3">
          <AuthForm key={action} action={action} onSignIn={handleSignIn} />
        </div>
      </div>
    </div>
  );
}
