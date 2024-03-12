import { getNextDecidingPlayerIndex } from '../helpers'
import { State } from '../models'

export const doMerge = (state: State, hotelIndex: number): State => {
  return {
    ...state,
    phaseId: 'mergeDecide',
    decidingPlayerIndex: getNextDecidingPlayerIndex(state)
  }
}
