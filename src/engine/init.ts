import { playerBuildTile, playerDrawTile } from './actions'
import { shuffleArray } from './helpers'
import { Config, Output, State, Tile } from './models'

const initCash = (state: State): State => {
  const cash: number[] = []
  for (let i = 0; i < state.config.numberOfPlayers; i++) {
    cash[i] = state.config.initCashPerPlayer
  }
  return { ...state, cash }
}

const initTilesPile = (state: State): State => {
  const tilesPile: Tile[] = []
  for (let x = 0; x < state.config.boardWidth; x++) {
    for (let y = 0; y < state.config.boardHeight; y++) {
      tilesPile.push([x, y])
    }
  }
  shuffleArray(tilesPile)
  return { ...state, tilesPile }
}

const initPlayerTiles = (state: State): State => {
  const playerTiles: { playerIndex: number, tiles: Tile[] }[] = []
  for (let i = 0; i < state.config.numberOfPlayers; i++) {
    playerTiles[i] = {
      playerIndex: i,
      tiles: []
    }
  }
  return { ...state, playerTiles }
}

const initStocks = (state: State): State => {
  const stocks: { [hotelIndex: number]: number[] } = {}
  for (let i = 0; i < state.config.hotels.length; i++) {
    stocks[i] = new Array(state.config.numberOfPlayers).fill(0)
  }
  return { ...state, stocks }
}

export const initTilesDraw = (state: State, output: Output): State => {
  for (let i = 0; i < state.config.numberOfPlayers; i++) {
    state.currentPlayerIndex = i
    for (let j = 0; j < state.config.numberOfTilesPerPlayer + 1; j++) {
      state = playerDrawTile(state, output)
    }
    state = playerBuildTile(state, 0, output)
  }
  state.currentPlayerIndex = 0
  return state
}

export const initState = (config: Config, output: Output): State => {
  let state: State = {
    config,
    cash: [],
    hotels: [],
    playerTiles: [],
    boardTiles: [],
    discardedTiles: [],
    tilesPile: [],
    stocks: [],
    currentPlayerIndex: 0,
    decidingPlayerIndex: -1,
    phaseId: 'build',
    mergingHotelIndex: -1
  }
  state = initTilesPile(state)
  state = initCash(state)
  state = initPlayerTiles(state)
  state = initStocks(state)
  state = initTilesDraw(state, output)
  return state
}

