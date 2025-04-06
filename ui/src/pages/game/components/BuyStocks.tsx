import {
  Box,
  Button,
  Typography,
  Stack,
  IconButton,
  SwipeableDrawer,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import UndoIcon from "@mui/icons-material/Undo";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useMemo, useState } from "react";
import { State, StockDecision } from '../../../../../engine/models';
import { getHotelStockPrice, getHowManyStocksLeftForHotel, hotelExistsOnBoard } from '../../../../../engine/helpers';

interface BuyStocksProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (decisions: StockDecision[]) => void;
  gameState: State;
  localPlayerIndex: number;
  isMobile: boolean;
}

export default function BuyStocks({
  open,
  onClose,
  onConfirm,
  gameState,
  localPlayerIndex,
  isMobile
}: BuyStocksProps) {

  const { hotelPrices, playerCash, availableStocks, hotelCount, hotelNames, maxBuyCount } = useMemo(() => {
    let hotelPrices: number[] = [];
    let playerCash: number = 0;
    let hotelCount = 0;
    let availableStocks: number[] = [];
    let hotelNames: string[] = [];
    let maxBuyCount = 0;

    if (!gameState || localPlayerIndex < 0) {
      return {
        hotelPrices,
        playerCash,
        availableStocks,
        hotelCount,
        hotelNames,
        maxBuyCount
      };
    }
    hotelCount = gameState.config.hotels.length;
    playerCash = gameState.cash[localPlayerIndex];
    hotelNames = gameState.config.hotels.map(hotel => hotel.hotelName);
    maxBuyCount = gameState.config.maxStocksPurchasePerTurn;
    availableStocks = gameState.config.hotels.map((_, hotelIndex) => {
      return getHowManyStocksLeftForHotel(gameState, hotelIndex);
    });
    hotelPrices = gameState.config.hotels
      .map((_, hotelIndex) => {
        if (!hotelExistsOnBoard(gameState, hotelIndex)) {
          return 0;
        }
        return getHotelStockPrice(gameState, hotelIndex);
      });

    return {
      hotelPrices,
      playerCash,
      availableStocks,
      hotelCount,
      hotelNames,
      maxBuyCount
    };
  }, [gameState, localPlayerIndex]);
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

  useEffect(() => {
    reset();
  }, [gameState, localPlayerIndex]);

  const handleConfirm = () => {
    const stockDecisions = selection.map<StockDecision>((amount, hotelIndex) => ({
      hotelIndex,
      amount
    })).filter((decision => decision.amount > 0));
    onConfirm(stockDecisions);
    reset();
  };

  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={() => { }}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12
            }
          }
        }}
      >
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Buy Stocks</Typography>
            {/* <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton> */}
          </Box>

          <Typography variant="body2" mb={1}>
            💵 Cash: ${playerCash} | 🧾 Total: ${totalCost} | 🧮 Remaining: ${playerCash - totalCost}
          </Typography>

          <Stack spacing={1} mb={2}>
            {hotelPrices.map((price, i) => (
              price ?
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
                </Box> : null
            ))}
          </Stack>

          <Box display="flex" justifyContent="space-between">
            <Button onClick={reset} startIcon={<UndoIcon />} color="inherit">
              Clear
            </Button>
            <Button
              onClick={handleConfirm}
              variant="contained"
              disabled={!canAfford}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    );
  }

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }} aria-labelledby="buy-stocks-modal-title"
      aria-describedby="buy-stocks-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 500,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="buy-stocks-modal-title" variant="h6">Buy Stocks</Typography>
          {/* <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton> */}
        </Box>

        <Typography id="buy-stocks-modal-description" variant="body2" mb={2}>
          💵 Cash: ${playerCash} | 🧾 Total: ${totalCost} | 🧮 Remaining: ${playerCash - totalCost}
        </Typography>

        <Stack spacing={2} mb={3}>
          {hotelPrices.map((price, i) => (
            price ?
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
              </Box> : null
          ))}
        </Stack>

        <Box display="flex" justifyContent="space-between">
          <Button onClick={reset} startIcon={<UndoIcon />} color="inherit">
            Clear
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={!canAfford}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
