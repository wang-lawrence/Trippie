import { useState } from 'react';
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import TripEntryForm from './Pages/TripEntryForm';
import SavedTrips from './Pages/SavedTrips';
import TripDetails from './Pages/TripDetails';
import TripEditForm from './Pages/TripEditForm';
import EventEntryForm from './Pages/EventEntryForm';
import TripMap from './components/TripMap';
import NotFound from './Pages/NotFound';
import { placeholder, TripEntry, TripEvents } from './lib/data';

function App() {
  const [editTrip, setEditTrip] = useState<Partial<TripEvents>>(placeholder);
  const navigate = useNavigate();

  function handleEditTripSubmit(trip: TripEntry) {
    setEditTrip(trip);
    navigate(`trip-form/${trip.tripId}`);
  }
  return (
    <div>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<TripMap />} />
          <Route path="trip-form" element={<TripEntryForm />} />
          <Route
            path="trip-form/:tripId"
            element={<TripEditForm editTrip={editTrip} />}
          />
          <Route path="saved-trips" element={<SavedTrips />} />
          <Route
            path="trip-details/:tripId"
            element={<TripDetails onClick={handleEditTripSubmit} />}
          />
          <Route
            path="trip-details/:tripId/event-form/:tripId/start/:startDate/end/:endDate"
            element={<EventEntryForm />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
