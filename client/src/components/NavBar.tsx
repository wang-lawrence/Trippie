import { Link, NavLink, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from './UserContext';

// use NavLInk in instead of Link to target active tabs to bold in CSS file
export default function NavBar() {
  const { user, handleSignOut } = useContext(UserContext);
  return (
    <>
      <div className="bg-gray-100 py-2">
        <div className="pl-3 md:px-8">
          <nav>
            <Link to="/" className="sansita text-2xl sm:text-3xl">
              Trippie
            </Link>
            <NavLink
              to="/trip-form"
              className="roboto pl-3 sm:pl-5 text-sm sm:text-md font-light">
              New Trip
            </NavLink>
            <NavLink
              to="/saved-trips"
              className="roboto pl-3 sm:pl-5 text-sm sm:text-md font-light">
              Saved Trips
            </NavLink>
            {user ? (
              <NavLink
                to="/sign-in"
                className="roboto pl-3 sm:pl-5 text-sm sm:text-md font-light">
                <span
                  onClick={handleSignOut}
                  className="inline-block align-middle sm:w-full truncate">{`Log Out, ${user.firstName}`}</span>
              </NavLink>
            ) : (
              <NavLink
                to="/sign-in"
                className="roboto pl-3 sm:pl-5 text-sm sm:text-md font-light">
                Sign In/Up
              </NavLink>
            )}
          </nav>
        </div>
      </div>
      <Outlet />
    </>
  );
}
