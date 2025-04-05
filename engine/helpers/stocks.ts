import { State } from '../models';
import { getHotelPrestige, getHotelSize } from './tiles';

export const getHotelStockPrice = (state: State, hotelIndex: number): number => {
  const { init, step, levels } = state.config.priceTable
  const hotelSize = getHotelSize(state, hotelIndex)
  const hotelPrestige = getHotelPrestige(state, hotelIndex)
  let levelIndex = -1
  // Get index of last level which hotel size is not less of:
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i]
    if (hotelSize < level) {
      break
    }
    levelIndex = i
  }
  return init + ((levelIndex + hotelPrestige) * step)
}

export const getHotelFirstPrizeAmount = (state: State, hotelIndex: number): number => {
  return 10 * getHotelStockPrice(state, hotelIndex)
}

export const getHotelSecondPrizeAmount = (state: State, hotelIndex: number): number => {
  return 5 * getHotelStockPrice(state, hotelIndex)
}

export const getPrizeReceivers = (state: State, hotelIndex: number): { firstPrize: number[], secondPrize: number[] } => {
  let firstPrize: number[] = []
  let secondPrize: number[] = []
  const stockHolders = state.stocks[hotelIndex].map((amt, pi) => {
    return { amount: amt, playerIndex: pi }
  })
  const stockHoldersSortedDesc = stockHolders.slice().sort((a, b) => {
    return b.amount - a.amount
  })
  firstPrize = stockHoldersSortedDesc.filter(holder => holder.amount && holder.amount === stockHoldersSortedDesc[0].amount).map(holder => holder.playerIndex)
  secondPrize = stockHoldersSortedDesc.filter(holder => holder.amount && holder.amount === stockHoldersSortedDesc[1].amount).map(holder => holder.playerIndex)
  if (!secondPrize.length) {
    secondPrize = [...firstPrize]
  }
  return { firstPrize, secondPrize }
}

export const getHowManyStocksLeftForHotel = (state: State, hotelIndex: number): number => {
  return state.config.maxStocks - state.stocks[hotelIndex].reduce((acc, playerStocksCount) => acc + playerStocksCount, 0)
}
