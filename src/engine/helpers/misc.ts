import { State, Tile } from '../models'
import { getHotelTilesCount, getNeighboringTiles, getWhichHotelsTilesBelongTo } from './tiles'

export const getNextDecidingPlayerIndex = (state: State): number => {
  return -1
}

export const isGameEnd = (state: State): boolean => {
  return false
}

export const getMergingHotelIndex = (state: State, tile: Tile): number => {
  const neighboringTiles = getNeighboringTiles(state, tile)
  const hotelIndexes = getWhichHotelsTilesBelongTo(state, neighboringTiles)
  const counts = hotelIndexes
    .map(hi => {
      return {
        hotelIndex: hi,
        count: getHotelTilesCount(state, hi)
      }
    })
    .sort((a, b) => {
      return b.count - a.count
    })
    if (counts[0].count === counts[1].count){
      return -1
    }
    return counts[0].hotelIndex
}
