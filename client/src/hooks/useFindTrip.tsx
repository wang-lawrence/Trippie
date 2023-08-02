import { useState, useEffect } from 'react';
import { TripEntry, getTrip, placeholder } from '../lib/data';

export default function useFindTrip(userId: number, tripId: number): TripEntry {
  const [trip, setTrip] = useState<TripEntry>(placeholder);

  useEffect(() => {
    async function readTrips(): Promise<void> {
      try {
        const activeTrip = await getTrip(userId, tripId);
        if (activeTrip.length > 0) setTrip(activeTrip[0]);
      } catch (error) {
        console.error('Error getting trips', error);
      }
    }
    readTrips();
  }, [userId, tripId]);

  if (trip.startDate) trip.startDate = new Date(trip.startDate);
  if (trip.endDate) trip.endDate = new Date(trip.endDate);
  return trip;
}
