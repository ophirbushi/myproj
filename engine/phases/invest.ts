import { nextTurn, playerBuyStocks, playerDrawTile } from '../actions'
import { Output, State, StockDecision } from '../models'

export const doInvest = (state: State, input: StockDecision[], output: Output): State => {
  let newState = state;
  for (const decision of input) {
    newState = playerBuyStocks(newState, decision, output)
  }
  newState = playerDrawTile(newState, output)
  return nextTurn(newState, output)
}
