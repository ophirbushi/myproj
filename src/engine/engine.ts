import { getImplicitInput, isPossibleGameEnd } from './helpers'
import { Input, Output, OutputMessageCode, State } from './models'
import { doBuild } from './phases/build'
import { doEstablish } from './phases/establish'
import { doInvest } from './phases/invest'
import { doMerge } from './phases/merge'
import { doMergeDecide } from './phases/merge-decide'
import { doWrapUp } from './phases/wrap-up'
import { validateInput } from './validators'

export const run = async (state: State, input: Input, output: Output) => {
  output.broadcast({ state, code: OutputMessageCode.ENGINE_START, log: 'start' })
  while (state.phaseId !== 'gameEnd') {
    let playerInput: any = getImplicitInput(state)
    if (playerInput == null) {
      output.broadcast({ state, code: OutputMessageCode.WAITING_FOR_INPUT, log: 'waiting for input' })
      let inputValid = false
      while (!inputValid) {
        playerInput = await input.getInput()
        inputValid = validateInput(state, playerInput, output)
        if (!inputValid) {
          output.broadcast({ state, code: OutputMessageCode.INVALID_INPUT, log: 'invalid input' })
        }
      }
    }
    switch (state.phaseId) {
      case 'build':
        if (isPossibleGameEnd(state) && playerInput === 'finish') {
          state = doWrapUp(state, output)
          break
        } else {
          state = doBuild(state, playerInput, output)
          break
        }
      case 'establish':
        state = doEstablish(state, playerInput, output)
        break
      case 'merge':
        state = doMerge(state, playerInput, output)
        break
      case 'mergeDecide':
        state = doMergeDecide(state, playerInput, output)
        break
      case 'invest':
        state = doInvest(state, playerInput, output)
        break
    }
    output.broadcast({ state, code: OutputMessageCode.SUCCESS, log: 'ok' })
  }
  output.broadcast({ state, code: OutputMessageCode.GAME_END, log: 'Game Ended' })
}
