import { useMemo } from 'react';
import { State } from '../../../../../engine/models';
import HotelItem, { HotelItemProps } from './HotelItem';
import { getHotelsInvolvedInMerge, getHotelSize, getHotelStockPrice, getHowManyStocksLeftForHotel } from '../../../../../engine/helpers';
import { colorsPalette, hotelColors } from '../shared/colors';
import { Button } from '@mui/material';

export interface HotelsProps {
  gameState: State;
  selectedHotelIndex: number | null;
  setSelectedHotelIndex: (value: number | null) => any;
  confirmSelectedHotelIndex: (value: number) => any;
  isLocalPlayerActive: boolean;
}

export const Hotels = ({ gameState, selectedHotelIndex, setSelectedHotelIndex, confirmSelectedHotelIndex, isLocalPlayerActive }: HotelsProps) => {
  const hotels: HotelItemProps[] = useMemo(() => {
    return gameState.config.hotels.map<HotelItemProps>((hotel, index) => {
      const isHotelOnBoard = gameState.hotels.some(h => h.hotelIndex === index);
      return {
        hotelName: hotel.hotelName,
        prestige: hotel.prestige,
        hotelSize: isHotelOnBoard ? getHotelSize(gameState, index) : 0,
        stockPrice: isHotelOnBoard ? getHotelStockPrice(gameState, index) : 0,
        color: isHotelOnBoard ? hotelColors[index] : colorsPalette.white,
        stocksLeft: getHowManyStocksLeftForHotel(gameState, index),
        isSelectable: isLocalPlayerActive && (
          (
            gameState.phaseId === 'establish' && !isHotelOnBoard
          )
          ||
          (
            gameState.phaseId === 'merge' &&
            getHotelsInvolvedInMerge(gameState, gameState.boardTiles[gameState.boardTiles.length - 1]).includes(index)
          )
        ),
        isSelected: index === selectedHotelIndex,
        setIsSelected: (value: boolean) => setSelectedHotelIndex(value ? index : null)
      };
    });
  }, [gameState, selectedHotelIndex, isLocalPlayerActive]);

  return (
    <div className="hotels-list">
      <ul>
        {hotels.map((h, i) => (
          <HotelItem
            key={i + h.hotelName}
            {...h}
          />
        ))}
        {
          selectedHotelIndex != null ? (<li>
            <Button variant='contained' onClick={() => {
              confirmSelectedHotelIndex(selectedHotelIndex);
              setSelectedHotelIndex(null);
            }}>Confirm</Button>
          </li>) : null
        }
      </ul>
    </div>
  )
};

