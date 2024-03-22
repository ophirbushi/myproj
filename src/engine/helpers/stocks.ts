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
