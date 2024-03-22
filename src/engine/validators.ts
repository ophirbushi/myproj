import { playerBuyStocks } from './actions';
import { clone, getTileByIndex, isTemporarilyIllegalTile } from './helpers';
import { State, StockDecision } from './models';

export const validateInput = (state: State, input: unknown): boolean => {
  let newState = clone(state)
  switch (state.phaseId) {
    case 'build':
      const tileIndex = input as number
      const tile = getTileByIndex(state, tileIndex)
      if (isTemporarilyIllegalTile(state, tile)) {
        return false
      }
      break;
    case 'invest':
      const stockDecisions = input as StockDecision[]
      for (const decision of stockDecisions) {
        newState = playerBuyStocks(newState, decision)
      }
      if (newState.cash.some(c => c < 0)) {
        return false
      }
      const totalDecision = stockDecisions.reduce((acc, decision) => acc + decision.numberOfStocks, 0)
      if (totalDecision > state.config.maxStocksPurchasePerTurn) {
        return false
      }
      if (
        Object.values(newState.stocks)
          .some(hotelStocks => hotelStocks.some(playerStocks => playerStocks > state.config.maxStocks))
      ) {
        return false
      }
      break;

    default:
      break;
  }
  return true
}
