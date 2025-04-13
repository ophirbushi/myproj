import { defaultConfig } from '../engine/constants'
import { initState } from '../engine/init'
import * as engine from '../engine/engine'
import { Input, InputSource, Output, OutputMessage, OutputMessageCode, State } from '../engine/models'
import * as cors from 'cors'
import { createWriteStream, readFileSync } from 'fs'
import { resolve } from 'path'
import * as express from 'express'
import { EventEmitter } from 'events'
import { type FetchStateResponse } from '../shared/contract'

const logs: string[] = []
const statesLog: State[] = []

const setLatestState = (state: State) => statesLog.push(state)
const getLatestState = () => statesLog[statesLog.length - 1]
const goBackOneState = () => statesLog.splice(statesLog.length - 1)

const ws = createWriteStream(resolve(__dirname, './log.txt'), { flags: 'a' })
const broadcast = new EventEmitter()
const input: InputSource = {
  getInput: () => {
    return new Promise(resolve => {
      broadcast.on('input', (message) => resolve(message))
    })
  }
}
const output: Output = {
  broadcast: (message: OutputMessage) => {
    if (typeof message === 'string') {
      // console.log(message)
      logs.push(message)
      if (logs.length > 50) {
        logs.shift()
      }
    } else {
      if (message.code === OutputMessageCode.INVALID_INPUT) {
        logs.push(message.log || 'Invalid input')
        invalidInput = message.log || null
      }
      if (JSON.stringify(message.state) !== JSON.stringify(getLatestState())) {
        setLatestState(message.state)
        ws.write(JSON.stringify(message.state) + '\n')
      }
    }
  }
}
let state = initState(defaultConfig, output)


let states = readFileSync(`/home/ophir/Desktop/gamestate.txt`).toString().split('\n')



state = JSON.parse(states[899])


statesLog.push(state)
engine.run(state, input, output)

let invalidInput: string | null = null

express()
  .use(express.json())
  .use(cors())
  .get('/', (req, res) => {
    const response: FetchStateResponse = { state: getLatestState(), logs }
    res.send(response)
  })
  .post('/input', (req, res) => {
    const input = req.body.input
    broadcast.emit('input', input)
    setTimeout(() => {
      if (invalidInput) {
        res.status(400).send({ invalidInput })
        invalidInput = null;
      } else {
        res.send('ok')
      }
    });
  })
  .post('/back', (req, res) => {
    console.log('/back endpoint called')
    broadcast.emit('going back one state')
    goBackOneState()
    res.send({ state: getLatestState(), logs })
  })
  .listen(3000)
