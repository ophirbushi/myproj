import { State, TileEffect } from './models'

export const getNextDecidingPlayerIndex = (state: State): number => {
  return -1
}

export const getTileByIndex = (state: State, index: number): [number, number] => {
  return state.playerTiles[state.currentPlayerIndex].tiles[index]
}

export const getTileEffect = (state: State, input: [number, number]): TileEffect => {
  return 'noop'
}

export const isGameEnd = (state: State): boolean => {
  return false
}

export const isEqualTiles = (a: [number, number], b: [number, number]): boolean => {
  return a[0] === b[0] && a[1] === b[1]
}

export const clone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

const isNeighboringTile = (a: [number, number], b: [number, number]): boolean => {
  return Math.abs(a[0] - b[0]) === 1 || Math.abs(a[1] - b[1]) === 1
}

export const getHotelTiles = (state: State, hotelIndex: number): [number, number][] => {
  const hotel = state.hotels[hotelIndex]
  const startTile: [number, number] = [hotel.x, hotel.y]
  const recursiveIterate = (state: State, queue: [number, number][], result: [number, number][]): [number, number][] => {
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
  return recursiveIterate(state, [startTile], [startTile])
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
