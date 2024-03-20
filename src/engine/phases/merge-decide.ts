import { mergeHotels } from '../actions'
import { getNextDecidingPlayerIndex } from '../helpers'
import { State, Tile } from '../models'

const applyMergeDecision = (state: State, tile: Tile): State => {
  return state
}

export const doMergeDecide = (state: State, tile: Tile): State => {
  state = {
    ...state,
    ...applyMergeDecision(state, tile),
  }
  let nextDecidingPlayerIndex = getNextDecidingPlayerIndex(state)
  if (nextDecidingPlayerIndex !== -1) {
    return {
      ...state,
      decidingPlayerIndex: nextDecidingPlayerIndex
    }
  }
  return {
    ...state,
    ...mergeHotels(state),
    phaseId: 'invest'
  }
}
