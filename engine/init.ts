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
  return {"config":{"numberOfPlayers":4,"hotels":[{"hotelName":"Riviera","prestige":0},{"hotelName":"Holiday","prestige":0},{"hotelName":"LasVegas","prestige":1},{"hotelName":"Park","prestige":1},{"hotelName":"Olympia","prestige":1},{"hotelName":"Europlaza","prestige":2},{"hotelName":"Continental","prestige":2}],"initCashPerPlayer":5000,"maxStocks":24,"maxStocksPurchasePerTurn":3,"possibleGameEndHotelSize":42,"unmergableHotelSize":11,"numberOfTilesPerPlayer":6,"priceTable":{"init":200,"step":100,"levels":[2,3,4,5,6,11,21,31,41]},"boardHeight":9,"boardWidth":12},"cash":[4100,5000,3600,2600],"hotels":[{"hotelIndex":2,"x":6,"y":2},{"hotelIndex":3,"x":9,"y":5},{"hotelIndex":4,"x":11,"y":3},{"hotelIndex":6,"x":6,"y":5}],"playerTiles":[{"playerIndex":0,"tiles":[[11,5],[11,7],[4,8],[1,7],[0,3]]},{"playerIndex":1,"tiles":[[5,0],[8,8],[10,8],[0,2],[9,7],[5,4]]},{"playerIndex":2,"tiles":[[1,3],[2,6],[5,8],[11,1],[10,0],[5,6]]},{"playerIndex":3,"tiles":[[4,2],[9,1],[10,1],[2,0],[11,4],[0,4]]}],"boardTiles":[[6,3],[4,6],[10,3],[9,8],[3,5],[6,2],[9,4],[6,7],[1,6],[9,5],[5,5],[5,3],[11,3],[6,5],[7,5],[4,5],[9,2]],"discardedTiles":[[6,3],[4,6],[10,3],[9,8],[3,5],[6,2],[9,4],[6,7],[1,6],[9,5],[5,5],[5,3],[11,3],[6,5],[7,5],[4,5],[9,2]],"tilesPile":[[8,1],[7,2],[9,6],[7,4],[2,7],[6,8],[0,1],[3,4],[6,6],[7,0],[4,3],[2,8],[2,2],[7,7],[4,4],[10,7],[10,6],[11,8],[8,3],[0,8],[11,0],[4,1],[7,6],[3,8],[6,1],[9,3],[1,2],[7,8],[3,3],[4,0],[11,6],[1,5],[5,1],[0,7],[6,4],[2,1],[8,5],[8,6],[8,4],[2,4],[9,0],[8,7],[8,0],[6,0],[3,7],[2,5],[5,2],[2,3],[1,0],[11,2],[0,6],[5,7],[3,1],[10,2],[1,1],[3,6],[0,0],[10,5],[1,4],[3,2],[1,8],[0,5],[7,1],[7,3],[4,7],[3,0],[8,2],[10,4]],"stocks":{"0":[0,0,0,0],"1":[0,0,0,0],"2":[0,1,3,0],"3":[0,1,0,0],"4":[4,0,0,0],"5":[0,0,0,0],"6":[0,1,1,3]},"currentPlayerIndex":0,"decidingPlayerIndex":-1,"phaseId":"invest","mergingHotelIndex":-1}



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

