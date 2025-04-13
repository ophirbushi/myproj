import { Input, MergeDecision, State, StockDecision } from '../models'
import { getLastPlayedTile, getDissolvingHotels } from './tiles'

export const getImplicitInput = (state: State): Input<any> | null => {
  switch (state.phaseId) {
    case 'invest':
      if (state.hotels.length === 0) {
        return { playerIndex: -1, data: [] as StockDecision[] }
      }
      break
    case 'mergeDecide':
      const dissolvingHotels = getDissolvingHotels(state, getLastPlayedTile(state))
      if (dissolvingHotels.every(hi => !state.stocks[hi][state.decidingPlayerIndex])) {
        return { playerIndex: -1, data: [] as MergeDecision[] }
      }
      break
  }
  return null;
}