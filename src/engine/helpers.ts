import { State, TileEffect } from './models'

export const getNextDecidingPlayerIndex = (state: State): number => {
  return -1
}

export const getTileByIndex = (state: State, index: number): [number, number] => {
  return state.playerTiles[state.currentPlayerIndex].getHotelTiles[index]
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

export const playerDrawTile = (state: State): State => {
  const tilesPile = clone(state.tilesPile)
  const tile = tilesPile.pop()
  const playerTiles = clone(state.playerTiles)
  if (tile !== undefined) {
    playerTiles[state.currentPlayerIndex].getHotelTiles.push(tile)
  }
  return {
    ...state,
    tilesPile,
    playerTiles
  }
}

export const playerDiscardTile = (state: State, tileIndex: number): State => {
  const playerTiles = clone(state.playerTiles)
  const [tile] = playerTiles[state.currentPlayerIndex].getHotelTiles.splice(tileIndex, 1)
  const discardedTiles = clone(state.discardedTiles)
  if (tile !== undefined) {
    discardedTiles.push(tile)
  }
  return {
    ...state,
    discardedTiles,
    playerTiles
  }
}

export const playerBuildTile = (state: State, tileIndex: number): State => {
  const boardTiles = clone(state.boardTiles)
  const tile = getTileByIndex(state, tileIndex)
  boardTiles.push(tile)
  return {
    ...state,
    ...playerDiscardTile(state, tileIndex),
    boardTiles
  }
}

export const playerReplaceTile = (state: State, tileIndex: number): State => {
  return {
    ...state,
    ...playerDiscardTile(state, tileIndex),
    ...playerDrawTile(state),
  }
}

const isNeighboringTile = (a: [number, number], b: [number, number]): boolean => {
  return Math.abs(a[0] - b[0]) === 1 || Math.abs(a[1] - b[1]) === 1
}

// const iterateTiles = (list: [number, number][], tile: [number, number], result: [number, number][]): [number, number][] => {

// }

export const getHotelTiles = (state: State, hotelIndex: number): [number, number][] => {
  const hotel = state.hotels[hotelIndex]
  const startTile = [hotel.x, hotel.y]




  const hotelTiles: [number, number][] = []

  return hotelTiles
}