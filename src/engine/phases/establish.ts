import { givePlayerStockIfRemaining, playerEstablishHotel } from '../actions'
import { State } from '../models'

export const doEstablish = (state: State, hotelIndex: number): State => {
  let newState = state
  newState = playerEstablishHotel(newState, hotelIndex)
  newState = givePlayerStockIfRemaining(newState, hotelIndex, newState.currentPlayerIndex)
  return {
    ...newState,
    phaseId: 'invest',
  }
}
