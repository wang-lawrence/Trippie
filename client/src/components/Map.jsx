import React, { useEffect, useRef, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const render = (status: Status): ReactElement => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

function MyMapComponent({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral,
  zoom: number,
}) {
  const ref = useRef();

  useEffect(() => {
    new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });
  });

  return <div ref={ref} id="map" className="h-96 w-96" />;
}

export default function Map() {
  const center = { lat: -34.397, lng: 150.644 };
  const zoom = 4;

  return (
    <Wrapper apiKey="AIzaSyB2hMYygS2AnFwCoVEmMApfPdCQ8GKbOdY" render={render}>
      <MyMapComponent center={center} zoom={zoom} />
    </Wrapper>
  );
}
