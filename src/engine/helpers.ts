import { State, Tile, TileEffect } from './models'

export const getNextDecidingPlayerIndex = (state: State): number => {
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

export const isGameEnd = (state: State): boolean => {
  return false
}

export const isEqualTiles = (a: Tile, b: Tile): boolean => {
  return a[0] === b[0] && a[1] === b[1]
}

export const clone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

export const distinct = <T>(array: T[]): T[] => {
  return array.filter((value, index, list) => list.indexOf(value) === index)
}

const isNeighboringTile = (a: Tile, b: Tile): boolean => {
  return (
    (Math.abs(a[0] - b[0]) === 1 && a[1] === b[1]) ||
    (Math.abs(a[1] - b[1]) === 1 && a[0] === b[0])
  )
}

const getNeighboringTiles = (state: State, tile: Tile): Tile[] => {
  return state.boardTiles.filter((t) => isNeighboringTile(t, tile))
}

export const getTileGroup = (state: State, tile: Tile): Tile[] => {
  const recursiveIterate = (state: State, queue: Tile[], result: Tile[]): Tile[] => {
    const next = queue.pop()
    if (!next) {
      return result
    }
    const unexploredNeighboringTiles = state.boardTiles
      .filter((tile) => isNeighboringTile(tile, next))
      .filter((neighboringTile) => !result.some((resultTile) => isEqualTiles(resultTile, neighboringTile)))
    result.push(...unexploredNeighboringTiles)
    queue.push(...unexploredNeighboringTiles)
    return recursiveIterate(state, queue, result)
  }
  return recursiveIterate(state, [tile], [tile])
}

export const getHotelTiles = (state: State, hotelIndex: number): Tile[] => {
  const hotel = state.hotels[hotelIndex]
  const startTile: Tile = [hotel.x, hotel.y]
  return getTileGroup(state, startTile)
}

export const getWhichHotelTileBelongsTo = (state: State, tile: Tile): number => {
  const tileGroup = getTileGroup(state, tile)
  for (let i = 0; i < state.hotels.length; i++) {
    const hotel = state.hotels[i]
    const hotelTile: Tile = [hotel.x, hotel.y]
    if (tileGroup.some(t => isEqualTiles(t, hotelTile))) {
      return i
    }
  }
  return -1
}

export const getHotelTilesCount = (state: State, hotelIndex: number): number => {
  return getHotelTiles(state, hotelIndex).length
}

export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
