import { clone, getLastPlayedTile, getTileByIndex, getHotelsInvolvedInMerge, getDissolvingHotels, getHotelName } from './helpers'
import { getHotelFirstPrizeAmount, getHotelSecondPrizeAmount, getHotelStockPrice, getPrizeReceivers } from './helpers/stocks'
import { Output, State, StockDecision } from './models'

const getPlayerName = (state: State, playerIndex?: number): string => {
  const actualPlayerIndex = playerIndex ?? state.currentPlayerIndex
  return `Player ${actualPlayerIndex + 1}`
}

export const playerDrawTile = (state: State, output: Output): State => {
  const tilesPile = clone(state.tilesPile)
  const tile = tilesPile.pop()
  const playerTiles = clone(state.playerTiles)
  if (tile !== undefined) {
    playerTiles[state.currentPlayerIndex].tiles.push(tile)
  }
  // output.broadcast(`${getPlayerName(state)} drew a tile.`)
  return {
    ...state,
    tilesPile,
    playerTiles
  }
}

export const playerDiscardTile = (state: State, tileIndex: number, output: Output): State => {
  const playerTiles = clone(state.playerTiles)
  const [tile] = playerTiles[state.currentPlayerIndex].tiles.splice(tileIndex, 1)
  const discardedTiles = clone(state.discardedTiles)
  if (tile !== undefined) {
    discardedTiles.push(tile)
    // output.broadcast(`${getPlayerName(state)} discarded a tile.`)
  }
  return {
    ...state,
    discardedTiles,
    playerTiles
  }
}

export const playerBuildTile = (state: State, tileIndex: number, output: Output): State => {
  const boardTiles = clone(state.boardTiles)
  const tile = getTileByIndex(state, tileIndex)
  boardTiles.push(tile)
  output.broadcast(`${getPlayerName(state)} built a tile - ${String.fromCharCode(65 + tile[0])}${tile[1] + 1}.`)
  return {
    ...state,
    ...playerDiscardTile(state, tileIndex, output),
    boardTiles
  }
}

export const playerReplaceTile = (state: State, tileIndex: number, output: Output): State => {
  let newState = state
  newState = playerDiscardTile(newState, tileIndex, output)
  newState = playerDrawTile(newState, output)
  return newState
}

export const playerEstablishHotel = (state: State, hotelIndex: number, output: Output): State => {
  const hotels = clone(state.hotels)
  const tile = getLastPlayedTile(state)
  hotels.push({ hotelIndex, x: tile[0], y: tile[1] })
  output.broadcast(`${getPlayerName(state)} established ${state.config.hotels[hotelIndex].hotelName}.`)
  return {
    ...state,
    hotels
  }
}

export const mergeHotels = (state: State, output: Output): State => {
  const lastTile = getLastPlayedTile(state)
  const hotelsInvolvedInMerge = getHotelsInvolvedInMerge(state, lastTile)
  const hotels = clone(state.hotels).filter((hotel) => {
    if (hotel.hotelIndex === state.mergingHotelIndex) {
      return true
    }
    return !hotelsInvolvedInMerge.includes(hotel.hotelIndex)
  })
  try {
    output.broadcast(`Hotels ${[getDissolvingHotels(state, lastTile)
      .map(hi => state.config.hotels[hi].hotelName)
      .join(', ')
    ]} merged into ${getHotelName(state, state.mergingHotelIndex)}.`)
  } catch (err) {
    console.error('mergeHotels() Error trying to broadcast message', err)
  }
  return {
    ...state,
    hotels
  }
}

