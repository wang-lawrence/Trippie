import { useEffect, useState } from 'react';
import { getEvents, TripEntry } from '../lib/data';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function SavedTrips() {
  const [trips, setTrips] = useState<TripEntry[]>([]);

  useEffect(() => {
    async function readEvents(userId: number): Promise<void> {
      try {
        const userTrips = await getEvents(userId);
        setTrips(userTrips);
      } catch (error) {
        console.error('Error getting events', error);
      }
    }
    readEvents(1);
  }, []);

  return (
    <div className="container">
      {trips.length ? (
        trips.map(({ tripId, tripName, startDate, endDate, iconUrl }) => (
          <SavedTripCard
            key={tripId}
            tripName={tripName}
            startDate={new Date(startDate)}
            endDate={new Date(endDate)}
            iconUrl={iconUrl}
          />
        ))
      ) : (
        <NoTripsMessage />
      )}
    </div>
  );
}

function SavedTripCard({
  tripName,
  startDate,
  endDate,
  iconUrl,
}: Partial<TripEntry>) {
  return (
    <div className="h-24 w-full px-5 mt-4 bg-[#F8F1F1] flex items-center rounded-md border border-gray-200 shadow">
      <div className="h-16 w-16 p-1 rounded-full border border-gray-200 bg-white shadow">
        <img src={iconUrl} alt="travel icon" />
      </div>
      <div className="roboto ml-5">
        <header className="text-lg">{tripName}</header>
        <p className="text-xs md:text-sm text-gray-400">{`${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`}</p>
      </div>
    </div>
  );
}

function NoTripsMessage() {
  return (
    <div className="w-full flex flex-wrap justify-center mt-9 roboto text-center">
      <h1 className="w-full text-xl">There are currently no trips planned</h1>
      <Link to="/trip-form">
        <Button type="button" className="w-48 bg-gold text-lg mt-4">
          Start an Adventure
        </Button>
      </Link>
    </div>
  );
}
