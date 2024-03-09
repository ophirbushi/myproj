import { nextPlayer, playerDrawTile } from '../actions'
import { State, Tile } from '../models'

export const doInvest = (state: State, input: Tile): State => {
  let newState = state;
  newState = playerDrawTile(newState)
  newState = nextPlayer(newState)
  return {
    ...newState,
    phaseId: 'build'
  }
}
