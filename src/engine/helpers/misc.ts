import { State, Tile } from '../models'
import { getHotelSize, getWhichHotelsInvolvedInMerge } from './tiles'

export const getNextDecidingPlayerIndex = (state: State): number => {
  let nextDecidingPlayerIndex = state.decidingPlayerIndex + 1
  if (nextDecidingPlayerIndex >= state.config.numberOfPlayers) {
    nextDecidingPlayerIndex = 0
  }
  if (nextDecidingPlayerIndex === state.currentPlayerIndex) {
    return -1
  }
  return nextDecidingPlayerIndex
}

export const isPossibleGameEnd = (state: State): boolean => {
  const hotelSizes = state.hotels.map(h => getHotelSize(state, h.hotelIndex))
  return hotelSizes.some(hs => hs >= state.config.possibleGameEndHotelSize)
}

export const sortHotelsBySizeDescOrder = (state: State, hotelIndexes: number[]): number[] => {
  return hotelIndexes
    .slice()
    .sort((a, b) => getHotelSize(state, b) - getHotelSize(state, a))
}

export const getMergingHotelIndex = (state: State, tile: Tile): number => {
  const hotelsInvolvedInMerge = getWhichHotelsInvolvedInMerge(state, tile)
  const [largestHotelIndex, secondLargestHotelIndex] = sortHotelsBySizeDescOrder(state, hotelsInvolvedInMerge)
  if (getHotelSize(state, largestHotelIndex) === getHotelSize(state, secondLargestHotelIndex)) {
    return -1
  }
  return largestHotelIndex
}

export const hotelExistsOnBoard = (state: State, hotelIndex: number): boolean => {
  return state.hotels.some(h => h.hotelIndex === hotelIndex)
}
