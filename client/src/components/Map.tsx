import { useMemo } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { TripEvents, pinColors } from '../lib/data';
import { DateTime } from 'luxon';

type MapProps = {
  trip: TripEvents[];
  activeMapDays: number[];
  startDate: Date;
};

export default function Map({ trip, activeMapDays, startDate }: MapProps) {
  // const center = useMemo(() => ({ lat: 37.3279997, lng: -119.6493154 }), []); incorporate useMemo later so map doesn't recenter after rerender

  const latPlaces: number[] = [];
  const lngPlaces: number[] = [];

  const startDateLuxon = DateTime.fromISO(new Date(startDate).toISOString());
  let markers: any[] = [];

  console.log(activeMapDays);

  for (let i = 0; i < activeMapDays.length; i++) {
    const dateI = startDateLuxon.plus({ days: activeMapDays[i] });
    const dayEvents = trip.filter(
      ({ startTime }) =>
        new Date(startTime).toLocaleDateString() === dateI.toLocaleString()
    );
    console.log(dayEvents);
    // make the markers and get lat lng to calc center for map
    const dayMarkers = dayEvents.map(({ eventId, lat, lng }, index) => {
      const latNumeric = Number(lat);
      const lngNumeric = Number(lng);
      latPlaces.push(latNumeric);
      lngPlaces.push(lngNumeric);
      return (
        <MarkerF
          key={eventId}
          position={{ lat: latNumeric, lng: lngNumeric }}
          icon={{
            url: `https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=${
              index + 1
            }|${pinColors['color' + i]}|000000`,
          }}
        />
      );
    });
    markers = [...markers, ...dayMarkers];
    console.log('daymarkers:', dayMarkers, 'markers: ', markers);
  }

  const latCenter = (Math.max(...latPlaces) + Math.min(...latPlaces)) / 2;
  const lngCenter = (Math.max(...lngPlaces) + Math.min(...lngPlaces)) / 2;
  const center = { lat: latCenter, lng: lngCenter };
  console.log('center', center);

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
