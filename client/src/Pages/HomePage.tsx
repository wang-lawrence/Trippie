import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { signIn } from '../lib/auth';
import UserContext from '../components/UserContext';
import { useContext } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, handleSignIn, handleSignOut } = useContext(UserContext);

  function handleUserClick() {
    if (user) {
      handleSignOut();
    } else {
      navigate('/sign-in');
    }
  }

  async function handleGuestSignIn() {
    if (user) {
      handleSignOut();
    } else {
      const auth = await signIn('Guest', '1234');
      if (auth.user && auth.token) {
        handleSignIn(auth);
        navigate('/saved-trips');
      }
    }
  }

  return (
    <div className="bg-img">
      <div className="container">
        <h1 className="mt-6 sm:mt-10 font-serif text-white text-2xl text-center intro">
          Meet the user-friendly app that makes planning your next adventure a
          breeze
        </h1>
        <div className="max-w-lg mx-auto mt-16 sm:mt-20 flex justify-around hp-login">
          <section className="w-1/2 px-2 border-r-2 border-gray-100 flex flex-wrap justify-center tracking-wider">
            <h3 className="w-full h-10 roboto text-gray-600 text-xl font-semibold text-center">
              User Sign In
            </h3>
            <Link to={user ? '/' : '/sign-in'}>
              <Button
                type="button"
                onClick={handleUserClick}
                className="bg-gold text-lg mt-8">
                {user ? 'Log Out' : 'Sign In'}
              </Button>
            </Link>
          </section>
          <section className="w-1/2 pl-2 flex flex-wrap justify-center">
            <h3 className="w-full h-10 roboto text-gray-600 text-xl font-semibold text-center tracking-wider">
              Explore as Guest
            </h3>
            <Button
              type="button"
              onClick={handleGuestSignIn}
              className="bg-gold text-lg mt-8">
              {user ? 'Log out' : 'Continue'}
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
