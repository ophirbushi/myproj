import { State } from '../models'

export const doEstablish = (state: State, input: [number, number]): State => {
  return {
    ...state,
    phaseId: 'invest',
  }
}
