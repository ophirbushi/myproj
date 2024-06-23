import { handPrizes } from '../actions'
import { Output, State } from '../models'

export const doMerge = (state: State, hotelIndex: number, output: Output): State => {
  let newState: State = {
    ...state,
    phaseId: 'mergeDecide',
    mergingHotelIndex: hotelIndex,
    decidingPlayerIndex: state.currentPlayerIndex
  }
  newState = handPrizes(newState, output)
  return newState
}
