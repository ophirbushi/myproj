import { handPrizes, playerBuildTile, playerReplaceTile } from '../actions'
import { getTileByIndex, getTileEffect, getMergingHotelIndex, isPermanentlyIllegalTile } from '../helpers'
import { State } from '../models'

export const doBuild = (state: State, input: number): State => {
  const tile = getTileByIndex(state, input)
  if (isPermanentlyIllegalTile(state, tile)) {
    return {
      ...state,
      ...playerReplaceTile(state, input),
      phaseId: 'build',
    }
  }
  const effect = getTileEffect(state, tile)
  switch (effect) {
    case 'noop':
      return {
        ...state,
        ...playerBuildTile(state, input),
        phaseId: 'invest',
      }
    case 'merge':
      let newState = { ...state }
      const mergingHotelIndex = getMergingHotelIndex(state, tile)
      if (mergingHotelIndex === -1) {
        return {
          ...state,
          ...playerBuildTile(state, input),
          mergingHotelIndex,
          phaseId: 'merge'
        }
      }
      newState = playerBuildTile(newState, input)
      newState = {
        ...newState,
        mergingHotelIndex,
        decidingPlayerIndex: newState.currentPlayerIndex,
        phaseId: 'mergeDecide'
      }
      newState = handPrizes(newState)
      return newState
    case 'establish':
      return {
        ...state,
        ...playerBuildTile(state, input),
        phaseId: 'establish',
      }
  }
}
