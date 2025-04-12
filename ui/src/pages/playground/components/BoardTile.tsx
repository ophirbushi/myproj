import { Box } from '@mui/material';
import { Tile } from '../../../../../engine/models';
import { Color, colorsPalette } from '../shared/colors';
import { useMemo } from 'react';

interface BoardTileParams {
  tile: Tile;
  label: string;
  isAvailableToSelect: boolean;
  isSelected: boolean;
  setIsSelected: (value: boolean) => any;
  color?: Color;
}

export const BoardTile = ({ tile, label, isSelected, setIsSelected, isAvailableToSelect = Math.random() > .9, color = colorsPalette.white }: BoardTileParams) => {
  const labelAbbreviated = useMemo(() => {
    if (!label) {
      return '';
    }
    return label.substring(0, 2);
  }, [label]);

  const onTileClick = () => {
    if (!isAvailableToSelect) {
      return;
    }
    setIsSelected(!isSelected);
  };

  return (
    <Box
      color={color.isDark ? colorsPalette.white.hex : 'auto'}
      bgcolor={isSelected ? colorsPalette.blue.hex : color.hex}
      border={isAvailableToSelect ? `4px solid ${colorsPalette.blue.hex} !important` : 'auto'}
      sx={{
        cursor: isAvailableToSelect ? 'pointer' : 'default'
      }}
      key={`${tile[0]}-${tile[1]}`}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius={1}
      className='common-bordered'
      onClick={() => onTileClick()}
    >
      {labelAbbreviated}
    </Box>
  );
};
