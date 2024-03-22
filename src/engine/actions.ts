import { clone, getLastPlayedTile, getTileByIndex, getWhichHotelsInvolvedInMerge } from './helpers'
import { State } from './models'

export const playerDrawTile = (state: State): State => {
  const tilesPile = clone(state.tilesPile)
  const tile = tilesPile.pop()
  const playerTiles = clone(state.playerTiles)
  if (tile !== undefined) {
    playerTiles[state.currentPlayerIndex].tiles.push(tile)
  }
  return {
    ...state,
    tilesPile,
    playerTiles
  }
}

export const playerDiscardTile = (state: State, tileIndex: number): State => {
  const playerTiles = clone(state.playerTiles)
  const [tile] = playerTiles[state.currentPlayerIndex].tiles.splice(tileIndex, 1)
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
  let newState = state
  newState = playerDiscardTile(newState, tileIndex)
  newState = playerDrawTile(newState)
  return newState
}

export const playerEstablishHotel = (state: State, hotelIndex: number): State => {
  const hotels = clone(state.hotels)
  const tile = getLastPlayedTile(state)
  hotels.push({ hotelIndex, x: tile[0], y: tile[1] })
  return {
    ...state,
    hotels
  }
}

export const mergeHotels = (state: State): State => {
  const lastTile = getLastPlayedTile(state)
  const hotelsInvolvedInMerge = getWhichHotelsInvolvedInMerge(state, lastTile)
  const hotels = clone(state.hotels).filter((hotel) => {
    if (hotel.hotelIndex === state.mergingHotelIndex) {
      return true
    }
    return !hotelsInvolvedInMerge.includes(hotel.hotelIndex)
  })
  return {
    ...state,
    hotels
  }
}

export const nextPlayer = (state: State): State => {
  return {
    ...state,
    currentPlayerIndex: (state.currentPlayerIndex + 1) % state.playerTiles.length
  }
}