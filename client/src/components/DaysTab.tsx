type DaysTabProps = {
  activeMapDays: number[];
  daysCount: number;
  showMapDay: (i: number) => void;
};

// creates a series of buttons that'll toggle the map markers by day
export default function DaysTab({
  activeMapDays,
  daysCount,
  showMapDay,
}: DaysTabProps) {
  const daysTabs = [];
  for (let i = 0; i < daysCount; i++) {
    daysTabs.push(
      <div
        onClick={() => showMapDay(i)}
        className={`${
          activeMapDays.includes(i) ? 'bg-[#025464] text-white' : 'bg-gray-300'
        } flex justify-center items-center ml-2 w-8 h-8 rounded-full text-center cursor-pointer shadow hover:text-lg hover:font-semibold active:text-white active:bg-[#025464]`}>
        {i + 1}
      </div>
    );
  }
  return (
    <div className="flex w-full justify-center items-center mb-2">
      Day: {daysTabs}
    </div>
  );
}
