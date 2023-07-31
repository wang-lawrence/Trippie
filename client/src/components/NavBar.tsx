import { Link, Outlet } from 'react-router-dom';

export default function NavBar() {
  return (
    <>
      <div className="bg-gray-100 py-3">
        <div className="container">
          <nav>
            <a href="" className="sansita text-3xl">
              <Link to="/">Trippie</Link>
            </a>
            <a href="" className="roboto pl-5 text-md font-light">
              <Link to="/trip-form">New Trip</Link>
            </a>
            <a href="" className="roboto pl-5 text-md font-light">
              <Link to="/saved-trips">Saved Trips</Link>
            </a>
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
