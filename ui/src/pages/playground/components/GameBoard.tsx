import { Box } from "@mui/material";
import { State, Tile } from '../../../../../engine/models';
import { getHotelTiles, getTileGroup, getTileKey, isEqualTiles, isTemporarilyIllegalTile } from '../../../../../engine/helpers';
import { BoardTile } from './BoardTile';
import { useCallback, useMemo, useState } from 'react';
import { colorsPalette, hotelColors } from '../shared/colors';
import { getActivePlayerIndex } from '../../game/utils/localPlayer';

export interface GameBoardProps {
  gameState: State;
  localPlayerIndex: number;
}

const LabelCell = ({ type, index, content }: { type: 'col' | 'row'; index: number; content: string; }) => (
  <Box
    key={`${type}-${index}`}
    display="flex"
    alignItems="center"
    justifyContent="center"
    fontWeight="bold"
    sx={{
      userSelect: 'none',
    }}
  >
    {content}
  </Box>
);

export default function GameBoardNew({ gameState, localPlayerIndex }: GameBoardProps) {
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [availableToSelectTiles, setAvailableToSelectTiles] = useState<Tile[]>([]);

  const derivedState = useMemo(() => {
    const hotelIndexMap: { [tileKey: string]: number } = {};
    for (const hotel of gameState.hotels) {
      const tiles = getHotelTiles(gameState, hotel.hotelIndex);
      for (const tile of tiles) {
        const tileKey = getTileKey(tile);
        hotelIndexMap[tileKey] = hotel.hotelIndex;
      }
    }

    if (gameState.phaseId === 'build' && localPlayerIndex === getActivePlayerIndex(gameState)) {
      const availableToSelectTiles = gameState.playerTiles[localPlayerIndex].tiles
        .filter((tile) => !isTemporarilyIllegalTile(gameState, tile));
      setAvailableToSelectTiles(availableToSelectTiles);
    } else {
      setSelectedTile(null);
      setAvailableToSelectTiles([]);
    }

    return {
      hotelIndexMap
    };
  }, [gameState, localPlayerIndex]);

  const boardLayout = useMemo(() => {
    return Array.from({ length: (gameState.config.boardWidth + 1) * (gameState.config.boardHeight + 1) });
  }, [gameState.config.boardWidth, gameState.config.boardHeight]);

  const getIsTileAvailableToSelect = useCallback(
    (tile: Tile) => availableToSelectTiles.some(t => isEqualTiles(t, tile)),
    [availableToSelectTiles]
  );

  const getTileColorText = useCallback(
    (tile: Tile) => {
      const tileKey = getTileKey(tile);
      const hotelIndex = derivedState.hotelIndexMap[tileKey];
      if (hotelIndex != null) {
        return {
          color: hotelColors[hotelIndex],
          text: gameState.config.hotels[hotelIndex].hotelName
        };
      }
      const isTileOnBoard = gameState.boardTiles.some(t => isEqualTiles(t, tile));
      return {
        color: isTileOnBoard ? colorsPalette.gray : colorsPalette.white,
        text: isTileOnBoard ? 'Neutral' : ''
      };
    },
    [gameState]
  );

  return (
    <Box
      className='game-board'
      bgcolor="white"
      borderRadius={2}
      margin={'0 auto'}
      sx={{ touchAction: "manipulation" }}
    >
      {boardLayout.map((_, i) => {
        const x = i % (gameState.config.boardWidth + 1) - 1;
        const y = Math.floor(i / (gameState.config.boardWidth + 1)) - 1;

        const tile: Tile = [x, y];
        const key = getTileKey(tile);

        if (x === -1 && y === -1) {
          return <Box key={key} />;
        }
        if (y === -1) {
          return <LabelCell type="col" index={x} content={String.fromCharCode(65 + x)} key={key} />;
        }
        if (x === -1) {
          return <LabelCell type="row" index={y} content={(y + 1).toString()} key={key} />;
        }

        const isAvailableToSelect = getIsTileAvailableToSelect(tile);
        const { color, text } = getTileColorText(tile);

        return (
          <BoardTile
            key={key}
            tile={tile}
            label={text}
            isAvailableToSelect={isAvailableToSelect}
            setIsSelected={(value: boolean) => setSelectedTile(value ? tile : null)}
            isSelected={selectedTile != null && isEqualTiles(tile, selectedTile)}
            color={color}
          />
        );
      })}
    </Box>
  );
}