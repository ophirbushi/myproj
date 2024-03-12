import { State, Tile } from '../models'
import { getHotelTilesCount, getNeighboringTiles, getWhichHotelsTilesBelongTo } from './tiles'

export const getNextDecidingPlayerIndex = (state: State): number => {
  return -1
}

export const isGameEnd = (state: State): boolean => {
  return false
}

export const isMergeAmbigous = (state: State, tile: Tile): boolean => {
  const neighboringTiles = getNeighboringTiles(state, tile)
  const hotelIndexes = getWhichHotelsTilesBelongTo(state, neighboringTiles)
  if (hotelIndexes.length < 2) {
    return false
  }
  const tileCounts = hotelIndexes
    .map(hi => getHotelTilesCount(state, hi))
    .sort()
  return tileCounts[tileCounts.length - 1] === tileCounts[tileCounts.length - 2]
}
