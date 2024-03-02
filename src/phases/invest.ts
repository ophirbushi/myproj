import { State } from '../models'

export const doInvest = (state: State, input: [number, number]): State => {
  return {
    ...state,
    phaseId: 'build'
  }
}
