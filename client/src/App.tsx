import { useState } from 'react';
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UserContext from './components/UserContext';
import { Auth, User } from './lib/auth';
import './App.css';
import NavBar from './components/NavBar';
import TripEntryForm from './Pages/TripEntryForm';
import SavedTrips from './Pages/SavedTrips';
import TripDetails from './Pages/TripDetails';
import TripEditForm from './Pages/TripEditForm';
import EventEntryForm from './Pages/EventEntryForm';
import AuthPage from './Pages/AuthPage';
import NotFound from './Pages/NotFound';
import { placeholder, TripEntry, TripEvents } from './lib/data';

const tokenKey = 'react-context-jwt';

function App() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [editTrip, setEditTrip] = useState<Partial<TripEvents>>(placeholder);
  const navigate = useNavigate();

  function handleSignIn(auth: Auth) {
    sessionStorage.setItem(tokenKey, JSON.stringify(auth));
    setUser(auth.user);
    setToken(auth.token);
  }

  function handleSignOut() {
    sessionStorage.removeItem(tokenKey);
    setUser(undefined);
    setToken(undefined);
  }

  const contextValue = { user, token, handleSignIn, handleSignOut };

  function handleEditTripSubmit(trip: TripEntry) {
    setEditTrip(trip);
    navigate(`trip-form/${trip.tripId}`);
  }
  return (
    <div>
      <UserContext.Provider value={contextValue}>
        <Routes>
          <Route path="/" element={<NavBar />}>
            {/*replace with a home page once that's desgined*/}
            <Route index element={<TripEntryForm />} />
            <Route path="trip-form" element={<TripEntryForm />} />
            <Route
              path="trip-form/:tripId"
              element={<TripEditForm editTrip={editTrip} />}
            />
            <Route path="saved-trips" element={<SavedTrips />} />
            <Route path="sign-up" element={<AuthPage action="sign-up" />} />
            <Route
              path="trip-details/:tripId"
              element={<TripDetails onClick={handleEditTripSubmit} />}
            />
            <Route
              path="trip-details/:tripId/event-form/start/:startDate/end/:endDate/:eventId"
              element={<EventEntryForm />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
