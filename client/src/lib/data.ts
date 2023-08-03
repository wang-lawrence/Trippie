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

export type TripEntry = {
  tripId: number;
  userId: number;
  tripName: string;
  startDate: Date;
  endDate: Date;
  iconUrl: string;
};

export const placeholder: TripEntry = {
  tripId: 1,
  userId: 1,
  tripName: '',
  startDate: new Date(),
  endDate: new Date(),
  iconUrl: 'placeholder-image',
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
): Promise<TripEntry[]> {
  const res = await fetch(`/api/user/${userId}/trip/${tripId}`);
  if (!res.ok) {
    throw new Error(`Error status ${res.status}`);
  }
  const trip = await res.json();
  trip[0].startDate = new Date(trip[0].startDate);
  trip[0].endDate = new Date(trip[0].endDate);
  return trip;
}

export async function addTrip(
  newEvent: Partial<TripEntry>
): Promise<TripEntry[]> {
  const reqConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newEvent),
  };
  const res = await fetch('/api/trip', reqConfig);
  if (!res.ok) {
    throw new Error(`Error status ${res.status}`);
  }
  return await res.json();
}

export async function updateTrip(
  editTrip: Partial<TripEntry>
  // userId: number,
  // tripId: number,
  // iconUrl: string
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
