import { useEffect, useState, useContext } from 'react';
import UserContext from '../components/UserContext';
import { fetchAllTrips, TripEntry } from '../lib/data';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import RedirectLogIn from './RedirectLogIn';

export default function SavedTrips() {
  const [trips, setTrips] = useState<TripEntry[]>([]);
  const [error, setError] = useState<Error>();
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function readTrips(userId: number): Promise<void> {
      try {
        const userTrips = await fetchAllTrips();
        setTrips(userTrips);
      } catch (error) {
        setError(error as Error);
      }
    }
    readTrips(1);
  }, []);

  if (!user) return <RedirectLogIn />;

  if (error) return <h1>{`Fetch error: ${error.message}`}</h1>;

  return (
    <div className="container bg-white">
      {trips.length ? (
        trips.map(({ tripId, tripName, startDate, endDate, iconUrl }) => (
          <TripCard
            key={tripId}
            tripId={tripId}
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

function TripCard({
  tripId,
  tripName,
  startDate,
  endDate,
  iconUrl,
}: Partial<TripEntry>) {
  return (
    <Link to={`trip-details/${tripId}`}>
      <div className="h-24 w-full px-5 mt-4 bg-[#F8F1F1] flex items-center rounded-md border border-gray-200 shadow cursor-pointer hover:shadow-md hover:outline hover:outline-slate-200">
        <div className="h-16 w-16 p-2 rounded-full border border-gray-200 bg-white shadow">
          <img src={iconUrl} alt="travel icon" />
        </div>
        <div className="roboto ml-5">
          <header className="text-lg">{tripName}</header>
          <p className="text-xs md:text-sm text-gray-400">
            {`${startDate?.toLocaleDateString()}
            - ${endDate?.toLocaleDateString()}`}
          </p>
        </div>
      </div>
    </Link>
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
