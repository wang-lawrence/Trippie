import React, { useState, useRef } from 'react';
import {
  Autocomplete,
  useLoadScript,
  LoadScriptProps,
} from '@react-google-maps/api';
const googleMapsLibraries: LoadScriptProps['libraries'] = ['places'];

export default function PlaceSearch() {
  const [searchResult, setSearchResult] = useState();
  const ref = useRef();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB2hMYygS2AnFwCoVEmMApfPdCQ8GKbOdY',
    libraries: googleMapsLibraries,
  });

  function onLoad(autocomplete) {
    setSearchResult(autocomplete);
    console.log('autocomplete: ', autocomplete);
  }

  function onPlaceChanged() {
    if (searchResult !== undefined) {
      console.log(searchResult.getPlace());
      // const place = searchResult.getPlace();
      // const name = place.name;
      // const status = place.business_status;
      // const formattedAddress = place.formatted_address;
      // // console.log(place);
      // console.log(`Name: ${name}`);
      // console.log(`Business Status: ${status}`);
      // console.log(`Formatted Address: ${formattedAddress}`);
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
            ref={ref}
            type="text"
            placeholder="Search for Tide Information"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
            }}
          />
        </Autocomplete>
      </div>
    </div>
  );
}
