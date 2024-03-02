import { getNextDecidingPlayerIndex } from '../helpers'
import { State } from '../models'

const applyMergeDecision = (state: State, input: [number, number]): State => {
  return state
}

export const doMergeDecide = (state: State, input: [number, number]): State => {
  state = {
    ...state,
    ...applyMergeDecision(state, input),
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
    phaseId: 'invest'
  }
}
