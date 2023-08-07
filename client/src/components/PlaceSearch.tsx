import React, { useState } from 'react';
import {
  Autocomplete,
  useLoadScript,
  LoadScriptProps,
} from '@react-google-maps/api';
const googleMapsLibraries: LoadScriptProps['libraries'] = ['places'];

type PlaceSearchProps = {
  onChange: (x: GPlace) => void;
  newPlace: GPlace | undefined;
};

export type GPlace = {
  getPlace: () => object;
  [key: string]: any;
};

export default function PlaceSearch({ onChange, newPlace }: PlaceSearchProps) {
  // const [searchResult, setSearchResult] = useState<gPlace>();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB2hMYygS2AnFwCoVEmMApfPdCQ8GKbOdY',
    libraries: googleMapsLibraries,
  });

  function onLoad(autocomplete: GPlace) {
    onChange(autocomplete);
  }

  function onPlaceChanged() {
    if (newPlace !== undefined) {
      console.log(newPlace.getPlace());
      onChange(newPlace);
    } else {
      alert('Please enter text');
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <div id="searchColumn">
        <h2>Location</h2>
        <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
          <input
            type="text"
            className={
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            }
          />
        </Autocomplete>
      </div>
    </div>
  );
}