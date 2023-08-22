import { FaPencil, FaRegTrashCan } from 'react-icons/fa6';
import { TripEvents, pinColors } from '../lib/data';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type EventCardsProps = {
  trip: TripEvents[];
  daysCount: number;
  handleDeleteEvent: (evenId: number) => void;
};

export default function EventCards({
  trip,
  daysCount,
  handleDeleteEvent,
}: EventCardsProps) {
  const [activeEventId, setActiveEventId] = useState<number>();

  function handleToggleEvent(selEventId: number) {
    if (selEventId === activeEventId) {
      setActiveEventId(undefined);
    } else {
      setActiveEventId(selEventId);
    }
  }

  const [{ startDate, endDate }] = trip;
  const tripDays = [];
  const startDateLuxon = DateTime.fromISO(new Date(startDate).toISOString());

  // find the events for each day and create header and card for each event
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
              <div className="border flex pl-3 py-1 mb-1 bg-gray-100 rounded-md border border-gray-200 shadow cursor-pointer hover:shadow-md hover:outline hover:outline-slate-200">
                <div className="flex items-center">
                  <div
                    className={`rounded-full w-6 h-6 border border-gray-300 bg-opacity-50`}
                    style={{ background: `#${pinColors[i % 10]}` }}>
                    <p className="text-center">{index + 1}</p>
                  </div>
                </div>
                <div
                  onClick={() => handleToggleEvent(eventId)}
                  className="ml-4 basis-10/12">
                  <h5 className="text-sm">{eventName}</h5>
                  <p className="text-[0.65rem] text-gray-500">{`${startTimeFormatted} - ${endTimeFormatted}`}</p>
                </div>
                <div className="flex items-center w-8">
                  <Link
                    to={`event-form/start/${startDate}/end/${endDate}/${eventId}`}>
                    <FaPencil className="hover:text-xl" />
                  </Link>
                </div>
                <div className="flex items-center w-8">
                  <FaRegTrashCan
                    onClick={() => handleDeleteEvent(eventId)}
                    className="hover:text-xl"
                  />
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
            <li className="text-xs text-gray-400 mb-1">No Scheduled Events</li>
          )}
        </ul>
      </>
    );
  }
  return <div>{tripDays}</div>;
}
