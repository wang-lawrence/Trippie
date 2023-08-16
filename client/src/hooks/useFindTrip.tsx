import { useState, useEffect } from 'react';
import { TripEvents, fetchTrip, placeholder } from '../lib/data';

type FindTripState = {
  trip?: TripEvents[];
  isLoading: boolean;
  error: Error | undefined;
};

export default function useFindTrip(
  userId: number,
  tripId: number,
  deletedId: number
): FindTripState {
  const [trip, setTrip] = useState<TripEvents[]>([placeholder]);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    async function readTrips(): Promise<void> {
      try {
        const activeTrip = await fetchTrip(tripId);
        if (activeTrip.length === 0) {
          throw new Error('Trip not found');
        }
        setTrip(activeTrip);
      } catch (err) {
        setError(err as Error);
      }
      console.log('use toast here to display deleted event later', deletedId);
    }
    readTrips();
  }, [userId, tripId, deletedId]);

  return { trip, error, isLoading: !trip && !error };
}
