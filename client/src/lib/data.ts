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

export async function getAllTrips(userId: number) {
  try {
    const res = await fetch(`/api/user/${userId}/trips`);
    if (!res.ok) {
      throw new Error(`Error status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Fetch Error', error);
  }
}

export async function getTrip(userId: number, tripId: number) {
  try {
    const res = await fetch(`/api/user/${userId}/trip/${tripId}`);
    if (!res.ok) {
      throw new Error(`Error status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Fetch Error', error);
  }
}

export async function addTrip(newEvent: Partial<TripEntry>, iconUrl: string) {
  try {
    const reqConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...newEvent, iconUrl }),
    };
    const res = await fetch('/api/trip', reqConfig);
    if (!res.ok) {
      throw new Error(`Error status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Fetch Error', error);
  }
}

export async function updateTrip(
  editEvent: Partial<TripEntry>,
  userId: number,
  tripId: number
) {
  try {
    const reqConfig = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editEvent),
    };
    const res = await fetch(`/api/user/${userId}/trip/${tripId}`, reqConfig);
    if (!res.ok) {
      throw new Error(`Error status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Fetch Error', error);
  }
}
