import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import {
  Popover,
  PopoverContentBelowAnchor,
  PopoverTrigger,
  PopoverClose,
} from '../components/ui/popover';
import { Modal } from '../components/Modal';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import { FaMapLocationDot } from 'react-icons/fa6';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TripEntry, icons, updateTrip, deleteTrip } from '../lib/data';
import useFindTrip from '../hooks/useFindTrip';
import { DateTime, Interval } from 'luxon';

type TripProps = {
  onClick: (trip: TripEntry) => void;
};

export default function TripDetails({ onClick }: TripProps) {
  const [activeIcon, setActiveIcon] = useState('');
  const [err, setError] = useState<Error>();
  const [activeEventId, setActiveEventId] = useState<number | undefined>(1);
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trip, error, isLoading } = useFindTrip(1, Number(tripId));

  useEffect(() => {
    if (trip) setActiveIcon(trip[0].iconUrl);
    if (error) setError(error);
    console.log(trip);
  }, [trip, error]);

  if (isLoading) {
    return <h1>Temporary Loading Page...</h1>;
  }
  if (err || !trip) {
    return <h1>{err?.message}</h1>;
  }

  function handleToggleEvent(selEventId: number) {
    console.log(selEventId);
    if (selEventId === activeEventId) {
      setActiveEventId(undefined);
    } else {
      setActiveEventId(selEventId);
    }
  }

  const [{ tripName, startDate, endDate }] = trip;
  // this is pretty gnarly, will work on making this its own component
  const tripDays = [];
  if (startDate && endDate) {
    const startDateLuxon = DateTime.fromISO(new Date(startDate).toISOString());
    const endDateLuxon = DateTime.fromISO(new Date(endDate).toISOString());
    const daysCount =
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
                  className="border p-2 mb-1 bg-[#F8F1F1] rounded-md border border-gray-200 shadow cursor-pointer hover:shadow-md hover:outline hover:outline-slate-200">
                  <h3>{index + 1 + '. ' + eventName}</h3>
                  <p className="text-xs">{`${startTimeFormatted} - ${endTimeFormatted}`}</p>
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
            <span className="font-semibold">{`Day ${
              i + 1
            } -  ${dateI.toLocaleString({
              ...DateTime.DATE_SHORT,
              weekday: 'long',
            })}`}</span>
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
        <Button className="bg-gold w-1/3 max-w-[120px] mx-7">
          Map <FaMapLocationDot className="ml-2" />
        </Button>
        <Modal onContClick={handleDeleteTrip} deleteName={tripName}>
          <Button className="bg-orange w-1/3 max-w-[120px]">
            Delete <AiOutlineMinusCircle className="ml-2" />
          </Button>
        </Modal>
      </section>
      <section className="flex justify-center">
        <div className="mt-3 max-w-screen-lg w-1/2">{tripDays}</div>
      </section>
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
