import { useState, useEffect } from 'react';
import { TripEvents, fetchTrip } from '../lib/data';

type FindTripState = {
  trip: TripEvents[] | undefined;
  isLoading: boolean;
  error: unknown;
};

export default function useFindTrip(
  tripId: number,
  deletedId: number
): FindTripState {
  const [trip, setTrip] = useState<TripEvents[]>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function readTrips(): Promise<void> {
      try {
        const activeTrip = await fetchTrip(tripId);
        if (activeTrip.length === 0) {
          throw new Error('Trip not found');
        }
        setTrip(activeTrip);
      } catch (error) {
        setError(error);
      }
    }
    readTrips();
  }, [tripId, deletedId]);

  return { trip, error, isLoading: !trip && !error };
}
