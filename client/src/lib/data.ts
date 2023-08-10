export const icons = [
  '/images/travel-vector-free-icon-set-21.png',
  '/images/travel-vector-free-icon-set-22.png',
  '/images/travel-vector-free-icon-set-23.png',
  '/images/travel-vector-free-icon-set-24.png',
  '/images/travel-vector-free-icon-set-25.png',
  '/images/travel-vector-free-icon-set-26.png',
  '/images/travel-vector-free-icon-set-27.png',
  '/images/travel-vector-free-icon-set-28.png',
  '/images/travel-vector-free-icon-set-29.png',
  '/images/travel-vector-free-icon-set-30.png',
  '/images/travel-vector-free-icon-set-31.png',
  '/images/travel-vector-free-icon-set-32.png',
  '/images/travel-vector-free-icon-set-33.png',
  '/images/travel-vector-free-icon-set-34.png',
  '/images/travel-vector-free-icon-set-35.png',
  '/images/travel-vector-free-icon-set-36.png',
  '/images/travel-vector-free-icon-set-37.png',
  '/images/travel-vector-free-icon-set-38.png',
  '/images/travel-vector-free-icon-set-39.png',
  '/images/travel-vector-free-icon-set-40.png',
];

type Colors = {
  [key: string]: string;
};

export const pinColors: Colors = {
  color0: 'FF0000', // red
  color1: '00FFFF', // cyan
  color2: 'FFFF00', // yellow
  color3: 'FFFFFF', // white
  color4: 'F0F8FF', // AliceBlue
  color5: 'FF7F50', // Coral
  color6: 'FF69B4', // HotPink
};

export type TripEntry = {
  tripId: number;
  userId: number;
  tripName: string;
  startDate: Date;
  endDate: Date;
  iconUrl: string;
};

export type EventEntry = {
  userId: number;
  tripId: number;
  eventId: number;
  eventName: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
  placeId: string;
  lat: number;
  lng: number;
};

export type TripEvents = TripEntry & EventEntry;

export const placeholder: TripEvents = {
  tripId: 1,
  userId: 1,
  eventId: 1,
  tripName: '',
  startDate: new Date(),
  endDate: new Date(),
  iconUrl: 'placeholder-image',
  eventName: '',
  eventDate: new Date(),
  startTime: '',
  endTime: '',
  location: '',
  notes: '',
  placeId: '',
  lat: 0,
  lng: 0,
};

export async function fetchAllTrips(userId: number): Promise<TripEntry[]> {
  const res = await fetch(`/api/user/${userId}/trips`);
  if (!res.ok) {
    throw new Error(`Error status ${res.status}`);
  }
  return await res.json();
}

export async function fetchTrip(
  userId: number,
  tripId: number
): Promise<TripEvents[]> {
  const res = await fetch(`/api/user/${userId}/trip/${tripId}`);
  if (!res.ok) {
    throw new Error(`Error status ${res.status}`);
  }
  const trip = await res.json();
  // trip[0].startDate = new Date(trip[0].startDate);
  // trip[0].endDate = new Date(trip[0].endDate);
  return trip;
}

export async function addTrip(
  newTrip: Partial<TripEntry>
): Promise<TripEntry[]> {
  const reqConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTrip),
  };
  const res = await fetch('/api/trip', reqConfig);
  if (!res.ok) {
    throw new Error(`Error status ${res.status}`);
  }
  return await res.json();
}

export async function updateTrip(
  editTrip: Partial<TripEntry>
): Promise<TripEntry[]> {
  const reqConfig = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editTrip),
  };
  const res = await fetch(
    `/api/user/${editTrip.userId}/trip/${editTrip.tripId}`,
    reqConfig
  );
  if (!res.ok) {
    throw new Error(`Error status ${res.status}`);
  }
  return await res.json();
}

export async function deleteTrip(
  userId: number,
  tripId: number
): Promise<TripEntry[]> {
  const reqConfig = {
    method: 'DELETE',
  };
  const res = await fetch(`/api/user/${userId}/trip/${tripId}`, reqConfig);
  if (!res.ok) {
    throw new Error(`Error status ${res.status}`);
  }
  return await res.json();
}

export async function addEvent(
  newEvent: Partial<EventEntry>
): Promise<EventEntry[]> {
  const reqConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newEvent),
  };
  const res = await fetch(
    `/api/user/${newEvent.userId}/trip/${newEvent.tripId}`,
    reqConfig
  );
  if (!res.ok) {
    throw new Error(`Error status ${res.status}`);
  }
  return await res.json();
}
