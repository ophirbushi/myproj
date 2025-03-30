import { Box } from "@mui/material";
import { type State } from '../../../../../engine/models';

const TILE_SIZE = 22;

export default function GameBoard({ gameState }: { gameState: State }) {
  const boardWidth = gameState.config.boardWidth;
  const boardHeight = gameState.config.boardHeight;

  return (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(${boardWidth}, ${TILE_SIZE}px)`}
      gridTemplateRows={`repeat(${boardHeight}, ${TILE_SIZE}px)`}
      gap={1}
      bgcolor="white"
      p={2}
      sx={{
        border: "1px solid #ccc",
        aspectRatio: `${boardWidth} / ${boardHeight}`,
        touchAction: "manipulation",
      }}
    >
      {Array.from({ length: boardWidth * boardHeight }).map((_, i) => {
        const x = i % boardWidth;
        const y = Math.floor(i / boardWidth);
        const tile = gameState.boardTiles.find(t => t[0] === x && t[1] === y);

        return (
          <Box
            key={`${x}-${y}`}
            width={TILE_SIZE}
            height={TILE_SIZE}
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
