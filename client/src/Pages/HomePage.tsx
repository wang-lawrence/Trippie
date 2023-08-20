import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { signIn } from '../lib/auth';

export default function HomePage() {
  const navigate = useNavigate();

  async function handleGuestSignIn() {
    await signIn('ash', '1234');
    navigate('/saved-trips');
  }

  return (
    <div className="bg-img">
      <div className="container">
        <h1 className=" mt-6 sm:mt-10 font-serif text-white text-2xl text-center">
          Meet the user-friendly app that makes planning your next adventure a
          breeze
        </h1>
        <div className="mt-16 sm:mt-20 flex justify-around">
          <section className="w-1/2 px-2 border-r-2 border-gray-100 flex flex-wrap justify-center tracking-wider">
            <h3 className="w-full roboto text-gray-600 text-xl font-semibold text-center">
              Sign in to Continue
            </h3>
            <Link to="/sign-in">
              <Button type="button" className="bg-gold text-lg mt-8">
                Sign In
              </Button>
            </Link>
          </section>
          <section className="w-1/2 px-4 flex flex-wrap justify-center">
            <h3 className="w-full roboto text-gray-600 text-xl font-semibold text-center tracking-wider">
              Exlpore as Guest
            </h3>
            <Button
              type="button"
              onClick={handleGuestSignIn}
              className="bg-gold text-lg mt-8">
              Demo
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
