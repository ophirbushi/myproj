import { playerBuyStocks } from './actions'
import { clone, getLastPlayedTile, getTileByIndex, getHotelsInvolvedInMerge, isPossibleGameEnd, isTemporarilyIllegalTile, getHowManyStocksLeftForHotel } from './helpers'
import { Input, MergeDecision, Output, OutputMessageCode, State, StockDecision } from './models'
import { doMergeDecide } from './phases/merge-decide'

const noopOutput: Output = { broadcast: () => { } }

export const validateInput = (state: State, input: Input<any>, output: Output): boolean => {
  let newState = clone(state)

  const { currentPlayerIndex, decidingPlayerIndex, phaseId } = newState
  console.log()
  console.log('validateInput', { input, phaseId, currentPlayerIndex, decidingPlayerIndex })
  console.log()

  if (newState.phaseId !== 'mergeDecide' && input.playerIndex !== newState.currentPlayerIndex) {
    output.broadcast({
      state,
      code: OutputMessageCode.INVALID_INPUT,
      log: `Invalid input - expected playerIndex to be currentPlayerIndex (${newState.currentPlayerIndex}),`
        + ` but got index ${input.playerIndex} instead.`
    })
    return false;
  }

  if (newState.phaseId === 'mergeDecide' && input.playerIndex !== newState.decidingPlayerIndex) {
    output.broadcast({
      state,
      code: OutputMessageCode.INVALID_INPUT,
      log: `Invalid input - expected playerIndex to be decidingPlayerIndex (${newState.decidingPlayerIndex}),`
        + ` but got index ${input.playerIndex} instead.`
    })
    return false;
  }

  switch (newState.phaseId) {
    case 'build':
      if (isPossibleGameEnd(state) && input.data === 'finish') {
        return true
      }
      const tileIndex = input.data as number
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
      const mergeDecisions = input.data as MergeDecision[]
      if (!Array.isArray(mergeDecisions)) {
        return false
      }
      const hotelsInvolvedInMerge = getHotelsInvolvedInMerge(newState, getLastPlayedTile(newState))
      if (mergeDecisions.some(d => !hotelsInvolvedInMerge.includes(d.hotelIndex))) {
        return false
      }
      if (mergeDecisions.some(d => d.hotelIndex === newState.mergingHotelIndex)) {
        return false
      }
      if (mergeDecisions.some(d => d.convert && d.convert % 2 !== 0)) {
        return false
      }
      newState = doMergeDecide(newState, mergeDecisions, noopOutput)
      if (
        Object.values(newState.stocks)
          .some(hotelStocks => hotelStocks.some(playerStocks => playerStocks > newState.config.maxStocks))
      ) {
        return false
      }
      if (Object.values(newState.stocks).some(stocks => stocks.some(s => s < 0))) {
        return false
      }
      break
    case 'invest':
      const stockDecisions = input.data as StockDecision[]
      if (!Array.isArray(stockDecisions)) {
        return false
      }
      for (const decision of stockDecisions) {
        newState = playerBuyStocks(newState, decision, noopOutput)
      }
      if (newState.cash.some(c => c < 0)) {
        return false
      }
      const totalDecision = stockDecisions.reduce((acc, decision) => acc + decision.amount, 0)
      if (totalDecision > newState.config.maxStocksPurchasePerTurn) {
        return false
      }
      break
    case 'establish':
      const hotelIndex = input.data as number
      if (
        typeof hotelIndex !== 'number' ||
        isNaN(hotelIndex) ||
        !Number.isInteger(hotelIndex) ||
        hotelIndex < 0 ||
        newState.hotels.some(h => h.hotelIndex === hotelIndex)
      ) {
        return false
      }
      break

    default:
      break
  }
  if (newState.config.hotels.some((_, hotelIndex) => getHowManyStocksLeftForHotel(newState, hotelIndex) < 0)) {
    return false
  }
  return true
}
