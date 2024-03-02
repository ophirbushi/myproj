import { getTileEffect } from '../helpers'
import { State } from '../models'

const buildTile = (state: State, input: [number, number]): State => {
  return state
}

const replaceTile = (state: State, input: [number, number]): State => {
  return state
}

export const doBuild = (state: State, input: [number, number]): State => {
  const effect = getTileEffect(state, input)
  switch (effect) {
    case 'noop':
      return {
        ...state,
        ...buildTile(state, input),
        phaseId: 'invest',
      }
    case 'replace':
      return {
        ...state,
        ...replaceTile(state, input),
        phaseId: 'build',
      }
    case 'merge':
      return {
        ...state,
        ...buildTile(state, input),
        phaseId: 'merge',
      }
    case 'establish':
      return {
        ...state,
        ...buildTile(state, input),
        phaseId: 'establish',
      }
  }
}
