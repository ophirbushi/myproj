import { defaultConfig } from './engine/constants'
import { initState } from './engine/init'
import * as engine from './engine/engine'
import { Input, Output, OutputMessage, State } from './engine/models'
import * as cors from 'cors'

import * as express from 'express'
import { EventEmitter } from 'events'


const broadcast = new EventEmitter()

const input: Input = {
  getInput: () => {
    return new Promise(resolve => {
      broadcast.on('input', (message) => resolve(message))
    })
  }
}


const output: Output = {
  broadcast: (message: OutputMessage) => {
    console.log(message.log, { message })
    latestState = message.state
  }
}

let state = initState(defaultConfig)
engine.run(state, input, output)


let latestState: State = state

express()
  .use(express.json())
  .use(cors())
  .get('/', (req, res) => {
    res.send(latestState)
  })
  .post('/input', (req, res) => {
    const input = req.body.input
    broadcast.emit('input', input)
    res.send('ok')
  })
  .listen(3000)
