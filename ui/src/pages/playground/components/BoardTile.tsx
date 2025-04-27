import { Box } from '@mui/material';
import { Tile } from '../../../../../engine/models';
import { Color, colorsPalette } from '../shared/colors';
import { useMemo } from 'react';
import { abbreviateHotelName } from '../shared/utils';

interface BoardTileParams {
  tile: Tile;
  label: string;
  isAvailableToSelect: boolean;
  isSelected: boolean;
  setIsSelected: (value: boolean) => any;
  isActive: boolean;
  isLastPlayed: boolean
  color?: Color;
}

export const BoardTile = ({ tile, label, isSelected, isLastPlayed, setIsSelected, isAvailableToSelect, isActive, color = colorsPalette.white }: BoardTileParams) => {
  const labelAbbreviated = useMemo(() => abbreviateHotelName(label), [label]);

  let border = 'auto';

  if (isAvailableToSelect) {
    border = `4px solid ${isActive ? colorsPalette.blue.hex : colorsPalette.black.hex} !important`;
  } else if (isLastPlayed) {
    border = `2px solid ${colorsPalette.black.hex} !important`;
  }

  const onTileClick = () => {
    if (!isAvailableToSelect || !isActive) {
      return;
    }
    setIsSelected(!isSelected);
  };

  return (
    <Box
      color={color.isDark ? colorsPalette.white.hex : 'auto'}
      bgcolor={isSelected ? colorsPalette.blue.hex : color.hex}
      border={border}
      sx={{
        cursor: isActive && isAvailableToSelect ? 'pointer' : 'default'
      }}
      key={`${tile[0]}-${tile[1]}`}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius={1}
      className={'common-bordered' + (isLastPlayed ? ' shiny-effect' : '')}
      onClick={() => onTileClick()}
    >
      {labelAbbreviated}
    </Box>
  );
};
