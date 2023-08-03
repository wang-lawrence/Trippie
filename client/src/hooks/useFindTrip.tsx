import { useState, useEffect } from 'react';
import { TripEntry, fetchTrip, placeholder } from '../lib/data';

type FindTripState = {
  trip?: TripEntry;
  isLoading: boolean;
  error: Error | undefined;
};

export default function useFindTrip(
  userId: number,
  tripId: number
): FindTripState {
  const [trip, setTrip] = useState<TripEntry>(placeholder);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    async function readTrips(): Promise<void> {
      try {
        const activeTrip = await fetchTrip(userId, tripId);
        if (activeTrip.length === 0) {
          throw new Error('Trip not found');
        }
        setTrip(activeTrip[0]);
      } catch (err) {
        setError(err as Error);
      }
    }
    readTrips();
  }, [userId, tripId]);

  return { trip, error, isLoading: !trip && !error };
}
