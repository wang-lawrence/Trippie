import { useEffect, useState } from 'react';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';
import TripEntryForm from './Pages/TripEntryForm';
import SavedTrips from './Pages/SavedTrips';
import NotFound from './Pages/NotFound';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route path="trip-form" element={<TripEntryForm />} />
          <Route path="saved-trips" element={<SavedTrips />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
