import { Box } from '@mui/material';
import { type State } from '../../../../../engine/models';

export default function HotelsInfoMini({ gameState }: { gameState: State }) {
  return <div>
    {gameState.config.hotels.map((h, idx: number) => (
      <Box key={idx} fontSize={12}>{`${h.hotelName}`}</Box>
    ))}
  </div>;
}
