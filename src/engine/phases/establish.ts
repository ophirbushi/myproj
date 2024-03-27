import { givePlayerStockIfRemaining } from '../actions'
import { establishHotel } from '../actions/hotels'
import { getLastPlayedTile } from '../helpers'
import { State } from '../models'

export const doEstablish = (state: State, hotelIndex: number): State => {
  let newState = state
  const tile = getLastPlayedTile(state)
  newState = establishHotel(newState, hotelIndex, tile)
  newState = givePlayerStockIfRemaining(newState, hotelIndex, newState.currentPlayerIndex)
  return {
    ...newState,
    phaseId: 'invest'
  }
}
