import { State } from '../../../../../engine/models';
import { LocalPlayerIndex } from '../models/game.models';

export const getActivePlayerIndex = (gameState: State): number => {
  const { phaseId, currentPlayerIndex, decidingPlayerIndex } = gameState;
  const activeIndex = phaseId === "mergeDecide" ? decidingPlayerIndex : currentPlayerIndex;
  return activeIndex;
};

export const getIsLocalPlayerTurn = (
  gameState: State,
  localPlayerIndex: LocalPlayerIndex
): boolean => {
  if (localPlayerIndex === "all") {
    return true;
  }
  if (localPlayerIndex == null) {
    return false;
  }
  const activeIndex = getActivePlayerIndex(gameState);
  return activeIndex === localPlayerIndex;
}
