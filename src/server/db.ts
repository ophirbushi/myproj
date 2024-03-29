import { State } from '../engine/models'

export interface DBAdaptor {
  get: (gameId: string) => Promise<State>
  set: (gameId: string, value: State) => Promise<void>
}
