import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { TripEvents, pinColors } from '../lib/data';
import { DateTime } from 'luxon';

type MapProps = {
  trip: TripEvents[];
  activeMapDays: number[];
  startDate: Date;
};

export default function Map({ trip, activeMapDays, startDate }: MapProps) {
  const latPlaces: number[] = [];
  const lngPlaces: number[] = [];

  const startDateLuxon = DateTime.fromISO(new Date(startDate).toISOString());
  let markers: any[] = [];

  for (let i = 0; i < activeMapDays.length; i++) {
    const dateI = startDateLuxon.plus({ days: activeMapDays[i] });
    const dayEvents = trip.filter(
      ({ startTime }) =>
        new Date(startTime).toLocaleDateString() === dateI.toLocaleString()
    );
    // make the markers and get lat lng to calc center for map
    const dayMarkers = dayEvents.map(({ eventId, lat, lng }, index) => {
      latPlaces.push(lat);
      lngPlaces.push(lng);
      return (
        <MarkerF
          key={eventId}
          position={{ lat, lng }}
          icon={{
            url: `https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=${
              index + 1
            }|${pinColors[activeMapDays[i]]}|000000`,
          }}
        />
      );
    });
    markers = [...markers, ...dayMarkers];
  }

  const latCenter = (Math.max(...latPlaces) + Math.min(...latPlaces)) / 2;
  const lngCenter = (Math.max(...lngPlaces) + Math.min(...lngPlaces)) / 2;
  const center = { lat: latCenter, lng: lngCenter };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAJmRKjp79AFfguS6Pp50Zy3LSK6N9P0zs',
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
      {markers}
    </GoogleMap>
  );
}
