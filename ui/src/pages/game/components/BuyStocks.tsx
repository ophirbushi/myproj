import {
  Box,
  Button,
  Typography,
  Stack,
  IconButton,
  SwipeableDrawer,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import UndoIcon from "@mui/icons-material/Undo";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

interface BuyStocksProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selection: number[]) => void;
  playerCash: number;
  hotelPrices: number[];
  availableStocks: number[];
  hotelNames: string[];
  maxBuyCount?: number;
}

export default function BuyStocks({
  open,
  onClose,
  onConfirm,
  playerCash,
  hotelPrices,
  availableStocks,
  hotelNames,
  maxBuyCount = 3,
}: BuyStocksProps) {
  const hotelCount = hotelPrices.length;
  const [selection, setSelection] = useState<number[]>(Array(hotelCount).fill(0));

  const totalStocks = selection.reduce((a, b) => a + b, 0);
  const totalCost = selection.reduce((sum, count, i) => sum + count * hotelPrices[i], 0);
  const canAfford = totalCost <= playerCash;

  const updateSelection = (i: number, delta: number) => {
    setSelection((prev) => {
      const next = [...prev];
      next[i] = Math.max(0, Math.min(availableStocks[i], next[i] + delta));
      return next;
    });
  };

  const reset = () => setSelection(Array(hotelCount).fill(0));

  const handleConfirm = () => {
    onConfirm(selection);
    reset();
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      PaperProps={{
        sx: { p: 2, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
      }}
    >
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">Buy Stocks</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" mb={1}>
          💵 Cash: ${playerCash} | 🧾 Total: ${totalCost} | 🧮 Remaining: ${playerCash - totalCost}
        </Typography>

        <Stack spacing={1} mb={2}>
          {hotelPrices.map((price, i) => (
            <Box key={i} display="flex" alignItems="center" justifyContent="space-between">
              <Typography>
                {hotelNames[i]} — ${price} × {selection[i]} = ${selection[i] * price}
              </Typography>
              <Box>
                <IconButton
                  size="small"
                  disabled={selection[i] === 0}
                  onClick={() => updateSelection(i, -1)}
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={
                    selection[i] >= availableStocks[i] ||
                    totalStocks >= maxBuyCount ||
                    totalCost + price > playerCash
                  }
                  onClick={() => updateSelection(i, +1)}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>

        <Box display="flex" justifyContent="space-between">
          <Button onClick={reset} startIcon={<UndoIcon />} color="inherit">
            Clear
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={!canAfford || totalStocks === 0}
          >
            Confirm Purchase
          </Button>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
}
