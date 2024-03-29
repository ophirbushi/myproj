import { getImplicitInput, isPossibleGameEnd } from './helpers'
import { Input, Output, OutputMessage, OutputMessageCode, State } from './models'
import { doBuild } from './phases/build'
import { doEstablish } from './phases/establish'
import { doInvest } from './phases/invest'
import { doMerge } from './phases/merge'
import { doMergeDecide } from './phases/merge-decide'
import { doWrapUp } from './phases/wrap-up'
import { validateInput } from './validators'
import { EventEmitter } from 'events'

export class EventEmitterOutput implements Output {
  eventEmitter = new EventEmitter()
  onMessage = (callback: (message: OutputMessage) => void) => {
    this.eventEmitter.on('message', callback)
  }
  broadcast = (message: OutputMessage) => {
    this.eventEmitter.emit('message', message)
  }
}

export interface GameInstance {
  gameId: string
  isRunning: boolean
  isError: boolean
  state: State
  input: Input
  output: Output
  gameLoop: Promise<void>
  error?: any
}

const gameLoop = async (state: State, input: Input, output: Output) => {
  output.broadcast({ state, code: OutputMessageCode.ENGINE_START, log: 'start' })
  while (state.phaseId !== 'gameEnd') {
    let playerInput: any = getImplicitInput(state)
    if (playerInput == null) {
      output.broadcast({ state, code: OutputMessageCode.WAITING_FOR_INPUT, log: 'waiting for input' })
      let inputValid = false
      while (!inputValid) {
        playerInput = await input.getInput()
        inputValid = validateInput(state, playerInput)
        if (!inputValid) {
          output.broadcast({ state, code: OutputMessageCode.INVALID_INPUT, log: 'invalid input' })
        }
      }
    }
    switch (state.phaseId) {
      case 'build':
        if (isPossibleGameEnd(state) && playerInput === 'finish') {
          state = doWrapUp(state)
          break
        } else {
          state = doBuild(state, playerInput)
          break
        }
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
  output.broadcast({ state, code: OutputMessageCode.GAME_END, log: 'Game Ended' })
}

export const run = (gameId: string, state: State, input: Input, output: EventEmitterOutput): GameInstance => {
  const gameInstance: GameInstance = {
    gameId,
    isRunning: true,
    isError: false,
    state,
    input,
    output,
    gameLoop: Promise.resolve()
  }
  output.onMessage((message) => {
    gameInstance.state = message.state
  })
  gameInstance.gameLoop = gameLoop(state, input, output)
    .then(() => {
      gameInstance.isRunning = false
    })
    .catch((err) => {
      gameInstance.isRunning = false
      gameInstance.isError = true
      gameInstance.error = err
    })
  return gameInstance
}
