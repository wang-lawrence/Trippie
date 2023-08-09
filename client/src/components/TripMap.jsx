import { useMemo } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

export default function TripMap() {
  const event1 = useMemo(() => ({ lat: 37.3279997, lng: -119.6493154 }), []);
  const event2 = useMemo(() => ({ lat: 37.7384615, lng: -119.5748224 }), []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAJmRKjp79AFfguS6Pp50Zy3LSK6N9P0zs',
  });

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <GoogleMap zoom={10} center={event1} mapContainerClassName="map-container">
      <MarkerF position={event1} />
      <MarkerF
        position={event2}
        icon={{
          url: 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=1|FF0000|000000',
        }}
      />
    </GoogleMap>
  );
}
