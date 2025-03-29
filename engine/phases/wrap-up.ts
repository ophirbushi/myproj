import { playerSellStocks } from '../actions'
import { clone, getHotelFirstPrizeAmount, getHotelSecondPrizeAmount, getPrizeReceivers } from '../helpers'
import { Output, State } from '../models'

export const doWrapUp = (state: State, output: Output): State => {
  let newState = { ...state }
  for (let h of newState.hotels) {
    for (let pi = 0; pi < newState.config.numberOfPlayers; pi++) {
      const amount = newState.stocks[h.hotelIndex][pi]
      newState = playerSellStocks(newState, { hotelIndex: h.hotelIndex, amount }, output, pi)
    }
  }
  const cash = clone(newState.cash)
  for (const hotelIndex of newState.hotels.map(h => h.hotelIndex)) {
    const firstPrizeAmt = getHotelFirstPrizeAmount(newState, hotelIndex)
    const secondPrizeAmt = getHotelSecondPrizeAmount(newState, hotelIndex)
    const { firstPrize, secondPrize } = getPrizeReceivers(newState, hotelIndex)
    for (let firstPrizeReceiver of firstPrize) {
      cash[firstPrizeReceiver] += Math.floor(firstPrizeAmt / firstPrize.length)
    }
    for (let secondPrizeReceiver of secondPrize) {
      cash[secondPrizeReceiver] += Math.floor(secondPrizeAmt / secondPrize.length)
    }
  }
  return { ...newState, cash, phaseId: 'gameEnd' }
}
