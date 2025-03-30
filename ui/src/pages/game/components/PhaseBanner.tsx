import { Box } from '@mui/material';
import { Phase, type State } from '../../../../../engine/models';
import { LocalPlayerIndex } from '../models/game.models';
import { useMemo } from 'react';
import { getActivePlayerIndex, getIsLocalPlayerTurn } from '../utils/localPlayer';

const textMap: { [phaseId in Phase]: string } = {
  build: "place a tile",
  establish: "choose a hotel to found",
  merge: "merger in progress",
  mergeDecide: "resolve merger stock decisions",
  invest: "buy stocks",
  gameEnd: "Game over"
};

export default function PhaseBanner(
  { gameState, localPlayerIndex }: { gameState: State, localPlayerIndex: LocalPlayerIndex }
) {
  const derivedState = useMemo(() => {
    const activePlayerIndex = getActivePlayerIndex(gameState);
    const isLocalPlayerTurn = getIsLocalPlayerTurn(gameState, localPlayerIndex);
    const phaseText = textMap[gameState.phaseId];
    let text = ''
    if (isLocalPlayerTurn) {
      text = `It's your turn, ${phaseText}.`;
    } else {
      text = `It's P${activePlayerIndex + 1}'s turn to ${phaseText}.`;
    }
    return {
      text
    };
  }, [gameState, localPlayerIndex]);

  return <Box textAlign={'center'} padding={2} sx={{ userSelect: 'none' }}>
    {derivedState.text}
  </Box>
}
