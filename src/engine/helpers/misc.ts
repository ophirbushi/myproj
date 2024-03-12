import { State, Tile } from '../models'
import { getHotelTilesCount, getNeighboringTiles, getWhichHotelTileBelongsTo } from './tiles'
import { distinct } from './utils'

export const getNextDecidingPlayerIndex = (state: State): number => {
  return -1
}

export const isGameEnd = (state: State): boolean => {
  return false
}

export const isMergeAmbigous = (state: State, tile: Tile): boolean => {
  const neighboringTiles = getNeighboringTiles(state, tile)
  const hotelIndexes = distinct(neighboringTiles.map(t => getWhichHotelTileBelongsTo(state, t)))
    .filter(hi => hi > -1)
  if (hotelIndexes.length < 2) {
    return false
  }
  const hotelTileCounts = hotelIndexes.map(hi => getHotelTilesCount(state, hi))
  hotelTileCounts.sort()
  return hotelTileCounts[hotelTileCounts.length - 1] === hotelTileCounts[hotelTileCounts.length - 2]
}
