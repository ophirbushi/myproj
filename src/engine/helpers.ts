import { State, TileEffect } from './models'

export const getNextDecidingPlayerIndex = (state: State): number => {
  return -1
}

export const getTileEffect = (state: State, input: [number, number]): TileEffect => {
  return 'noop'
}

export const isGameEnd = (state: State): boolean => {
    return false
}