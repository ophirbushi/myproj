import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { State } from '../../../../../engine/models';

const getWinnerText = (gameState: State): string => {
  const { cash } = gameState;
  const max = Math.max(...cash); // Find the highest value
  const winnerPlayerIndices = cash
    .map((value, index) => (value === max ? index : -1)) // Map to indices or -1
    .filter(index => index !== -1); // Filter out -1 values

  if (winnerPlayerIndices.length === 1) {
    return `Player ${winnerPlayerIndices[0] + 1} wins!`;
  }
  return `Players ${winnerPlayerIndices.map(playerIndex => playerIndex + 1).join(' and ')} share the victory.`;
};

export default function GameOver({
  open,
  onClose,
  gameState,
}: { open: boolean, onClose: () => any, gameState: State }) {
  const winnerText = useMemo(() => {
    return getWinnerText(gameState);
  }, [gameState]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Game Over</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" mb={2}>
          {winnerText}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
