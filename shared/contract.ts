import { State } from '../engine/models'

export interface FetchStateResponse {
  state: State
  logs: string[]
}

export interface CreateGameResponse {
  state: State
  logs: string[]
  gameId: string
}
