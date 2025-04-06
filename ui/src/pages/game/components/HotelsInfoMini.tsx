import { Box, Typography } from '@mui/material';
import { type State } from '../../../../../engine/models';
import { hotelColors as HOTEL_COLORS } from '../utils/hotelConfig';
import { getShortenedHotelName } from '../utils/hotelUtils';
import { getHotelSize } from '../../../../../engine/helpers';
import { useMemo } from 'react';
import { LocalPlayerIndex } from '../models/game.models';
import { getActivePlayerIndex } from '../utils/localPlayer';

interface HotelsInfoMiniParams {
  gameState: State
  postInput: (input: number) => any
  fontSize?: number
  localPlayerIndex: LocalPlayerIndex
}

export default function HotelsInfoMini({ gameState, postInput, localPlayerIndex, fontSize = 10 }: HotelsInfoMiniParams) {
  const derivedState = useMemo(() => {
    const hotelSizes: { [hotelIndex: number]: number } = {};
    const hotelColors: {
      [hotelIndex:
        number]: string
    } = {};
    const hotelNames: { [hotelIndex: number]: string } = {};
    const hotelPrestiges: { [hotelIndex: number]: string } = {};
    const onBoardHotels: { [hotelIndex: number]: true } = {};
    gameState.config.hotels.map((hotel, idx: number) => {
      hotelNames[idx] = getShortenedHotelName(hotel.hotelName);
      hotelSizes[idx] = 0;
      hotelColors[idx] = 'white';
      const onBoardHotel = gameState.hotels.find(boardHotel => boardHotel.hotelIndex === idx);
      if (onBoardHotel) {
        onBoardHotels[idx] = true;
        hotelSizes[idx] = getHotelSize(gameState, onBoardHotel.hotelIndex);
        hotelColors[idx] = HOTEL_COLORS[idx];
      }
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
    const activePlayerIndex = getActivePlayerIndex(gameState);
    const isLocalPlayerTurn = localPlayerIndex === activePlayerIndex || localPlayerIndex === 'all';
    const isChooseHotelState = isLocalPlayerTurn && gameState.phaseId === 'establish';

    return {
      hotelSizes,
      hotelColors,
      hotelNames,
      hotelPrestiges,
      isLocalPlayerTurn,
      isChooseHotelState,
      onBoardHotels
    };
  }, [gameState]);

  return (
    <Box display="flex" flexWrap="wrap" flexDirection={'column'} gap={3} marginTop={7}>
      {gameState.config.hotels.map((hotel, idx) => {
        const hotelName = derivedState.hotelNames[idx];
        const hotelSize = derivedState.hotelSizes[idx];
        const prestige = derivedState.hotelPrestiges[idx];
        const bgcolor = derivedState.hotelColors[idx];

        const isOnBoardHotel = derivedState.onBoardHotels[idx] || false;
        return (
          <Box
            key={idx}
            padding={1}
            fontSize={fontSize}
            bgcolor={bgcolor}
            borderRadius={2}
            textAlign="center"
            sx={{
              userSelect: 'none',
              cursor: !isOnBoardHotel && derivedState.isChooseHotelState ? 'pointer' : 'default',
              border: !isOnBoardHotel && derivedState.isChooseHotelState ? '2px dashed #1976d2' : '2px solid #ddd',
              boxShadow: !isOnBoardHotel && derivedState.isChooseHotelState ? '0 0 8px rgba(25, 118, 210, 0.5)' : 'none',
            }}
            onClick={() => {
              if (derivedState.isChooseHotelState) {
                postInput(idx);
              }
            }}
          >
            <span> {hotelName} </span>
            <span> ({hotelSize}) </span>
            <span> {prestige} </span>
          </Box>
        );
      })}
    </Box>
  );
}
