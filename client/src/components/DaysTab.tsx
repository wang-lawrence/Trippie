type DaysTabProps = {
  activeMapDays: number[];
  daysCount: number;
  toggleMapDay: (i: number) => void;
};

// creates a series of buttons that'll toggle the map markers by day
export default function DaysTab({
  activeMapDays,
  daysCount,
  toggleMapDay,
}: DaysTabProps) {
  const daysTabs = [];
  for (let i = 0; i < daysCount; i++) {
    daysTabs.push(
      <div
        onClick={() => toggleMapDay(i)}
        className={`${
          activeMapDays.includes(i) ? 'bg-[#025464] text-white' : 'bg-gray-300'
        } flex justify-center items-center ml-2 w-8 h-8 rounded-full text-center cursor-pointer shadow hover:text-lg hover:font-semibold active:text-white active:bg-[#025464]`}>
        {i + 1}
      </div>
    );
  }
  // when dayCounts gets over 12 the tabs will get hidden if justified center, so default justify and set overflow when > 12
  return (
    <div
      className={`flex w-[95%] items-center mb-2 ${
        daysCount >= 12 ? 'overflow-scroll' : 'justify-center'
      }`}>
      Day: {daysTabs}
    </div>
  );
}
