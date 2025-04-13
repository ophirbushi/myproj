import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import SwitchRightIcon from "@mui/icons-material/SwitchRight";
import { useEffect, useMemo, useState } from "react";
import { MergeDecision, State } from '../../../../../engine/models';
import { getDissolvingHotels } from '../../../../../engine/helpers';

interface MergeDecisionsProps {
  open: boolean;
  onConfirm: (decisions: MergeDecision[]) => void;
  gameState: State;
  localPlayerIndex: number;
}

export default function MergeDecisions({
  open,
  onConfirm,
  gameState,
  localPlayerIndex,
}: MergeDecisionsProps) {
  const [decisions, setDecisions] = useState<MergeDecision[]>([]);
  const [isTransparentBg, setIsTransparentBg] = useState(false);
  const { stocks, config } = gameState;
  const { defunctHotelNames, initialDecisions } = useMemo(() => {
    const defunctHotelIndices = getDissolvingHotels(gameState, gameState.boardTiles[gameState.boardTiles.length - 1]);
    const defunctHotelNames = defunctHotelIndices.map(hotelIndex => gameState.config.hotels[hotelIndex].hotelName);
    const initialDecisions = defunctHotelIndices.map((hotelIndex) => ({ hotelIndex, convert: 0, sell: 0 }));
    return { defunctHotelIndices, defunctHotelNames, initialDecisions };
  }, [gameState]);

  useEffect(() => {
    setDecisions(initialDecisions);
  }, [gameState]);

  const updateDecision = (hotelIndex: number, field: "convert" | "sell", value: number) => {
    if (isTransparentBg) {
      return;
    }
    setDecisions((prev) =>
      prev.map((d) =>
        d.hotelIndex === hotelIndex ? { ...d, [field]: Math.max(0, value) } : d
      )
    );
  };

  const handleConfirm = () => {
    if (isTransparentBg) {
      return;
    }
    onConfirm(decisions.map(d => ({ ...d, convert: d.convert * 2 })));
    setDecisions(decisions);
  };

  const switchView = (event: Event) => {
    event.stopPropagation();
    setIsTransparentBg(!isTransparentBg);
  };

  return (
    <Dialog open={open} onClose={() => { }} onClick={() => setIsTransparentBg(false)}
      fullWidth sx={{ opacity: isTransparentBg ? .15 : 1, }}>
      <DialogTitle>Merge Decisions {defunctHotelNames.join(', ')}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" mb={2}>
          Player #{localPlayerIndex + 1}, choose how to handle your shares for each defunct hotel.
        </Typography>
        <Stack spacing={2}>
          {decisions
            .filter(d => stocks[d.hotelIndex][localPlayerIndex])
            .map((d, i) => {
              const hotelName = config.hotels[d.hotelIndex].hotelName;
              const owned = stocks[d.hotelIndex][localPlayerIndex];
              const remaining = owned - d.convert * 2 - d.sell;

              return (
                <Box key={i} border="1px solid #ccc" borderRadius={2} p={2}>
                  <Typography fontWeight={600}>{hotelName}</Typography>
                  <Typography variant="body2">You own {owned} shares</Typography>
                  <Stack direction="row" spacing={2} mt={1}>
                    <TextField
                      type="number"
                      label="Convert (2:1)"
                      value={d.convert}
                      onChange={(e) =>
                        updateDecision(d.hotelIndex, "convert", parseInt(e.target.value || "0"))
                      }
                      inputProps={{
                        min: 0,
                        max: Math.floor(owned / 2),
                      }}
                    />
                    <TextField
                      type="number"
                      label="Sell"
                      value={d.sell}
                      onChange={(e) =>
                        updateDecision(d.hotelIndex, "sell", parseInt(e.target.value || "0"))
                      }
                      inputProps={{
                        min: 0,
                        max: owned,
                      }}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" mt={1}>
                    Remaining (kept): {remaining >= 0 ? remaining : 0}
                  </Typography>
                </Box>
              );
            })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={(event) => switchView(event as any)} startIcon={<SwitchRightIcon />} color="inherit">
          Show board
        </Button>

        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={
            decisions.some((d) => d.convert * 2 + d.sell > stocks[d.hotelIndex][localPlayerIndex])
          }>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
