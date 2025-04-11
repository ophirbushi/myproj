import { Box } from '@mui/material';
import { Tile } from '../../../../../engine/models';

interface BoardTileParams {
  tile: Tile;
  label: string;
}

export const BoardTile = ({ tile, label }: BoardTileParams) => {
  return (
    <Box
      key={`${tile[0]}-${tile[1]}`}
      display="flex"
      alignItems="center"
      justifyContent="center"
      border={'1px solid #999'}
      borderRadius={1}
    >
      {label}
    </Box>
  );
};
