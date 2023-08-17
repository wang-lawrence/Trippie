import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function RedirectLogIn() {
  return (
    <div className="bg-img">
      <div className="w-full flex flex-wrap justify-center mt-20 roboto text-center">
        <h1 className="w-full text-xl">Please Sign In to Continue</h1>
        <Link to="/sign-in">
          <Button type="button" className="w-48 bg-gold text-lg mt-8">
            Sign In Page
          </Button>
        </Link>
      </div>
    </div>
  );
}
