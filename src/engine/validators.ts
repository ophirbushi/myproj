import { getTileByIndex, isTemporarilyIllegalTile } from './helpers';
import { State } from './models';

export const validateInput = (state: State, input: unknown): boolean => {
  switch (state.phaseId) {
    case 'build':
      const tileIndex = input as number
      const tile = getTileByIndex(state, tileIndex)
      if (isTemporarilyIllegalTile(state, tile)) {
        return false
      }
      break;

    default:
      break;
  }
  return true
}
