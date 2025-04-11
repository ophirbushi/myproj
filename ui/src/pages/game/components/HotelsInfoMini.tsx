import { Box, Typography } from '@mui/material';
import { Input, type State } from '../../../../../engine/models';
import { darkHotels, hotelColors as HOTEL_COLORS } from '../utils/hotelConfig';
import { getShortenedHotelName } from '../utils/hotelUtils';
import { getDissolvingHotels, getHotelsInvolvedInMerge, getHotelSize } from '../../../../../engine/helpers';
import { useMemo } from 'react';
import { LocalPlayerIndex } from '../models/game.models';
import { getActivePlayerIndex } from '../utils/localPlayer';

interface HotelsInfoMiniParams {
  gameState: State
  postInput: (input: Input<number>) => any
  fontSize?: number
  localPlayerIndex: LocalPlayerIndex
}

export default function HotelsInfoMini({ gameState, postInput, localPlayerIndex, fontSize = 10 }: HotelsInfoMiniParams) {
  const derivedState = useMemo(() => {
    const hotelSizes: { [hotelIndex: number]: number } = {};
    const hotelColors: { [hotelIndex: number]: string } = {};
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
    const isEstablishHotelState = isLocalPlayerTurn && gameState.phaseId === 'establish';
    const isChooseSurvivingHotelState = isLocalPlayerTurn && gameState.phaseId === 'merge';
    const hotelsInvolvedInMerge = getHotelsInvolvedInMerge(gameState, gameState.boardTiles[gameState.boardTiles.length - 1]);

    return {
      hotelSizes,
      hotelColors,
      hotelNames,
      hotelPrestiges,
      isLocalPlayerTurn,
      isEstablishHotelState,
      isChooseSurvivingHotelState,
      hotelsInvolvedInMerge,
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

        let cursor = 'default';
        let border = '4px solid #ddd';
        let boxShadow = 'none';
        if (
          (!isOnBoardHotel && derivedState.isEstablishHotelState) ||
          (derivedState.isChooseSurvivingHotelState && derivedState.hotelsInvolvedInMerge.includes(idx))
        ) {
          cursor = 'pointer';
          border = '4px dashed #1976d2';
          boxShadow = '0 0 10px rgba(25, 118, 210, 0.5)';
        }
        return (
          <Box
            key={idx}
            padding={1}
            fontSize={fontSize}
            bgcolor={bgcolor}
            color={(darkHotels[idx] && bgcolor !== 'white') ? 'white' : 'auto'}
            borderRadius={2}
            textAlign="center"
            sx={{
              userSelect: 'none',
              cursor,
              border,
              boxShadow,
            }}
            onClick={() => {
              if (
                derivedState.isEstablishHotelState ||
                (derivedState.isChooseSurvivingHotelState && confirm(`${hotelName} will be the surviving hotel. Are you sure?`))
              ) {
                postInput({ playerIndex: gameState.currentPlayerIndex, data: idx });
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
