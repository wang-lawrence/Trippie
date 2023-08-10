import { FormEvent, useState } from 'react';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Button } from '../components/ui/button';
import PlaceSearch from '../components/PlaceSearch';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GPlace } from '../components/PlaceSearch';
import { DateTime, Interval } from 'luxon';
import { addEvent } from '../lib/data';

type PlaceFields = {
  name: string;
  geometry: {
    location: { lat: () => number; lng: () => number };
    viewport: object;
  };
  website: string;
  formatted_address: string;
  formatted_phone_number: string;
  place_id: string;
  types: string[];
};

export default function EventEntryForm() {
  let { tripId, startDate, endDate } = useParams();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [searchResult, setSearchResult] = useState<GPlace>();
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<Error>();
  const navigate = useNavigate();

  const dateOptions = [];

  if (startDate && endDate) {
    const startDateLuxon = DateTime.fromISO(new Date(startDate).toISOString());
    const endDateLuxon = DateTime.fromISO(new Date(endDate).toISOString());
    const daysCount =
      Interval.fromDateTimes(startDateLuxon, endDateLuxon).length('days') + 1;
    for (let i = 0; i < daysCount; i++) {
      const dateI = startDateLuxon.plus({ days: i });
      dateOptions.push(
        <SelectItem value={`${dateI.toISO()}`} key={i}>
          {`${dateI.toLocaleString()}`}
        </SelectItem>
      );
    }
  }

  function handleSearch(place: GPlace) {
    setSearchResult(place);
    const placeDetails = searchResult?.getPlace() as PlaceFields;
    if (placeDetails && placeDetails.types.length > 1) {
      const { name, formatted_address, formatted_phone_number, website } =
        placeDetails;
      const googleDetails = `\n${name}\n${formatted_address}${
        formatted_phone_number ? '\n' + formatted_phone_number : ''
      }\n${website ?? ''}`;
      setNotes(googleDetails);
    } else {
      setNotes('');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const timeZoneHourOffset =
      DateTime.now().toUTC().hour - DateTime.now().hour;

    const startTimeHrMin = {
      hour: DateTime.fromISO(startTime).hour + timeZoneHourOffset,
      minute: DateTime.fromISO(startTime).minute,
    };

    const endTimeHrMin = {
      hour: DateTime.fromISO(endTime).hour + timeZoneHourOffset,
      minute: DateTime.fromISO(endTime).minute,
    };

    const { name, geometry, place_id } =
      searchResult?.getPlace() as PlaceFields;

    const newEventEntry = {
      userId: 1,
      tripId: Number(tripId),
      eventName,
      eventDate: new Date(eventDate),
      startTime: DateTime.fromISO(eventDate)
        .set(startTimeHrMin)
        .toISO() as string,
      endTime: DateTime.fromISO(eventDate).set(endTimeHrMin).toISO() as string,
      location: name,
      notes,
      placeId: place_id,
      lat: geometry.location.lat(),
      lng: geometry.location.lng(),
    };

    try {
      await addEvent(newEventEntry);
    } catch (error) {
      setError(error as Error);
    } finally {
      navigate(`/trip-details/${tripId}`);
    }
  }

  if (error) return <h1>{`Fetch Error: ${error.message}`}</h1>;

  return (
    <div className="container max-w-2xl bg-white">
      <form>
        <Label htmlFor="eventName">Event Name</Label>
        <Input
          id="eventName"
          type="text"
          placeholder="e.g. Visit the Louvre"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="mb-3"
        />
        <Label htmlFor="eventDate">Event Date</Label>
        <Select onValueChange={setEventDate} value={eventDate}>
          <SelectTrigger className="mb-3">
            <SelectValue placeholder="Select the date" />
          </SelectTrigger>
          <SelectContent id="eventDate">{dateOptions}</SelectContent>
        </Select>
        <div className="flex flex-wrap justify-between mb-3">
          <div className="w-[49%]">
            <Label htmlFor="startTime" className="mt-1">
              Start Time
            </Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="w-[49%]">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <PlaceSearch
          onChange={(place) => handleSearch(place)}
          newPlace={searchResult}
        />
        <Label htmlFor="notes" className="mt-1">
          Notes
        </Label>
        <Textarea
          id="notes"
          placeholder="Type your notes here"
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mb-3"
        />
        <div className="flex justify-center">
          <Link to={`/trip-details/${tripId}`}>
            <Button
              type="button"
              className="roboto w-28 bg-gold text-lg mt-1 mr-2">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            onClick={(e) => handleSubmit(e)}
            className="roboto w-28 bg-gold text-lg mt-1">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
