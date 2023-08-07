import React, { useState, useEffect } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';
import { GPlace } from '../components/PlaceSearch';

type PlaceFields = {
  name: string;
  geometry: {
    location: { lat: () => number; lng: () => number };
    viewport: object;
  };
  website: string;
};

export default function EventEntryForm() {
  const { startDate, endDate } = useParams();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('1');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [searchResult, setSearchResult] = useState<GPlace>();
  const [notes, setNotes] = useState('');

  console.log('rendered');

  // useEffect(() => {
  //   if (searchResult) {
  //     console.log(
  //       (searchResult.getPlace() as PlaceFields)?.geometry.location.lat()
  //     );
  //   }
  // }, [searchResult]);

  function handleSearch(place: GPlace) {
    setSearchResult(place);
    if (searchResult?.getPlace()) {
      const { name, geometry, website } =
        searchResult.getPlace() as PlaceFields;
      setNotes(`
      name: ${name}
      lat: ${geometry.location.lat()}
      lng: ${geometry.location.lng()}
      website: ${website}`);
      console.log(notes);
    }
  }

  return (
    <div className="container">
      <form>
        <Label htmlFor="eventName">Event Name</Label>
        <Input
          id="eventName"
          type="text"
          placeholder="e.g. Visit the Louvre"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <Label htmlFor="eventDate">Event Date</Label>
        <Select onValueChange={setEventDate} value={eventDate}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select the date" />
          </SelectTrigger>
          <SelectContent id="eventDate">
            <SelectItem value="1">{`${startDate}`}</SelectItem>
            <SelectItem value="2">{`${endDate}`}</SelectItem>
          </SelectContent>
        </Select>
        <Label htmlFor="startTime">Start Time</Label>
        <Input
          id="startTime"
          type="time"
          placeholder="start time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Label htmlFor="endTime">End Time</Label>
        <Input
          id="endTime"
          type="time"
          placeholder="end time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <PlaceSearch
          onChange={(place) => handleSearch(place)}
          newPlace={searchResult}
        />
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Type your notes here"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button
          type="button"
          onClick={() =>
            // console.log(searchResult ? searchResult.getPlace() : 'no place')
            console.log(notes)
          }>
          Log Event Location
        </Button>
      </form>
    </div>
  );
}
