import { mergeHotels, playerConvertStocks, playerSellStocks } from '../actions'
import { getNextDecidingPlayerIndex } from '../helpers'
import { MergeDecision, State, StockDecision } from '../models'

const applyMergeDecision = (state: State, mergeDecisions: MergeDecision[]): State => {
  let newState = state
  for (const decision of mergeDecisions) {
    let stockDecision: StockDecision
    if (decision.sell > 0) {
      stockDecision = { hotelIndex: decision.hotelIndex, amount: decision.sell }
      newState = playerSellStocks(newState, stockDecision, state.decidingPlayerIndex)
    }
    if (decision.convert > 0) {
      stockDecision = { hotelIndex: decision.hotelIndex, amount: decision.convert }
      newState = playerConvertStocks(newState, stockDecision, state.decidingPlayerIndex)
    }
  }
  return newState
}

export const doMergeDecide = (state: State, mergeDecisions: MergeDecision[]): State => {
  state = {
    ...state,
    ...applyMergeDecision(state, mergeDecisions),
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
