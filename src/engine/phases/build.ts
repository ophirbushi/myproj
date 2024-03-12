import { playerBuildTile, playerReplaceTile } from '../actions'
import { getTileByIndex, getTileEffect, isMergeAmbigous } from '../helpers'
import { State } from '../models'

export const doBuild = (state: State, input: number): State => {
  const tile = getTileByIndex(state, input)
  const effect = getTileEffect(state, tile)
  switch (effect) {
    case 'noop':
      return {
        ...state,
        ...playerBuildTile(state, input),
        phaseId: 'invest',
      }
    case 'replace':
      return {
        ...state,
        ...playerReplaceTile(state, input),
        phaseId: 'build',
      }
    case 'merge':
      return {
        ...state,
        ...playerBuildTile(state, input),
        phaseId: isMergeAmbigous(state, tile) ? 'merge' : 'mergeDecide',
      }
    case 'establish':
      return {
        ...state,
        ...playerBuildTile(state, input),
        phaseId: 'establish',
      }
  }
}
