import { Input, Output, OutputMessageCode, State } from './models'

const isGameEnd = (state: State): boolean => {
  return false
}

const validateSelectTileInput = (state: State, input: [number, number]): boolean => {
  if (!Array.isArray(input) || input.length !== 2) {
    return false
  }
  const [x, y] = input
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    return false
  }
  return x >= 0 && x < state.config.boardWidth && y >= 0 && y < state.config.boardHeight
}

const validateInput = (state: State, input: any): boolean => {
  switch (state.phaseId) {
    case 'selectTile':
      return validateSelectTileInput(state, input)
    default:
      return false
  }
}

const applySelectTileInput = (state: State, input: [number, number]) => {
  return {...state,}
}

const applyInput = (state: State, input: any): State => {
  switch (state.phaseId) {
    case 'selectTile':
      return state
    default:
      break;
  }
  return state
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

