import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Modal } from '../components/Modal';
import Map from '../components/Map';
import DaysTab from '../components/DaysTab';
import EventCards from '../components/EventCards';
import IconPopover from '../components/IconPopover';
import LoadingSpinner from '../components/LoadingSpinner';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import { FaMapLocationDot } from 'react-icons/fa6';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TripEntry, updateTrip, deleteTrip, deleteEvent } from '../lib/data';
import useFindTrip from '../hooks/useFindTrip';
import { DateTime, Interval } from 'luxon';

type TripProps = {
  onClick: (trip: TripEntry) => void;
};

export default function TripDetails({ onClick }: TripProps) {
  const [activeIcon, setActiveIcon] = useState('');
  const [err, setError] = useState<unknown>();
  const [activeMapDays, setActiveMapDays] = useState<number[]>([0]);
  const [showMap, setShowMap] = useState(false);
  const [deletedId, setDeletedId] = useState(0);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trip, error, isLoading } = useFindTrip(Number(tripId), deletedId);

  useEffect(() => {
    if (trip?.[0]) setActiveIcon(trip[0].iconUrl);
    if (error) setError(error);
  }, [trip, error]);

  if (isLoading) {
    return (
      <div className="container bg-white flex justify-center">
        <div className="pt-32">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (err || !trip) {
    return <h1>{err instanceof Error ? err.message : 'Unknown Error'}</h1>;
  }

  function showMapDay(i: number) {
    const selDays = new Set();
    activeMapDays.map((day) => selDays.add(day));
    if (selDays.has(i)) {
      selDays.delete(i);
    } else {
      selDays.add(i);
    }
    setActiveMapDays(Array.from(selDays) as number[]);
  }

  async function handleIconChange(icon: string) {
    setActiveIcon(icon);
    if (editTrip) {
      try {
        await updateTrip({
          ...editTrip,
          userId: 1,
          tripId: Number(tripId),
          iconUrl: icon,
        });
      } catch (error) {
        setError(error);
      }
    }
  }

  async function handleDeleteTrip() {
    try {
      await deleteTrip(Number(tripId));
    } catch (error) {
      setError(error as Error);
    } finally {
      navigate('/saved-trips');
    }
  }
  // only show map loading spinner if map is set to show
  async function handleDeleteEvent(eventId: number) {
    try {
      await deleteEvent(Number(tripId), eventId);
      setDeletedId(eventId);
      if (showMap) {
        setShowMap(!showMap);
        setIsMapLoading(true);
        setTimeout(() => {
          setShowMap(showMap);
          setIsMapLoading(false);
        }, 700);
      }
    } catch (error) {
      setError(error as Error);
    }
  }
  // only need trip info from the first event to populate trip info
  const [{ tripName, startDate, endDate }] = trip;

  const startDateLuxon = DateTime.fromISO(new Date(startDate).toISOString());
  const endDateLuxon = DateTime.fromISO(new Date(endDate).toISOString());
  const daysCount =
    Interval.fromDateTimes(startDateLuxon, endDateLuxon).length('days') + 1;

  const editTrip = {
    ...trip[0],
    startDate: new Date(trip[0].startDate),
    endDate: new Date(trip[0].endDate),
  };

  return (
    <div className="container roboto bg-white flex flex-col">
      <header className="flex justify-center content-center">
        <div
          onClick={() => onClick(editTrip)}
          className="text-center hover:underline cursor-pointer">
          <div className="h-full flex flex-wrap content-center">
            <h1 className="w-full text-xl mb-1 font-semibold tracking-wide">
              {tripName}
            </h1>
            <p className="w-full text-sm text-gray-400">{`${editTrip.startDate.toLocaleDateString()} - ${editTrip.endDate.toLocaleDateString()}`}</p>
          </div>
        </div>
        <IconPopover iconUrl={activeIcon} onClick={handleIconChange} />
      </header>
      <section className="flex justify-center mt-3">
        <Link to={`event-form/start/${startDate}/end/${endDate}/0`}>
          <Button className="bg-green w-1/3 max-w-[150px] min-w-[120px]">
            Add Event <AiOutlinePlusCircle className="ml-2" />
          </Button>
        </Link>
        <Button
          onClick={() => setShowMap(!showMap)}
          className="bg-gold w-1/3 max-w-[120px] mx-2 sm:mx-7">
          Map <FaMapLocationDot className="ml-2" />
        </Button>
        <Modal onContClick={handleDeleteTrip} deleteName={tripName}>
          <Button className="bg-orange w-1/3 max-w-[120px]">
            Delete <AiOutlineMinusCircle className="ml-2" />
          </Button>
        </Modal>
      </section>
      {isMapLoading && (
        <div className="mt-3 mx-auto max-w-screen-lg flex justify-center items-center w-full h-[250px]">
          <LoadingSpinner />
        </div>
      )}
      {!isMapLoading && (
        <div className="flex flex-wrap justify-center h-full sm:h-[70vh]">
          <section
            className={`mt-3 px-2 max-w-screen-md overflow-scroll ${
              showMap
                ? 'h-[30vh] w-full sm:h-full sm:w-1/2'
                : ' h-[70vh] w-full sm:w-3/4'
            }`}>
            <EventCards
              trip={trip}
              daysCount={daysCount}
              handleDeleteEvent={handleDeleteEvent}
            />
          </section>
          {showMap && (
            <section
              className={`mt-3 max-w-screen-lg  flex justify-center flex-wrap w-full sm:w-1/2 h-5/6 sm:h-full}`}>
              <DaysTab
                activeMapDays={activeMapDays}
                daysCount={daysCount}
                toggleMapDay={showMapDay}
              />
              <Map
                trip={trip}
                activeMapDays={activeMapDays}
                startDate={startDate}
              />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
