import { defaultConfig } from './engine/constants'
import { initState } from './engine/init'
import * as engine from './engine/engine'
import { Input, Output, OutputMessage, State } from './engine/models'
import * as cors from 'cors'
import { createWriteStream } from 'fs'
import { resolve } from 'path'
import * as express from 'express'
import { EventEmitter } from 'events'


const ws = createWriteStream(resolve(__dirname, '../log.txt'), { flags: 'a' })

const broadcast = new EventEmitter()

const input: Input = {
  getInput: () => {
    return new Promise(resolve => {
      broadcast.on('input', (message) => resolve(message))
    })
  }
}

const log: string[] = []

const output: Output = {
  broadcast: (message: OutputMessage) => {
    if (message.log && message.code === 5) {
      log.push(message.log.replace('<current-player>', `Player ${message.state.currentPlayerIndex}`))
    }
    console.log(message.log, { message })
    latestState = message.state
    ws.write(JSON.stringify(message.state) + '\n')
  }
}

let state: State

state = initState(defaultConfig)

engine.run(state, input, output)

let latestState: State = state

express()
  .use(express.json())
  .use(cors())
  .get('/', (req, res) => {
    res.send({ state: latestState, log })
  })
  .post('/input', (req, res) => {
    const input = req.body.input
    broadcast.emit('input', input)
    res.send('ok')
  })
  .listen(3000)
