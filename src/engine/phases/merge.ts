import { handPrizes } from '../actions'
import { State } from '../models'

export const doMerge = (state: State, hotelIndex: number): State => {
  let newState: State = {
    ...state,
    phaseId: 'mergeDecide',
    mergingHotelIndex: hotelIndex,
    decidingPlayerIndex: state.currentPlayerIndex
  }
  newState = handPrizes(newState)
  return newState
}
