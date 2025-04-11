import { getImplicitInput, isPossibleGameEnd } from './helpers'
import { Input, InputSource, Output, OutputMessageCode, State } from './models'
import { doBuild } from './phases/build'
import { doEstablish } from './phases/establish'
import { doInvest } from './phases/invest'
import { doMerge } from './phases/merge'
import { doMergeDecide } from './phases/merge-decide'
import { doWrapUp } from './phases/wrap-up'
import { validateInput } from './validators'

export const run = async (state: State, inputSource: InputSource, output: Output) => {
  output.broadcast({ state, code: OutputMessageCode.ENGINE_START, log: 'start' })
  while (state.phaseId !== 'gameEnd') {
    let input = getImplicitInput(state)
    if (input == null) {
      output.broadcast({ state, code: OutputMessageCode.WAITING_FOR_INPUT, log: 'waiting for input' })
      let inputValid = false
      while (!inputValid) {
        input = await inputSource.getInput()
        inputValid = validateInput(state, input, output)
      }
    }
    switch (state.phaseId) {
      case 'build':
        if (isPossibleGameEnd(state) && input!.data === 'finish') {
          state = doWrapUp(state, output)
          break
        } else {
          state = doBuild(state, input!.data, output)
          break
        }
      case 'establish':
        state = doEstablish(state, input!.data, output)
        break
      case 'merge':
        state = doMerge(state, input!.data, output)
        break
      case 'mergeDecide':
        state = doMergeDecide(state, input!.data, output)
        break
      case 'invest':
        state = doInvest(state, input!.data, output)
        break
    }
    output.broadcast({ state, code: OutputMessageCode.SUCCESS, log: 'ok' })
  }
  output.broadcast({ state, code: OutputMessageCode.GAME_END, log: 'Game Ended' })
}
