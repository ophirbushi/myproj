import { Box } from '@mui/material';
import { Phase, type State } from '../../../../../engine/models';
import { LocalPlayerIndex } from '../models/game.models';
import { useMemo } from 'react';
import { getActivePlayerIndex } from '../utils/localPlayer';

const textMap: { [phaseId in Phase]: string } = {
  build: "place a tile",
  establish: "choose a hotel to found",
  merge: "choose the surviving hotel",
  mergeDecide: "resolve merger stock decisions",
  invest: "buy stocks",
  gameEnd: "Game over"
};

export default function PhaseBanner(
  { gameState, localPlayerIndex }: { gameState: State, localPlayerIndex: LocalPlayerIndex }
) {
  const { text, activePlayerIndex } = useMemo(() => {
    const activePlayerIndex = getActivePlayerIndex(gameState);
    const phaseText = textMap[gameState.phaseId];
    const playerName = activePlayerIndex === localPlayerIndex ? 'your' : `Player ${activePlayerIndex + 1}'s`;
    return {
      activePlayerIndex,
      text: `It's ${playerName} turn to ${phaseText}.`
    };
  }, [gameState, localPlayerIndex]);

  return (
    <div className={"turn-indicator" + (localPlayerIndex === activePlayerIndex ? ' turn-indicator-active' : '')}>
      <span>{text}</span>
    </div>
  );

}
