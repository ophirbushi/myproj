import { clone } from '../helpers'
import { State, Tile } from '../models'

export const establishHotel = (state: State, hotelIndex: number, tile: Tile): State => {
  const hotels = clone(state.hotels)
  hotels.push({ hotelIndex, x: tile[0], y: tile[1] })
  return {
    ...state,
    hotels
  }
}
