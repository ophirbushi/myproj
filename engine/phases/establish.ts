import { givePlayerStockIfRemaining, playerEstablishHotel } from '../actions'
import { Output, State } from '../models'

export const doEstablish = (state: State, hotelIndex: number, output: Output): State => {
  let newState = state
  newState = playerEstablishHotel(newState, hotelIndex, output)
  newState = givePlayerStockIfRemaining(newState, hotelIndex, newState.currentPlayerIndex, output)
  return {
    ...newState,
    phaseId: 'invest',
  }
}
