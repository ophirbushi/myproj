import { State, Tile, TileEffect } from '../models'
import { getMergingHotelIndex } from './misc'
import { distinct } from './utils'

const isNeighboringTile = (a: Tile, b: Tile): boolean => {
  return (
    (Math.abs(a[0] - b[0]) === 1 && a[1] === b[1]) ||
    (Math.abs(a[1] - b[1]) === 1 && a[0] === b[0])
  )
}

export const getHotelsInvolvedInMerge = (state: State, tile: Tile): number[] => {
  const neighboringTiles = getNeighboringTiles(state, tile)
  const hotelIndexes = getWhichHotelsTilesBelongTo(state, neighboringTiles)
  return distinct(hotelIndexes).filter((hi) => hi > -1)
}

/** Get all hotels who are going to be merged into the merging hotel */
export const getDissolvingHotels = (state: State, tile: Tile): number[] => {
  return getHotelsInvolvedInMerge(state, tile)
    .filter(hi => hi !== state.mergingHotelIndex)
}

export const getNeighboringTiles = (state: State, tile: Tile): Tile[] => {
  return state.boardTiles.filter((t) => isNeighboringTile(t, tile))
}

export const getLastPlayedTile = (state: State): Tile => {
  return state.boardTiles[state.boardTiles.length - 1]
}

const isMergingTile = (state: State, tile: Tile): boolean => {
  if (state.phaseId !== 'merge' && state.phaseId !== 'mergeDecide') {
    return false
  }
  const lastTile = getLastPlayedTile(state)
  return isEqualTiles(lastTile, tile)
}

export const getTileGroup = (state: State, tile: Tile): Tile[] => {
  if (!state.boardTiles.some(t => isEqualTiles(tile, t))) {
    return []
  }
  const recursiveIterate = (state: State, queue: Tile[], result: Tile[]): Tile[] => {
    const next = queue.pop()
    if (!next) {
      return result
    }
    const unexploredNeighboringTiles = state.boardTiles
      .filter((tile) => isNeighboringTile(tile, next))
      .filter((neighboringTile) => !result.some((resultTile) => isEqualTiles(resultTile, neighboringTile)))
      .filter((tile => !isMergingTile(state, tile)))
    result.push(...unexploredNeighboringTiles)
    queue.push(...unexploredNeighboringTiles)
    return recursiveIterate(state, queue, result)
  }
  return recursiveIterate(state, [tile], [tile])
}

export const getHotelTiles = (state: State, hotelIndex: number): Tile[] => {
  const hotel = state.hotels.find(h => h.hotelIndex === hotelIndex)
  const startTile: Tile = [hotel!.x, hotel!.y]
  return getTileGroup(state, startTile)
}

export const getHotelSize = (state: State, hotelIndex: number): number => {
  return getHotelTiles(state, hotelIndex).length
}

export const getHotelPrestige = (state: State, hotelIndex: number): number => {
  return state.config.hotels[hotelIndex].prestige
}

export const getWhichHotelTileBelongsTo = (state: State, tile: Tile): number => {
  if (isMergingTile(state, tile)) {
    return -1
  }
  const tileGroup = getTileGroup(state, tile)
  const hotel = state.hotels.find((h) => {
    const hotelTile: Tile = [h.x, h.y]
    return tileGroup.some(t => isEqualTiles(t, hotelTile))
  })
  if (hotel) {
    return hotel.hotelIndex
  }
  return -1
}

export const getTileByIndex = (state: State, index: number): Tile => {
  return state.playerTiles[state.currentPlayerIndex].tiles[index]
}

export const getTileEffect = (state: State, tile: Tile): TileEffect => {
  const neighboringTiles = getNeighboringTiles(state, tile)
  const hotelIndexes = distinct(
    neighboringTiles
      .map((t) => getWhichHotelTileBelongsTo(state, t))
      .filter((hotelIndex) => hotelIndex > -1)
  )
  if (neighboringTiles.length && !hotelIndexes.length) {
    return 'establish'
  }
  if (hotelIndexes.length > 1) {
    return 'merge'
  }
  return 'noop'
}

export const isEqualTiles = (a: Tile, b: Tile): boolean => {
  return a[0] === b[0] && a[1] === b[1]
}

/** Not including neutral hotels (index -1) */
export const getWhichHotelsTilesBelongTo = (state: State, tiles: Tile[]): number[] => {
  return distinct(
    tiles
      .map(t => getWhichHotelTileBelongsTo(state, t))
      .filter(hi => hi > -1)
  )
}

export const isTemporarilyIllegalTile = (state: State, tile: Tile): boolean => {
  const tileEffect = getTileEffect(state, tile)
  if (tileEffect === 'establish') {
    return (
      state.hotels.length === state.config.hotels.length &&
      state.hotels.some(h => getHotelSize(state, h.hotelIndex) < state.config.unmergableHotelSize)
    )
  }
  return false
}

export const isPermanentlyIllegalTile = (state: State, tile: Tile): boolean => {
  const tileEffect = getTileEffect(state, tile)
  if (tileEffect === 'establish') {
    return (
      state.hotels.length === state.config.hotels.length &&
      state.hotels.every(h => getHotelSize(state, h.hotelIndex) >= state.config.unmergableHotelSize)
    )
  } else if (tileEffect === 'merge') {
    const hotelsInvolvedInMerge = getHotelsInvolvedInMerge(state, tile)
    const hotelSizes = hotelsInvolvedInMerge.map(hi => getHotelSize(state, hi))
    const overTheLimitHotels = hotelSizes.filter(hs => hs >= state.config.unmergableHotelSize)
    return overTheLimitHotels.length >= 2
  }
  return false
}