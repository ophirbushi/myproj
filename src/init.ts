import { Config, State } from './models'

const initCash = (state: State): State => {
  const cash: number[] = []
  for (let i = 0; i < state.config.numberOfPlayers; i++) {
    cash[i] = state.config.initCashPerPlayer
  }
  return { ...state, cash }
}

const initPlayerTiles = (state: State): State => {
  const playerTiles: [number, number][][] = []
  for (let i = 0; i < state.config.numberOfPlayers; i++) {
    playerTiles[i] = []
  }
  return { ...state, playerTiles }
}

const initStocks = (state: State): State => {
  const stocks: number[][] = []
  for (let i = 0; i < state.config.numberOfPlayers; i++) {
    stocks[i] = new Array(state.config.hotels.length).fill(0)
  }
  return { ...state, stocks }
}

export const initState = (config: Config): State => {
  let state: State = {
    config,
    cash: [],
    hotels: [],
    playerTiles: [],
    tiles: [],
    discardedTiles: [],
    stocks: [],
    playerIndex: 0,
    decidingPlayerIndex: 0,
    phaseId: 'pregame'
  }
  state = initCash(state)
  state = initPlayerTiles(state)
  state = initStocks(state)
  return state
}
