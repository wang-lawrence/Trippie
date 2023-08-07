import { useRef, useEffect } from 'react';
import { useLoadScript, LoadScriptProps } from '@react-google-maps/api';

const googleMapsLibraries: LoadScriptProps['libraries'] = ['places'];

const AutoComplete = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB2hMYygS2AnFwCoVEmMApfPdCQ8GKbOdY',
    libraries: googleMapsLibraries,
  });

  const autoCompleteRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    try {
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current
      );
      autoCompleteRef.current.addListener('place_changed', async function () {
        const place = await autoCompleteRef.current.getPlace();
        console.log(
          'lat: ',
          place.geometry.location.lat(),
          ' lng: ',
          place.geometry.location.lng()
        );
        console.log(autoCompleteRef.current);
      });
    } catch (error) {}
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <label>enter address :</label>
      <input ref={inputRef} />
    </div>
  );
};
export default AutoComplete;
