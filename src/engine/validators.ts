import { playerBuyStocks } from './actions'
import { clone, getLastPlayedTile, getTileByIndex, getWhichHotelsInvolvedInMerge, isTemporarilyIllegalTile } from './helpers'
import { MergeDecision, State, StockDecision } from './models'
import { doMergeDecide } from './phases/merge-decide'

export const validateInput = (state: State, input: unknown): boolean => {
  let newState = clone(state)
  switch (newState.phaseId) {
    case 'build':
      const tileIndex = input as number
      if (
        typeof tileIndex !== 'number' ||
        isNaN(tileIndex) ||
        !Number.isInteger(tileIndex) ||
        tileIndex < 0 ||
        tileIndex >= newState.playerTiles[newState.currentPlayerIndex].tiles.length
      ) {
        return false
      }
      const tile = getTileByIndex(newState, tileIndex)
      if (isTemporarilyIllegalTile(newState, tile)) {
        return false
      }
      break
    case 'mergeDecide':
      const mergeDecisions = input as MergeDecision[]
      if (!Array.isArray(mergeDecisions)) {
        return false
      }
      const hotelsInvolvedInMerge = getWhichHotelsInvolvedInMerge(newState, getLastPlayedTile(newState))
      if (mergeDecisions.some(d => !hotelsInvolvedInMerge.includes(d.hotelIndex))) {
        return false
      }
      if (mergeDecisions.some(d => d.hotelIndex === newState.mergingHotelIndex)) {
        return false
      }
      newState = doMergeDecide(newState, mergeDecisions)
      if (
        Object.values(newState.stocks)
          .some(hotelStocks => hotelStocks.some(playerStocks => playerStocks > newState.config.maxStocks))
      ) {
        return false
      }
      break
    case 'invest':
      const stockDecisions = input as StockDecision[]
      if (!Array.isArray(stockDecisions)) {
        return false
      }
      for (const decision of stockDecisions) {
        newState = playerBuyStocks(newState, decision)
      }
      if (newState.cash.some(c => c < 0)) {
        return false
      }
      const totalDecision = stockDecisions.reduce((acc, decision) => acc + decision.amount, 0)
      if (totalDecision > newState.config.maxStocksPurchasePerTurn) {
        return false
      }
      if (
        Object.values(newState.stocks)
          .some(hotelStocks => hotelStocks.some(playerStocks => playerStocks > newState.config.maxStocks))
      ) {
        return false
      }
      break

    default:
      break
  }
  return true
}
