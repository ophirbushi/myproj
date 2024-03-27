import { clone, getTileByIndex } from '../helpers'
import { State } from '../models'

export const playerDrawTile = (state: State, playerIndex: number): State => {
  const tilesPile = clone(state.tilesPile)
  const tile = tilesPile.pop()
  const playerTiles = clone(state.playerTiles)
  if (tile !== undefined) {
    playerTiles[playerIndex].tiles.push(tile)
  }
  return {
    ...state,
    tilesPile,
    playerTiles
  }
}

export const playerDiscardTile = (state: State, playerIndex: number, tileIndex: number): State => {
  const playerTiles = clone(state.playerTiles)
  const [tile] = playerTiles[playerIndex].tiles.splice(tileIndex, 1)
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

export const playerBuildTile = (state: State, playerIndex: number, tileIndex: number): State => {
  const boardTiles = clone(state.boardTiles)
  const tile = getTileByIndex(state, playerIndex, tileIndex)
  boardTiles.push(tile)
  return {
    ...state,
    ...playerDiscardTile(state, playerIndex, tileIndex),
    boardTiles
  }
}

export const playerReplaceTile = (state: State, playerIndex: number, tileIndex: number): State => {
  let newState = state
  newState = playerDiscardTile(newState, playerIndex, tileIndex)
  newState = playerDrawTile(newState, playerIndex)
  return newState
}
