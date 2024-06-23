import { handPrizes, playerBuildTile, playerReplaceTile } from '../actions'
import { getTileByIndex, getTileEffect, getMergingHotelIndex, isPermanentlyIllegalTile } from '../helpers'
import { Output, State } from '../models'

export const doBuild = (state: State, input: number, output: Output): State => {
  const tile = getTileByIndex(state, input)
  if (isPermanentlyIllegalTile(state, tile)) {
    return {
      ...state,
      ...playerReplaceTile(state, input, output),
      phaseId: 'build',
    }
  }
  const effect = getTileEffect(state, tile)
  switch (effect) {
    case 'noop':
      return {
        ...state,
        ...playerBuildTile(state, input, output),
        phaseId: 'invest',
      }
    case 'merge':
      let newState = { ...state }
      const mergingHotelIndex = getMergingHotelIndex(state, tile)
      if (mergingHotelIndex === -1) {
        return {
          ...state,
          ...playerBuildTile(state, input, output),
          mergingHotelIndex,
          phaseId: 'merge'
        }
      }
      newState = playerBuildTile(newState, input, output)
      newState = {
        ...newState,
        mergingHotelIndex,
        decidingPlayerIndex: newState.currentPlayerIndex,
        phaseId: 'mergeDecide'
      }
      newState = handPrizes(newState, output)
      return newState
    case 'establish':
      return {
        ...state,
        ...playerBuildTile(state, input, output),
        phaseId: 'establish',
      }
  }
}
