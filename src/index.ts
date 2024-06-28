import { defaultConfig } from './engine/constants'
import { initState } from './engine/init'
import * as engine from './engine/engine'
import { Input, Output, OutputMessage, State } from './engine/models'
import * as cors from 'cors'
import { createWriteStream } from 'fs'
import { resolve } from 'path'
import * as express from 'express'
import { EventEmitter } from 'events'

const logs: string[] = []
const ws = createWriteStream(resolve(__dirname, '../log.txt'), { flags: 'a' })
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
    if (typeof message === 'string') {
      console.log(message)
      logs.push(message)
      if (logs.length > 50) {
        logs.shift()
      }
    } else {
      latestState = message.state
      ws.write(JSON.stringify(message.state) + '\n')
    }
  }
}
const state = initState(defaultConfig, output)
engine.run(state, input, output)
let latestState: State = state
express()
  .use(express.json())
  .use(cors())
  .get('/', (req, res) => {
    res.send({ state: latestState, logs })
  })
  .post('/input', (req, res) => {
    const input = req.body.input
    broadcast.emit('input', input)
    res.send('ok')
  })
  .listen(3000)
