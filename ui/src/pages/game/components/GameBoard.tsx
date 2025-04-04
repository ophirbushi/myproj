import { Box } from "@mui/material";
import { State, Tile, } from '../../../../../engine/models';
import { getTileGroup, getTileKey, isEqualTiles } from '../../../../../engine/helpers';
import { useEffect, useMemo, useState } from 'react';
import { hotelColors } from '../utils/hotelConfig';
import { getShortenedHotelName } from '../utils/hotelUtils';

export interface GameBoardProps {
  gameState: State;
  isMobile: boolean;
  selectedTile: Tile | null;
  hoveredTile: Tile | null;
  setSelectedTile: (tile: Tile | null) => any;
  setHoveredTile: (tile: Tile | null) => any;
  localPlayerTiles: Tile[]
}

export default function GameBoard(
  { gameState, isMobile, selectedTile, hoveredTile, setSelectedTile, setHoveredTile, localPlayerTiles }: GameBoardProps
) {
  const boardWidth = gameState.config.boardWidth;
  const boardHeight = gameState.config.boardHeight;

  const [isLoaded, setIsLoaded] = useState(false);
  const [tileSize, setTileSize] = useState(22);

  const derivedState = useMemo(() => {
    const hotelIndexMap: { [tileKey: string]: number } = {};
    for (const hotel of gameState.hotels) {
      const tiles = getTileGroup(gameState, [hotel.x, hotel.y]);
      for (const tile of tiles) {
        const tileKey = getTileKey(tile);
        hotelIndexMap[tileKey] = hotel.hotelIndex;
      }
    }
    return { hotelIndexMap };
  }, [gameState]);

  useEffect(() => {
    const calculateTileSize = () => {
      const maxTileSize = 50; // Maximum size for a tile
      const minTileSize = 10; // Minimum size for a tile
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Calculate tile size based on screen dimensions
      const size = Math.min(screenWidth / 20, screenHeight / 20); // Adjust divisor as needed
      setTileSize(Math.max(minTileSize, Math.min(size, maxTileSize))); // Clamp between min and max
      setIsLoaded(true);
    };

    calculateTileSize(); // Initial calculation
    window.addEventListener("resize", calculateTileSize); // Recalculate on resize

    return () => {
      window.removeEventListener("resize", calculateTileSize); // Cleanup listener
    };
  }, []);

  const getLabelCell = (type: 'col' | 'row', index: number, content: string) => {
    return (
      <Box
        key={`${type}-${index}`}
        width={tileSize}
        height={tileSize}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
        sx={{
          userSelect: 'none'
        }}
      >
        {content}
      </Box>
    );
  }

  const getTileLabelAndColor = (tile: Tile | null, hotelIndex: number, isSelected: boolean, isHovered: boolean): { label: string, color: string } => {
    let color = '';
    if (isHovered) {
      color = '#aad5ff';
    }
    if (isSelected) {
      color = '#1976d2';
    }
    if (!tile) {
      return {
        label: '',
        color: color || 'transparent'
      };
    }
    const hotelName = hotelIndex === -1 ? 'Neutral' : gameState.config.hotels[hotelIndex].hotelName;
    let label = getShortenedHotelName(hotelName);
    if (isMobile) {
      label = label[0];
    }
    return {
      label,
      color: color || hotelColors[hotelIndex]
    };
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(${boardWidth + 1}, ${tileSize}px)`}
      gridTemplateRows={`repeat(${boardHeight + 1}, ${tileSize}px)`}
      gap={1}
      bgcolor="white"
      p={2}
      borderRadius={2}
      sx={{
        border: "1px solid #ccc",
        aspectRatio: `${boardWidth + 1} / ${boardHeight + 1}`,
        touchAction: "manipulation",
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.8s ease-out'
      }}
    >
      {Array.from({ length: (boardWidth + 1) * (boardHeight + 1) }).map((_, i) => {
        const x = i % (boardWidth + 1); // Column index
        const y = Math.floor(i / (boardWidth + 1)); // Row index

        // Top-left corner (empty)
        if (x === 0 && y === 0) {
          return <Box key='empty' width={tileSize} height={tileSize} />;
        }

        // Column labels (top row)
        if (y === 0) {
          return getLabelCell('col', x, String.fromCharCode(64 + x));
        }

        // Row labels (left column)
        if (x === 0) {
          return getLabelCell('row', y, y.toString());
        }

        // Game tiles
        const tileX = x - 1; // Adjust for labels
        const tileY = y - 1; // Adjust for labels
        const tile = gameState.boardTiles.find((t) => t[0] === tileX && t[1] === tileY) || null;

        const tileKey = getTileKey([tileX, tileY]);

        const isSelected = selectedTile && isEqualTiles([tileX, tileY], selectedTile) || false;
        const isHovered = hoveredTile && isEqualTiles([tileX, tileY], hoveredTile) || false;

        const hotelIndex = derivedState.hotelIndexMap[tileKey] ?? -1;
        const { label, color } = getTileLabelAndColor(tile, hotelIndex, isSelected, isHovered);

        let isLocalPlayerTile = false;
        if (gameState.phaseId === 'build') {
          isLocalPlayerTile = localPlayerTiles.some(t => isEqualTiles(t, [tileX, tileY]));
        }
        const borderColor = isLocalPlayerTile ? '#1976d2' : '#999';
        const borderWidth = isLocalPlayerTile ? '3px' : '1px';

        return (
          <Box
            key={`${tileX}-${tileY}`}
            width={tileSize}
            height={tileSize}
            display="flex"
            alignItems="center"
            justifyContent="center"
            border={borderWidth + ' solid ' + borderColor}
            fontSize="0.75rem"
            bgcolor={color}
            sx={{ cursor: "pointer", userSelect: "none" }}
            borderRadius={2}
            onClick={() => isLocalPlayerTile && setSelectedTile([tileX, tileY])}
            onMouseEnter={() => isLocalPlayerTile && setHoveredTile([tileX, tileY])}
            onMouseLeave={() => setHoveredTile(null)}
          >
            {label}
          </Box>
        );
      })}
    </Box>
  );
}
