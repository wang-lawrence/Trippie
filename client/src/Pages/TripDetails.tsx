import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import { FaMapLocationDot } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
import { TripEntry, icons, updateTrip } from '../lib/data';
import useFindTrip from '../hooks/useFindTrip';

type TripProps = {
  onClick: (trip: TripEntry) => void;
};

export default function TripDetails({ onClick }: TripProps) {
  const [activeIcon, setActiveIcon] = useState('');
  const { tripId } = useParams();
  const trip = useFindTrip(1, Number(tripId));
  const { tripName, startDate, endDate, iconUrl } = trip;

  useEffect(() => {
    setActiveIcon(iconUrl);
  }, [iconUrl]);

  function handleIconChange(icon: string) {
    setActiveIcon(icon);
    updateTrip(trip, 1, trip.tripId, icon);
  }

  return (
    <div className="container roboto">
      <header className="flex justify-center content-center mt-3">
        <div
          onClick={() => onClick(trip)}
          className="text-center hover:underline cursor-pointer">
          <div className="h-full flex flex-wrap content-center">
            <h1 className="w-full text-xl mb-1 font-semibold tracking-wide">
              {tripName}
            </h1>
            <p className="w-full text-sm text-gray-400">{`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}</p>
          </div>
        </div>
        <IconPopover iconUrl={activeIcon} onClick={handleIconChange} />
      </header>
      <section className="flex justify-center mt-3">
        <Button className="bg-green w-1/3 max-w-[150px] min-w-[120px]">
          Add Event <AiOutlinePlusCircle className="ml-2" />
        </Button>
        <Button className="bg-gold w-1/3 max-w-[120px] mx-7">
          Map <FaMapLocationDot className="ml-2" />
        </Button>
        <Button className="bg-orange w-1/3 max-w-[120px]">
          Delete <AiOutlineMinusCircle className="ml-2" />
        </Button>
      </section>
      <section className="mt-3 ">
        <header>Day 1 - 11/09/23</header>
        <header>Day 2 - 11/10/23</header>
        <header>Day 3 - 11/11/23</header>
        <header>Day 4 - 11/12/23</header>
        <header>Day 5 - 11/13/23</header>
      </section>
    </div>
  );
}

type IconProps = {
  iconUrl: string;
  onClick: (icon: string) => void;
};

function IconPopover({ iconUrl, onClick }: IconProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="h-16 w-16 p-2 hover:p-1 rounded-full border border-gray-200 bg-white shadow cursor-pointer">
          <img src={iconUrl} alt="travel icon" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-wrap pt-1">
          {icons.map((icon, index) => {
            return (
              <div
                key={icon.slice(-7)}
                id={icon.slice(-7)}
                onClick={() => onClick(icon)}
                className="h-14 w-14 p-2 mr-3 mb-2 hover:p-1 rounded-full border border-gray-200 bg-white shadow cursor-pointer">
                <img src={icon} alt="travel icon" />
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
