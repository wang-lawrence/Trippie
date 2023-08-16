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
  0: 'FF0000', // red
  1: '00FFFF', // cyan
  2: 'FFFF00', // yellow
  3: 'FFFFFF', // white
  4: 'F0F8FF', // AliceBlue
  5: 'FF7F50', // Coral
  6: 'FF69B4', // HotPink
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
  gPlace: string;
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
  gPlace: '',
};

export async function fetchAllTrips(): Promise<TripEntry[]> {
  const reqConfig = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  console.log('reqConfig', reqConfig);
  const res = await fetch(`/api/trips`, reqConfig);
  if (!res.ok) {
    throw new Error(`Error status ${res.status}`);
  }

  return await res.json();
}

export async function fetchTrip(tripId: number): Promise<TripEvents[]> {
  const reqConfig = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  const res = await fetch(`/api/trip/${tripId}`, reqConfig);
  if (!res.ok) {
    throw new Error(`Error status ${res.status}`);
  }
  const trip = await res.json();
  return trip;
}

export async function addTrip(
  newTrip: Partial<TripEntry>
): Promise<TripEntry[]> {
  const reqConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify(editTrip),
  };
  const res = await fetch(`/api/trip/${editTrip.tripId}`, reqConfig);
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

export async function fetchEvent(
  userId: number,
  tripId: number,
  eventId: number
): Promise<TripEvents[]> {
  const res = await fetch(
    `/api/user/${userId}/trip/${tripId}/event/${eventId}`
  );
  if (!res.ok) {
    throw new Error(`Error status ${res.status}`);
  }
  const event = await res.json();
  return event;
}

export async function updateEvent(
  editEvent: Partial<EventEntry>
): Promise<EventEntry[]> {
  const reqConfig = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editEvent),
  };
  const res = await fetch(
    `/api/user/${editEvent.userId}/trip/${editEvent.tripId}/event/${editEvent.eventId}`,
    reqConfig
  );
  if (!res.ok) {
    throw new Error(`Error status ${res.status}`);
  }
  return await res.json();
}

export async function deleteEvent(
  userId: number,
  tripId: number,
  eventId: number
): Promise<TripEntry[]> {
  const reqConfig = {
    method: 'DELETE',
  };
  const res = await fetch(
    `/api/user/${userId}/trip/${tripId}/event/${eventId}`,
    reqConfig
  );
  if (!res.ok) {
    throw new Error(`Error status ${res.status}`);
  }
  return await res.json();
}
