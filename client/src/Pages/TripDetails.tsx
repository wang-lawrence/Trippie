import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import {
  Popover,
  PopoverContentBelowAnchor,
  PopoverTrigger,
  PopoverClose,
} from '../components/ui/popover';
import { Modal } from '../components/Modal';
import Map from '../components/Map';
import DaysTab from '../components/DaysTab';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import { FaMapLocationDot } from 'react-icons/fa6';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  TripEntry,
  icons,
  updateTrip,
  deleteTrip,
  TripEvents,
  pinColors,
} from '../lib/data';
import useFindTrip from '../hooks/useFindTrip';
import { DateTime, Interval } from 'luxon';

type TripProps = {
  onClick: (trip: TripEntry) => void;
};

export default function TripDetails({ onClick }: TripProps) {
  const [activeIcon, setActiveIcon] = useState('');
  const [err, setError] = useState<Error>();
  const [activeEventId, setActiveEventId] = useState<number | undefined>(
    undefined
  );
  const [activeMapDays, setactiveMapDays] = useState<number[]>([0]);
  const [showMap, setShowMap] = useState(false);
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trip, error, isLoading } = useFindTrip(1, Number(tripId));

  useEffect(() => {
    if (trip) setActiveIcon(trip[0].iconUrl);
    if (error) setError(error);
  }, [trip, error]);

  if (isLoading) {
    return <h1>Temporary Loading Page...</h1>;
  }
  if (err || !trip) {
    return <h1>{err?.message}</h1>;
  }

  function handleToggleEvent(selEventId: number) {
    if (selEventId === activeEventId) {
      setActiveEventId(undefined);
    } else {
      setActiveEventId(selEventId);
    }
  }

  function showMapDay(i: number) {
    const selDays = new Set();
    activeMapDays.map((day) => selDays.add(day));
    if (selDays.has(i)) {
      selDays.delete(i);
    } else {
      selDays.add(i);
    }
    setactiveMapDays(Array.from(selDays) as number[]);
  }

  const [{ tripName, startDate, endDate }] = trip;
  // this is pretty gnarly, will work on making this its own component
  let daysCount = 1;

  const tripDays = [];
  if (startDate && endDate) {
    const startDateLuxon = DateTime.fromISO(new Date(startDate).toISOString());
    const endDateLuxon = DateTime.fromISO(new Date(endDate).toISOString());
    daysCount =
      Interval.fromDateTimes(startDateLuxon, endDateLuxon).length('days') + 1;
    for (let i = 0; i < daysCount; i++) {
      const dateI = startDateLuxon.plus({ days: i });
      const eventCards = trip
        .filter(
          ({ startTime }) =>
            new Date(startTime).toLocaleDateString() === dateI.toLocaleString()
        )
        .map(
          (
            { eventId, eventName, startTime, endTime, location, notes },
            index
          ) => {
            let startTimeFormatted = '';
            let endTimeFormatted = '';
            startTimeFormatted = DateTime.fromISO(startTime).toFormat(
              'h:mm a'
            ) as string;
            endTimeFormatted = DateTime.fromISO(endTime).toFormat(
              'h:mm a'
            ) as string;
            return (
              <li key={eventId}>
                <div
                  onClick={() => handleToggleEvent(eventId)}
                  className="border flex pl-3 py-1 mb-1 bg-gray-100 rounded-md border border-gray-200 shadow cursor-pointer hover:shadow-md hover:outline hover:outline-slate-200">
                  <div className="flex items-center">
                    <div
                      className={`rounded-full w-6 h-6 border border-gray-300 bg-opacity-50`}
                      style={{ background: `#${pinColors[i]}` }}>
                      <p className="text-center">{index + 1}</p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h5 className="text-sm">{eventName}</h5>
                    <p className="text-[0.65rem] text-gray-500">{`${startTimeFormatted} - ${endTimeFormatted}`}</p>
                  </div>
                </div>
                {activeEventId === eventId && (
                  <div className="p-2 -mt-1 mb-2 rounded-b border-l-1 border-r-1 border-b-1 border-gray-200 shadow">
                    <p className="text-xs">{notes}</p>
                  </div>
                )}
              </li>
            );
          }
        );
      tripDays.push(
        <>
          {i !== 0 && <hr className="my-2" />}
          <ul key={i}>
            <span className="font-semibold text-sm">
              {`Day ${i + 1} -
            ${dateI.toLocaleString({
              ...DateTime.DATE_SHORT,
              weekday: 'long',
            })}`}
            </span>
            {eventCards.length > 0 ? (
              eventCards
            ) : (
              <li className="text-xs text-gray-400 mb-1">
                No Scheduled Events
              </li>
            )}
          </ul>
        </>
      );
    }
  }

  const editTrip = {
    ...trip[0],
    startDate: new Date(trip[0].startDate),
    endDate: new Date(trip[0].endDate),
  };

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
        setError(error as Error);
      }
    }
  }

  async function handleDeleteTrip() {
    try {
      await deleteTrip(1, Number(tripId));
    } catch (error) {
      setError(error as Error);
    } finally {
      navigate('/saved-trips');
    }
  }

  return (
    <div className="container roboto bg-white">
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
        <Link to={`event-form/${tripId}/start/${startDate}/end/${endDate}`}>
          <Button className="bg-green w-1/3 max-w-[150px] min-w-[120px]">
            Add Event <AiOutlinePlusCircle className="ml-2" />
          </Button>
        </Link>
        <Button
          onClick={() => setShowMap(!showMap)}
          className="bg-gold w-1/3 max-w-[120px] mx-7">
          Map <FaMapLocationDot className="ml-2" />
        </Button>
        <Modal onContClick={handleDeleteTrip} deleteName={tripName}>
          <Button className="bg-orange w-1/3 max-w-[120px]">
            Delete <AiOutlineMinusCircle className="ml-2" />
          </Button>
        </Modal>
      </section>
      <div className="flex flex-wrap justify-center h-[80vh]">
        <section
          className={`mt-3 px-2 max-w-screen-md overflow-scroll ${
            showMap ? 'h-1/3 w-full sm:h-full sm:w-1/2' : 'w-full sm:w-3/4'
          }`}>
          <div>{tripDays}</div>
        </section>
        {showMap && (
          <section
            className={`mt-3 max-w-screen-lg  flex justify-center flex-wrap w-full sm:w-1/2 ${
              showMap && 'h-2/3 sm:h-full'
            }`}>
            <DaysTab
              activeMapDays={activeMapDays}
              daysCount={daysCount}
              showMapDay={showMapDay}
            />
            <Map
              trip={trip}
              activeMapDays={activeMapDays}
              startDate={startDate}
            />
          </section>
        )}
      </div>
    </div>
  );
}

type IconProps = {
  iconUrl: string;
  onClick: (icon: string) => void;
};

function IconPopover({ iconUrl, onClick }: IconProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="h-16 w-16 p-2 hover:p-1 rounded-full border border-gray-200 bg-white shadow cursor-pointer">
          <img src={iconUrl} alt="travel icon" />
        </div>
      </PopoverTrigger>
      <PopoverContentBelowAnchor className="w-72 pr-0 mr-2">
        <div className="flex flex-wrap pt-1">
          {icons.map((icon, index) => {
            return (
              <PopoverClose key={index}>
                <div
                  onClick={() => onClick(icon)}
                  className="h-14 w-14 p-2 mr-2 mb-2 hover:p-1 rounded-full border border-gray-200 bg-white shadow cursor-pointer">
                  <img src={icon} alt="travel icon" />
                </div>
              </PopoverClose>
            );
          })}
        </div>
      </PopoverContentBelowAnchor>
    </Popover>
  );
}
