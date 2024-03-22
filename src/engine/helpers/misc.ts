import { State, Tile } from '../models'
import { getHotelSize, getWhichHotelsInvolvedInMerge } from './tiles'

export const getNextDecidingPlayerIndex = (state: State): number => {
  return -1
}

export const isGameEnd = (state: State): boolean => {
  return false
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
