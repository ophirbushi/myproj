import { defaultConfig } from './engine/constants'
import { initState } from './engine/init'
import * as engine from './engine/engine'
import { Input, Output, OutputMessage } from './engine/models'

const input: Input = {
  getInput: async <T>() => {
    await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 1000))
    return <T>{}
  }
}

const output: Output = {
  broadcast: (message: OutputMessage) => {
    console.log(message.log, { message })
  }
}

const state = initState(defaultConfig)
initState(defaultConfig)
engine.run(state, input, output)
