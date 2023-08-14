import { icons } from '../lib/data';
import {
  Popover,
  PopoverContentBelowAnchor,
  PopoverTrigger,
  PopoverClose,
} from '../components/ui/popover';

type IconProps = {
  iconUrl: string;
  onClick: (icon: string) => void;
};

export default function IconPopover({ iconUrl, onClick }: IconProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="h-16 w-16 p-2 hover:p-1 rounded-full border border-gray-200 bg-white shadow cursor-pointer">
          <img src={iconUrl} alt="travel icon" />
        </div>
      </PopoverTrigger>
      <PopoverContentBelowAnchor className="w-72 pr-0 mr-2">
        <div className="flex flex-wrap pt-1">
          {icons.map((icon, index) => {
            return (
              <PopoverClose key={index}>
                <div
                  onClick={() => onClick(icon)}
                  className="h-14 w-14 p-2 mr-2 mb-2 hover:p-1 rounded-full border border-gray-200 bg-white shadow cursor-pointer">
                  <img src={icon} alt="travel icon" />
                </div>
              </PopoverClose>
            );
          })}
        </div>
      </PopoverContentBelowAnchor>
    </Popover>
  );
}