export const handPrizes = (state: State, output: Output): State => {
  const cash = clone(state.cash)
  const lastTile = getLastPlayedTile(state)
  const dissolvingHotels = getDissolvingHotels(state, lastTile)
  for (const hotelIndex of dissolvingHotels) {
    const firstPrizeAmt = getHotelFirstPrizeAmount(state, hotelIndex)
    const secondPrizeAmt = getHotelSecondPrizeAmount(state, hotelIndex)
    const { firstPrize, secondPrize } = getPrizeReceivers(state, hotelIndex)
    for (let firstPrizeReceiver of firstPrize) {
      const actualFirstPrizeAmt = Math.floor(firstPrizeAmt / firstPrize.length)
      cash[firstPrizeReceiver] += actualFirstPrizeAmt
      output.broadcast(`${getPlayerName(state, firstPrizeReceiver)} received $${actualFirstPrizeAmt} from ${state.config.hotels[hotelIndex].hotelName} as first prize.`)
    }
    for (let secondPrizeReceiver of secondPrize) {
      const actualSecondPrizeAmt = Math.floor(secondPrizeAmt / secondPrize.length)
      cash[secondPrizeReceiver] += actualSecondPrizeAmt
      output.broadcast(`${getPlayerName(state, secondPrizeReceiver)} received $${actualSecondPrizeAmt} from ${state.config.hotels[hotelIndex].hotelName} as second prize.`)
    }
  }
  return {
    ...state,
    cash
  }
}

export const nextTurn = (state: State, output: Output): State => {
  const currentPlayerIndex = (state.currentPlayerIndex + 1) % state.playerTiles.length
  output.broadcast(`It's ${getPlayerName(state, currentPlayerIndex)}'s turn.`)
  return {
    ...state,
    currentPlayerIndex,
    mergingHotelIndex: -1,
    decidingPlayerIndex: -1,
    phaseId: 'build'
  }
}

export const givePlayerStockIfRemaining = (state: State, hotelIndex: number, playerIndex: number, output: Output): State => {
  const stocks = clone(state.stocks)
  if (stocks[hotelIndex].reduce((acc, cur) => acc + cur, 0) < state.config.maxStocks) {
    stocks[hotelIndex][playerIndex]++
    output.broadcast(`${getPlayerName(state, playerIndex)} received 1 ${state.config.hotels[hotelIndex].hotelName} stock.`)
  } else {
    output.broadcast(`No more stocks are left for ${state.config.hotels[hotelIndex].hotelName}.`)
  }
  return {
    ...state,
    stocks
  }
}

export const playerBuyStocks = (state: State, decision: StockDecision, output: Output, playerIndex?: number): State => {
  if (playerIndex == null) {
    playerIndex = state.currentPlayerIndex
  }
  const cash = clone(state.cash)
  const stocks = clone(state.stocks)
  const stockPrice = getHotelStockPrice(state, decision.hotelIndex)
  const totalPrice = stockPrice * decision.amount
  cash[playerIndex] -= totalPrice
  stocks[decision.hotelIndex][playerIndex] += decision.amount
  if (decision.amount >= 0) {
    output.broadcast(`${getPlayerName(state, playerIndex)} spent $${totalPrice} to buy ${decision.amount} ${state.config.hotels[decision.hotelIndex].hotelName} stocks.`)
  } else {
    output.broadcast(`${getPlayerName(state, playerIndex)} sold ${-decision.amount} ${state.config.hotels[decision.hotelIndex].hotelName} stocks for $${-totalPrice}.`)
  }
  return {
    ...state,
    cash,
    stocks
  }
}

export const playerSellStocks = (state: State, decision: StockDecision, output: Output, playerIndex?: number): State => {
  return playerBuyStocks(state, { ...decision, amount: -decision.amount }, output, playerIndex)
}

export const playerConvertStocks = (state: State, decision: StockDecision, playerIndex: number, output: Output): State => {
  if (decision.amount % 2 !== 0) {
    throw new Error('playerConvertStocks() error: uneven number of stocks')
  }
  const stocks = clone(state.stocks)
  stocks[decision.hotelIndex][playerIndex] -= decision.amount
  stocks[state.mergingHotelIndex][playerIndex] += (decision.amount / 2)
  output.broadcast(`${getPlayerName(state, playerIndex)} converted ${decision.amount} ${state.config.hotels[decision.hotelIndex].hotelName} stocks into ${decision.amount / 2} ${state.config.hotels[state.mergingHotelIndex].hotelName} stocks.`)
  return {
    ...state,
    stocks
  }
}
