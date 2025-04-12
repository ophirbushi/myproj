import { Box } from "@mui/material";
import { State, Tile } from '../../../../../engine/models';
import { getTileKey } from '../../../../../engine/helpers';
import { BoardTile } from './BoardTile';

const tileSize: string = '2.5vw';


export interface GameBoardProps {
  gameState: State;
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


export default function GameBoardNew({ gameState, }: GameBoardProps) {
  const boardWidth = gameState.config.boardWidth;
  const boardHeight = gameState.config.boardHeight;

  return (
    <Box
      className='game-board'
      bgcolor="white"
      borderRadius={2}
      margin={'0 auto'}
      sx={{ touchAction: "manipulation" }}
    >
      {Array.from({ length: (boardWidth + 1) * (boardHeight + 1) }).map((_, i) => {
        const x = i % (boardWidth + 1) - 1;
        const y = Math.floor(i / (boardWidth + 1)) - 1;

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
        // const hotelIndex = derivedState.hotelIndexMap[key] ?? -1;

        return (
          <BoardTile
            key={key}
            tile={tile}
            label={''}
          />
        );
      })}
    </Box>
  );
}