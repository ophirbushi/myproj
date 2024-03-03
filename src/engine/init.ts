import { Config, State } from './models'

const initCash = (state: State): State => {
  const cash: number[] = []
  for (let i = 0; i < state.config.numberOfPlayers; i++) {
    cash[i] = state.config.initCashPerPlayer
  }
  return { ...state, cash }
}

const initPlayerTiles = (state: State): State => {
  const playerTiles: { playerIndex: number, tiles: [number, number][] }[] = []
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

export const initState = (config: Config): State => {
  let state: State = {
    config,
    cash: [],
    hotels: [],
    playerTiles: [],
    boardTiles: [],
    discardedTiles: [],
    stocks: [],
    currentPlayerIndex: 0,
    decidingPlayerIndex: 0,
    phaseId: 'build'
  }
  state = initCash(state)
  state = initPlayerTiles(state)
  state = initStocks(state)
  return state
}
