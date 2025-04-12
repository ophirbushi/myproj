import React, { useMemo } from 'react';
import { abbreviateHotelName } from '../shared/utils';

export interface HotelItemProps {
  hotelName: string;
  hotelSize: number;
  stockPrice: number;
  prestige: number;
}

const HotelItem = ({ hotelName, hotelSize, stockPrice, prestige }: HotelItemProps) => {
  const abbreviatedHotelName = useMemo(() => abbreviateHotelName(hotelName), [hotelName]);
  const hotelStars = useMemo(() => new Array(prestige).fill('⭐').join(''), [prestige]);

  return (
    <li className="hotel-item common-bordered common-padded">
      <div>
        <span className="hotel-initial"> {abbreviatedHotelName} </span>
        {hotelSize ? <span> ({hotelSize}) </span> : null}
      </div>
      <div>
        {stockPrice ? <span> ({stockPrice}) </span> : null}
        <span>{hotelStars}</span>
      </div>
    </li>
  );
};

export default HotelItem;
