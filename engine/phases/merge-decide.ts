import { mergeHotels, playerConvertStocks, playerSellStocks } from '../actions'
import { getNextDecidingPlayerIndex } from '../helpers'
import { MergeDecision, Output, State, StockDecision } from '../models'

const applyMergeDecision = (state: State, mergeDecisions: MergeDecision[], output: Output): State => {
  let newState = { ...state }
  for (const decision of mergeDecisions) {
    let stockDecision: StockDecision
    if (decision.sell > 0) {
      stockDecision = { hotelIndex: decision.hotelIndex, amount: decision.sell }
      newState = playerSellStocks(newState, stockDecision, output, newState.decidingPlayerIndex)
    }
    if (decision.convert > 0) {
      stockDecision = { hotelIndex: decision.hotelIndex, amount: decision.convert }
      newState = playerConvertStocks(newState, stockDecision, newState.decidingPlayerIndex, output)
    }
  }
  return newState
}

export const doMergeDecide = (state: State, mergeDecisions: MergeDecision[], output: Output): State => {
  let newState = { ...state }
  newState = {
    ...newState,
    ...applyMergeDecision(newState, mergeDecisions, output),
  }
  let nextDecidingPlayerIndex = getNextDecidingPlayerIndex(newState)
  if (nextDecidingPlayerIndex !== -1) {
    return {
      ...newState,
      decidingPlayerIndex: nextDecidingPlayerIndex
    }
  }
  newState = mergeHotels(newState, output)
  return {
    ...newState,
    phaseId: 'invest'
  }
}
