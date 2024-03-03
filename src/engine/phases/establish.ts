import { clone } from '../helpers'
import { State } from '../models'

export const doEstablish = (state: State, input: number): State => {
  const hotels = clone(state.hotels)
  const tile = state.boardTiles[state.boardTiles.length - 1]
  hotels.push({ hotelIndex: input, x: tile[0], y: tile[1] })
  return {
    ...state,
    hotels,
    phaseId: 'invest',
  }
}
