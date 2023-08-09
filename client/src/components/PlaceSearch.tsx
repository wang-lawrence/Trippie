import {
  Autocomplete,
  useLoadScript,
  LoadScriptProps,
} from '@react-google-maps/api';
import { Label } from './ui/label';
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
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAJmRKjp79AFfguS6Pp50Zy3LSK6N9P0zs',
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
        <Label htmlFor="location">Location</Label>
        <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
          <input
            id="location"
            type="text"
            className={
              'mb-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            }
          />
        </Autocomplete>
      </div>
    </div>
  );
}
