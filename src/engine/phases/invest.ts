import { nextTurn, playerBuyStocks, playerDrawTile } from '../actions'
import { State, StockDecision } from '../models'

export const doInvest = (state: State, input: StockDecision[]): State => {
  let newState = state;
  for (const decision of input) {
    newState = playerBuyStocks(newState, decision)
  }
  newState = playerDrawTile(newState)
  return nextTurn(newState)
}
