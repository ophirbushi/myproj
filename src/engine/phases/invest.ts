import { nextTurn, playerBuyStocks } from '../actions'
import { playerDrawTile } from '../actions/tiles'
import { State, StockDecision } from '../models'

export const doInvest = (state: State, input: StockDecision[]): State => {
  let newState = state
  for (const decision of input) {
    newState = playerBuyStocks(newState, decision)
  }
  newState = playerDrawTile(newState, state.currentPlayerIndex)
  return nextTurn(newState)
}
