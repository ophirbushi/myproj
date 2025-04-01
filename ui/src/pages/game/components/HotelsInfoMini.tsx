import { Box } from '@mui/material';
import { type State } from '../../../../../engine/models';
import { hotelColors as HOTEL_COLORS } from '../utils/hotelConfig';
import { getShortenedHotelName } from '../utils/hotelUtils';
import { getHotelSize } from '../../../../../engine/helpers';
import { useMemo } from 'react';

interface HotelsInfoMiniParams {
  gameState: State
  postInput: (input: number) => any,
  fontSize?: number
}

export default function HotelsInfoMini({ gameState, postInput, fontSize = 10 }: HotelsInfoMiniParams) {
  const derivedState = useMemo(() => {
    const hotelSizes: { [hotelIndex: number]: number } = {};
    const hotelColors: { [hotelIndex: number]: string } = {};
    const hotelNames: { [hotelIndex: number]: string } = {};
    const hotelPrestiges: { [hotelIndex: number]: string } = {};
    gameState.config.hotels.map((hotel, idx: number) => {
      const onBoardHotel = gameState.hotels.find(boardHotel => boardHotel.hotelIndex === idx);
      hotelSizes[idx] = onBoardHotel ? getHotelSize(gameState, onBoardHotel.hotelIndex) : 0;
      hotelColors[idx] = HOTEL_COLORS[onBoardHotel ? idx : -1];
      hotelNames[idx] = getShortenedHotelName(hotel.hotelName);
      switch (hotel.prestige) {
        case 0:
          hotelPrestiges[idx] = '';
          break;
        case 1:
          hotelPrestiges[idx] = '⭐';
          break;
        case 2:
          hotelPrestiges[idx] = '⭐⭐';
          break;
      }
    });
    return {
      hotelSizes,
      hotelColors,
      hotelNames,
      hotelPrestiges
    };
  }, [gameState]);

  return <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: fontSize * 1.2,
    justifyContent: 'center',
    height: '100%'
  }}>
    {gameState.config.hotels.map((_, idx: number) => {
      const hotelName = derivedState.hotelNames[idx];
      const hotelSize = derivedState.hotelSizes[idx];
      const bgcolor = derivedState.hotelColors[idx];
      const prestige = derivedState.hotelPrestiges[idx];
      return (
        <Box key={idx} padding={.8} fontSize={fontSize} bgcolor={bgcolor} borderRadius={2}
          textAlign={'center'} sx={{ userSelect: 'none' }} onClick={() => postInput(idx)}>
          <span> {hotelName} </span>
          <span> ({hotelSize}) </span>
          <span> {prestige} </span>
        </Box>
      );
    })}
  </div>;
}
