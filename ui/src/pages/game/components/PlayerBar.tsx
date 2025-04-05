import { Box, Typography, Chip, Paper, Stack } from "@mui/material";
import { LocalPlayerIndex } from '../models/game.models';
import { State } from '../../../../../engine/models';
import { useMemo } from 'react';
import { getShortenedHotelName } from '../utils/hotelUtils';

interface PlayerBarProps {
  gameState: State;
  localPlayerIndex: LocalPlayerIndex;
}

export default function PlayerBar({
  gameState,
  localPlayerIndex,
}: PlayerBarProps) {
  const players: null[] = new Array(gameState.config.numberOfPlayers).fill(null);

  const playerData = useMemo(() => {
    return players.map((_, index) => {
      const isYou = localPlayerIndex === "all" || localPlayerIndex === index;
      const isActive = gameState.currentPlayerIndex === index;
      const playerName = `Player ${index + 1}`;
      const playerCash = gameState.cash[index];
      const playerStocks = Object.entries(gameState.stocks).map(([hotelIndex, stockCounts]) => ({
        hotelIndex: Number(hotelIndex),
        count: stockCounts[index],
      }));
      const hotelNames = gameState.config.hotels.map(h => getShortenedHotelName(h.hotelName));
      return { isYou, isActive, playerName, playerCash, playerStocks, hotelNames };
    });
  }, [gameState, localPlayerIndex, players]);


  return (
    <Paper elevation={1} sx={{ px: 2, py: 1, overflowX: "auto" }}>
      <Stack direction="row" spacing={2}>
        {playerData.map(({ isYou, isActive, playerName, playerCash, playerStocks, hotelNames }, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            minWidth={120}
            p={1}
            border={isActive ? "2px solid #1976d2" : "1px solid #ccc"}
            borderRadius={1}
            bgcolor={isYou ? "primary.light" : "background.paper"}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {playerName} {isYou && "(You)"}
            </Typography>
            <Typography variant="body2">💵 ${playerCash}</Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
              {playerStocks.map(({ hotelIndex, count }) =>
                count > 0 ? (
                  <Chip
                    key={hotelIndex}
                    size="small"
                    label={`${hotelNames[hotelIndex]}: ${count}`}
                  />
                ) : null
              )}
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
