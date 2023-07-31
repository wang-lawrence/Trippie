type newEventEntry = {
  tripName: string;
  startDate: Date;
  endDate: Date;
};

export async function addEvent(newEvent: newEventEntry) {
  try {
    const reqConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent),
    };
    const res = await fetch('/api/event', reqConfig);
    if (!res.ok) {
      throw new Error(`Error status ${res.status}`);
    }
    // return await res.json(res);
  } catch (error) {
    console.log((error as Error).message);
  }
}
