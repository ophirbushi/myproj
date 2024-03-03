import { playerEstablishHotel } from '../actions'
import { State } from '../models'

export const doEstablish = (state: State, input: number): State => {
  return {
    ...state,
    ...playerEstablishHotel(state, input),
    phaseId: 'invest',
  }
}
