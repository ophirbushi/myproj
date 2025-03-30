import { Box } from "@mui/material";
import { State, Tile, } from '../../../../../engine/models';
import { getTileGroup, getTileKey } from '../../../../../engine/helpers';
import { useEffect, useMemo, useState } from 'react';
import { hotelColors } from '../utils/hotelConfig';

export default function GameBoard({ gameState, isMobile }: { gameState: State, isMobile: boolean }) {
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

  const getTileLabelAndColor = (tile: Tile | undefined, hotelIndex: number): { label: string, color: string } => {
    if (!tile) {
      return {
        label: '',
        color: 'transparent'
      };
    }
    const hotelName = hotelIndex === -1 ? 'Neutral' : gameState.config.hotels[hotelIndex].hotelName;
    let label = hotelName[0].toUpperCase() + (hotelName[1] ? hotelName[1].toLowerCase() : '');
    if (isMobile) {
      label = label[0];
    }
    return {
      label,
      color: hotelColors[hotelIndex]
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
        const tile = gameState.boardTiles.find((t) => t[0] === tileX && t[1] === tileY);

        const tileKey = getTileKey([tileX, tileY]);

        const hotelIndex = derivedState.hotelIndexMap[tileKey] ?? -1;
        const { label, color } = getTileLabelAndColor(tile, hotelIndex);
        return (
          <Box
            key={`${tileX}-${tileY}`}
            width={tileSize}
            height={tileSize}
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px solid #999"
            fontSize="0.75rem"
            bgcolor={color}
            sx={{ cursor: "pointer", userSelect: "none" }}
            onClick={() => {
              // handle tile click
            }}
          >
            {label}
          </Box>
        );
      })}
    </Box>
  );
}
