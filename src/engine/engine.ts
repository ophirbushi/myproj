import { isGameEnd } from './helpers'
import { Input, Output, OutputMessageCode, State } from './models'
import { doBuild } from './phases/build'
import { doEstablish } from './phases/establish'
import { doInvest } from './phases/invest'
import { doMerge } from './phases/merge'
import { doMergeDecide } from './phases/merge-decide'
import { validateInput } from './validators'

export const run = async (state: State, input: Input, output: Output) => {
  output.broadcast({ state, code: OutputMessageCode.ENGINE_START, log: 'start' })
  while (!isGameEnd(state)) {
    output.broadcast({ state, code: OutputMessageCode.WAITING_FOR_INPUT, log: 'waiting for input' })
    let inputValid = false
    let playerInput: any = null
    while (!inputValid) {
      playerInput = await input.getInput()
      inputValid = validateInput(state, playerInput)
      if (!inputValid) {
        output.broadcast({ state, code: OutputMessageCode.INVALID_INPUT, log: 'invalid input' })
      }
    }
    switch (state.phaseId) {
      case 'build':
        state = doBuild(state, playerInput)
        break
      case 'establish':
        state = doEstablish(state, playerInput)
        break
      case 'merge':
        state = doMerge(state, playerInput)
        break
      case 'mergeDecide':
        state = doMergeDecide(state, playerInput)
        break
      case 'invest':
        state = doInvest(state, playerInput)
        break
    }
    output.broadcast({ state, code: OutputMessageCode.SUCCESS, log: 'ok' })
  }
}
