import { givePlayerStockIfRemaining, playerEstablishHotel } from '../actions'
import { Output, State } from '../models'

export const doEstablish = (state: State, hotelIndex: number, output: Output): State => {
  let newState = state
  newState = playerEstablishHotel(newState, hotelIndex)
  output.broadcast({ code: 5, state, log: `<current-player> established ${state.config.hotels[hotelIndex].hotelName}` })
  newState = givePlayerStockIfRemaining(newState, hotelIndex, newState.currentPlayerIndex)
  return {
    ...newState,
    phaseId: 'invest',
  }
}
