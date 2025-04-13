import { useMemo } from 'react';
import { abbreviateHotelName } from '../shared/utils';
import { Color, colorsPalette } from '../shared/colors';

export interface HotelItemProps {
  hotelName: string;
  hotelSize: number;
  stockPrice: number;
  prestige: number;
  stocksLeft: number;
  color: Color;
  isSelectable: boolean;
  isSelected: boolean;
  setIsSelected: (value: boolean) => any;
}

const HotelItem = ({ hotelName, hotelSize, stockPrice, stocksLeft, color, isSelectable, isSelected, setIsSelected }: HotelItemProps) => {
  const onHotelClick = () => {
    if (isSelectable) {
      setIsSelected(!isSelected);
    }
  };

  const abbreviatedHotelName = useMemo(() => abbreviateHotelName(hotelName), [hotelName]);
  // const hotelStars = useMemo(() => new Array(prestige).fill('⭐').join(''), [prestige]);

  const bgColor = isSelected ? colorsPalette.blue : color;

  return (
    <li className="hotel-item common-bordered common-padded" onClick={() => onHotelClick()} style={{
      backgroundColor: bgColor.hex,
      color: bgColor.isDark ? colorsPalette.white.hex : colorsPalette.black.hex,
      borderColor: (isSelected || isSelectable) ? colorsPalette.blue.hex : colorsPalette.black.hex,
      borderWidth: (isSelected || isSelectable) ? '4px' : '1px'
    }}>
      <div>
        <span className="hotel-initial"> {abbreviatedHotelName} </span>
        <span> ({hotelSize}) </span>
      </div>
      <div>
        <span style={{ fontWeight: 'bold' }}> {true ? '$' + stockPrice : ''} </span>
        <span > ({stocksLeft})  </span>
      </div>
    </li>
  );
};

export default HotelItem;
