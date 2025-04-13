import { useMemo } from 'react';
import { State } from '../../../../../engine/models';
import HotelItem, { HotelItemProps } from './HotelItem';
import { getHotelSize, getHotelStockPrice } from '../../../../../engine/helpers';
import { colorsPalette, hotelColors } from '../shared/colors';

export interface HotelsProps {
  gameState: State;
}

export const Hotels = ({ gameState }: HotelsProps) => {
  const hotels: HotelItemProps[] = useMemo(() => {
    return gameState.config.hotels.map<HotelItemProps>((hotel, index) => {
      const isHotelOnBoard = gameState.hotels.some(h => h.hotelIndex === index);
      return {
        hotelName: hotel.hotelName,
        prestige: hotel.prestige,
        hotelSize: isHotelOnBoard ? getHotelSize(gameState, index) : 0,
        stockPrice: isHotelOnBoard ? getHotelStockPrice(gameState, index) : 0,
        color: isHotelOnBoard ? hotelColors[index] : colorsPalette.white
      };
    });
  }, [gameState]);

  return (
    <div className="hotels-list">
      <ul>
        {hotels.map((h, i) => (
          <HotelItem
            key={i + h.hotelName}
            {...h}
          />
        ))}
      </ul>
    </div>
  )
};

