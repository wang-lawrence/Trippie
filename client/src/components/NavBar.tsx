import { Link, Outlet } from 'react-router-dom';

export default function NavBar() {
  return (
    <>
      <div className="bg-gray-100 py-3">
        <div className="pl-3 md:px-8">
          <nav>
            <Link to="/" className="sansita text-3xl">
              Trippie
            </Link>
            <Link to="/trip-form" className="roboto pl-5 text-md font-light">
              New Trip
            </Link>
            <Link to="/saved-trips" className="roboto pl-5 text-md font-light">
              Saved Trips
            </Link>
            <a href="" className="roboto pl-5 text-md font-light">
              Log In
            </a>
          </nav>
        </div>
      </div>
      <Outlet />
    </>
  );
}
