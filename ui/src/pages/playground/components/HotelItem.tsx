import { useMemo } from 'react';
import { abbreviateHotelName } from '../shared/utils';
import { Color, colorsPalette } from '../shared/colors';

export interface HotelItemProps {
  hotelName: string;
  hotelSize: number;
  stockPrice: number;
  prestige: number;
  color: Color;
}

const HotelItem = ({ hotelName, hotelSize, stockPrice, color, prestige }: HotelItemProps) => {
  const abbreviatedHotelName = useMemo(() => abbreviateHotelName(hotelName), [hotelName]);
  // const hotelStars = useMemo(() => new Array(prestige).fill('⭐').join(''), [prestige]);

  return (
    <li className="hotel-item common-bordered common-padded" style={{
      backgroundColor: color.hex,
      color: color.isDark ? colorsPalette.white.hex : 'auto'
    }}>
      <div>
        <span className="hotel-initial"> {abbreviatedHotelName} </span>
        <span> ({hotelSize}) </span>
      </div>
      <div>
        <span style={{ fontWeight: 'bold' }}> {stockPrice ? '$' + stockPrice : ''} </span>
      </div>
    </li>
  );
};

export default HotelItem;
