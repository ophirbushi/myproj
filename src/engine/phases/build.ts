import { handPrizes, playerBuildTile, playerReplaceTile } from '../actions'
import { getTileByIndex, getTileEffect, getMergingHotelIndex, isPermanentlyIllegalTile } from '../helpers'
import { Output, State } from '../models'

export const doBuild = (state: State, input: number, output: Output): State => {
  const tile = getTileByIndex(state, input)
  if (isPermanentlyIllegalTile(state, tile)) {
    output.broadcast({ code: 5, state, log: `<current-player> replaced a tile` })
    return {
      ...state,
      ...playerReplaceTile(state, input),
      phaseId: 'build',
    }
  }
  const effect = getTileEffect(state, tile)
  switch (effect) {
    case 'noop':
      output.broadcast({ code: 5, state, log: `<current-player> placed ${tile}` })
      return {
        ...state,
        ...playerBuildTile(state, input),
        phaseId: 'invest',
      }
    case 'merge':
      let newState = { ...state }
      const mergingHotelIndex = getMergingHotelIndex(state, tile)
      if (mergingHotelIndex === -1) {
        output.broadcast({ code: 5, state, log: `<current-player> placed ${tile}` })
        return {
          ...state,
          ...playerBuildTile(state, input),
          mergingHotelIndex,
          phaseId: 'merge'
        }
      }
      newState = playerBuildTile(newState, input)
      output.broadcast({ code: 5, state, log: `<current-player> placed ${tile}` })
      newState = {
        ...newState,
        mergingHotelIndex,
        decidingPlayerIndex: newState.currentPlayerIndex,
        phaseId: 'mergeDecide'
      }
      newState = handPrizes(newState)
      return newState
    case 'establish':
      output.broadcast({ code: 5, state, log: `<current-player> placed ${tile}` })
      return {
        ...state,
        ...playerBuildTile(state, input),
        phaseId: 'establish',
      }
  }
}
