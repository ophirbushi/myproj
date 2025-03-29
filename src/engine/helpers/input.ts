import { MergeDecision, State, StockDecision } from '../models'
import { getLastPlayedTile, getHotelsInvolvedInMerge, getDissolvingHotels } from './tiles'

export const getImplicitInput = (state: State): any => {
  switch (state.phaseId) {
    case 'invest':
      if (state.hotels.length === 0) {
        return [] as StockDecision[]
      }
      break
    case 'mergeDecide':
      const dissolvingHotels = getDissolvingHotels(state, getLastPlayedTile(state))
      if (dissolvingHotels.every(hi => !state.stocks[hi][state.decidingPlayerIndex])) {
        return [] as MergeDecision[]
      }
      break
    default:
      return null
  }
}