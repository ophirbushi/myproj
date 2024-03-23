import { clone, getLastPlayedTile, getTileByIndex, getWhichHotelsInvolvedInMerge } from './helpers'
import { getHotelFirstPrizeAmount, getHotelSecondPrizeAmount, getHotelStockPrice, getPrizeReceivers } from './helpers/stocks'
import { State, StockDecision } from './models'

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

export const handPrizes = (state: State): State => {
  const cash = clone(state.cash)
  const lastTile = getLastPlayedTile(state)
  const dissolvingHotels = getWhichHotelsInvolvedInMerge(state, lastTile)
    .filter(hi => hi !== state.mergingHotelIndex)
  for (const hotelIndex of dissolvingHotels) {
    const firstPrizeAmt = getHotelFirstPrizeAmount(state, hotelIndex)
    const secondPrizeAmt = getHotelSecondPrizeAmount(state, hotelIndex)
    const { firstPrize, secondPrize } = getPrizeReceivers(state, hotelIndex)
    for (let firstPrizeReceiver of firstPrize) {
      cash[firstPrizeReceiver] += Math.floor(firstPrizeAmt / firstPrize.length)
    }
    for (let secondPrizeReceiver of secondPrize) {
      cash[secondPrizeReceiver] += Math.floor(secondPrizeAmt / secondPrize.length)
    }
  }
  return {
    ...state,
    cash
  }
}


export const nextTurn = (state: State): State => {
  return {
    ...state,
    currentPlayerIndex: (state.currentPlayerIndex + 1) % state.playerTiles.length,
    mergingHotelIndex: -1,
    decidingPlayerIndex: -1,
    phaseId: 'build'
  }
}

export const givePlayerStockIfRemaining = (state: State, hotelIndex: number, playerIndex: number): State => {
  const stocks = clone(state.stocks)
  stocks[hotelIndex][playerIndex]++
  if (stocks[hotelIndex][playerIndex] > state.config.maxStocks) {
    return state
  }
  return {
    ...state,
    stocks
  }
}

export const playerBuyStocks = (state: State, decision: StockDecision, playerIndex?: number): State => {
  if (playerIndex == null) {
    playerIndex = state.currentPlayerIndex
  }
  const cash = clone(state.cash)
  const stocks = clone(state.stocks)
  const stockPrice = getHotelStockPrice(state, decision.hotelIndex)
  const totalPrice = stockPrice * decision.amount
  cash[playerIndex] -= totalPrice
  stocks[decision.hotelIndex][playerIndex] += decision.amount
  return {
    ...state,
    cash,
    stocks
  }
}

export const playerSellStocks = (state: State, decision: StockDecision, playerIndex?: number): State => {
  return playerBuyStocks(state, { ...decision, amount: -decision.amount }, playerIndex)
}

export const playerConvertStocks = (state: State, decision: StockDecision, playerIndex: number): State => {
  if (decision.amount % 2 !== 0) {
    throw new Error('playerConvertStocks() error: uneven number of stocks')
  }
  const stocks = clone(state.stocks)
  stocks[decision.hotelIndex][playerIndex] -= decision.amount
  stocks[state.mergingHotelIndex][playerIndex] += (decision.amount / 2)
  return {
    ...state,
    stocks
  }
}
