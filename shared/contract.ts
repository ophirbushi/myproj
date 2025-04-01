import { State } from '../engine/models'

export interface FetchStateResponse {
  state: State
  logs: string[]
}
