import { nextPlayer } from '../actions'
import { State, Tile } from '../models'

export const doInvest = (state: State, input: Tile): State => {
  return {
    ...state,
    ...nextPlayer(state),
    phaseId: 'build'
  }
}
