import { Input, Output, OutputMessageCode, State, TileEffect } from './models'

const isGameEnd = (state: State): boolean => {
  return false
}

const applyInput = (state: State, input: any): State => {
  switch (state.phaseId) {
    case 'build':
      return doBuild(state, input)
    case 'establish':
      return doEstablish(state, input)
    case 'merge':
      return doMerge(state, input)
    case 'mergeDecide': case 'mergeDecide':
      return doMergeDecide(state, input)
    case 'invest':
      return doInvest(state, input)
    default:
      break;
  }
  return state
}

const getTileEffect = (state: State, input: [number, number]): TileEffect => {
  return 'noop'
}


let buildTile = (state: State, input: [number, number]): State => {
  return state
}


let replaceTile = (state: State, input: [number, number]): State => {
  return state
}

const doEstablish = (state: State, input: [number, number]): State => {
  return {
    ...state,
    phaseId: 'invest',
  }
}

const doMerge = (state: State, input: [number, number]): State => {
  return {
    ...state,
    phaseId: 'mergeDecide',
    decidingPlayerIndex: getNextDecidingPlayerIndex(state)
  }
}

const getNextDecidingPlayerIndex = (state: State): number => {
  return -1
}

const applyMergeDecision = (state: State, input: [number, number]): State => {
  return state
}

const doMergeDecide = (state: State, input: [number, number]): State => {
  state = {
    ...state,
    ...applyMergeDecision(state, input),
  }
  let nextDecidingPlayerIndex = getNextDecidingPlayerIndex(state)
  if (nextDecidingPlayerIndex !== -1) {
    return {
      ...state,
      decidingPlayerIndex: nextDecidingPlayerIndex
    }
  }
  return {
    ...state,
    phaseId: 'invest'
  }
}

const doInvest = (state: State, input: [number, number]): State => {
  return {
    ...state,
    phaseId: 'build'
  }
}

const doBuild = (state: State, input: [number, number]): State => {
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

const validateInput = (state: State, input: any): boolean => {
  return true
}

export const run = async (state: State, input: Input, output: Output) => {
  output.broadcast({ state, code: OutputMessageCode.ENGINE_START, log: 'start' })
  while (!isGameEnd(state)) {
    output.broadcast({ state, code: OutputMessageCode.WAITING_FOR_INPUT, log: 'waiting for input' })
    let inputValid = false
    let playerInput = null
    while (!inputValid) {
      playerInput = await input.getInput()
      inputValid = validateInput(state, playerInput)
      if (!inputValid) {
        output.broadcast({ state, code: OutputMessageCode.INVALID_INPUT, log: 'invalid input' })
      }
    }
    state = applyInput(state, playerInput)
    output.broadcast({ state, code: OutputMessageCode.SUCCESS, log: 'ok' })
  }
}
