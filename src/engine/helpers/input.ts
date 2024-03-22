import { State, StockDecision } from '../models';

export const getImplicitInput = (state: State): any => {
  switch (state.phaseId) {
    case 'invest':
      if (state.hotels.length === 0) {
        return [] as StockDecision[]
      }
      break;
    default:
      return null
  }
}