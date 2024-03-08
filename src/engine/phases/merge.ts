import { getNextDecidingPlayerIndex } from '../helpers'
import { State, Tile } from '../models'

export const doMerge = (state: State, input: Tile): State => {
  return {
    ...state,
    phaseId: 'mergeDecide',
    decidingPlayerIndex: getNextDecidingPlayerIndex(state)
  }
}
