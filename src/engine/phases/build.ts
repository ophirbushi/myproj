import { handPrizes } from '../actions'
import { playerBuildTile, playerReplaceTile } from '../actions/tiles'
import { getTileByIndex, getTileEffect, getMergingHotelIndex, isPermanentlyIllegalTile } from '../helpers'
import { State } from '../models'

export const doBuild = (state: State, input: number): State => {
  const tile = getTileByIndex(state, state.currentPlayerIndex, input)
  if (isPermanentlyIllegalTile(state, tile)) {
    return {
      ...state,
      ...playerReplaceTile(state, state.currentPlayerIndex, input),
      phaseId: 'build'
    }
  }
  const effect = getTileEffect(state, tile)
  switch (effect) {
    case 'noop': {
      return {
        ...state,
        ...playerBuildTile(state, state.currentPlayerIndex, input),
        phaseId: 'invest'
      }
    }
    case 'merge': {
      let newState = { ...state }
      const mergingHotelIndex = getMergingHotelIndex(state, tile)
      if (mergingHotelIndex === -1) {
        return {
          ...state,
          ...playerBuildTile(state, state.currentPlayerIndex, input),
          mergingHotelIndex,
          phaseId: 'merge'
        }
      }
      newState = playerBuildTile(newState, state.currentPlayerIndex, input)
      newState = {
        ...newState,
        mergingHotelIndex,
        decidingPlayerIndex: newState.currentPlayerIndex,
        phaseId: 'mergeDecide'
      }
      newState = handPrizes(newState)
      return newState
    }
    case 'establish': {
      return {
        ...state,
        ...playerBuildTile(state, state.currentPlayerIndex, input),
        phaseId: 'establish'
      }
    }
  }
}
