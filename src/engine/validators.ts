import { isTemporarilyIllegalTile } from './helpers';
import { State } from './models';

export const validateInput = (state: State, input: any): boolean => {
  switch (state.phaseId) {
    case 'build':
      if (isTemporarilyIllegalTile(state, input)) {
        return false
      }
      break;

    default:
      break;
  }
  return true
}
