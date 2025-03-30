import { Box } from "@mui/material";
import { type State } from '../../../../../engine/models';
import { useEffect, useState } from 'react';

export default function GameBoard({ gameState }: { gameState: State }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tileSize, setTileSize] = useState(22);

  const boardWidth = gameState.config.boardWidth;
  const boardHeight = gameState.config.boardHeight;

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
          return <Box key={`empty`} width={tileSize} height={tileSize} />;
        }

        // Column labels (top row)
        if (y === 0) {
          return (
            <Box
              key={`col-${x}`}
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
              {String.fromCharCode(64 + x)} {/* Convert 1 -> 'A', 2 -> 'B', etc. */}
            </Box>
          );
        }

        // Row labels (left column)
        if (x === 0) {
          return (
            <Box
              key={`row-${y}`}
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
              {y} {/* Row number */}
            </Box>
          );
        }

        // Game tiles
        const tileX = x - 1; // Adjust for labels
        const tileY = y - 1; // Adjust for labels
        const tile = gameState.boardTiles.find((t) => t[0] === tileX && t[1] === tileY);

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
            bgcolor={tile ? "lightblue" : "transparent"}
            sx={{ cursor: "pointer", userSelect: "none" }}
            onClick={() => {
              // handle tile click
            }}
          >
            {tile ? `T` : ""}
          </Box>
        );
      })}
    </Box>
  );
}
