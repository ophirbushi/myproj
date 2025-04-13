import { initState } from '../engine/init'
import * as engine from '../engine/engine'
import { Config, Input, InputSource, Output, OutputMessage, OutputMessageCode, State } from '../engine/models'
import * as cors from 'cors'
import * as express from 'express'
import { EventEmitter } from 'events'
import { CreateGameResponse, type FetchStateResponse } from '../shared/contract'

class WriteableInputSource implements InputSource {
  eventEmitter = new EventEmitter()

  getInput<T>(): Promise<Input<T>> {
    return new Promise(resolve => {
      this.eventEmitter.on('input', (message: Input<T>) => resolve(message))
    })
  }

  setInput<T>(input: Input<T>) {
    this.eventEmitter.emit('input', input)
  }
}

class WriteableOutput implements Output {
  logs: string[] = []
  invalidInput: string | null = null

  broadcast(message: OutputMessage | string): void {
    if (typeof message === 'string') {
      this.logs.push(message)
      if (this.logs.length > 50) {
        this.logs.shift()
      }
    } else if (message.code === OutputMessageCode.INVALID_INPUT) {
      this.logs.push(message.log || 'Invalid input')
      this.invalidInput = message.log || null
    }
  }
}

const games: { [gameId: string]: { state: State, input: WriteableInputSource, output: WriteableOutput } } = {}
let gameIdCounter = 0

express()
  .use(express.json())
  .use(cors())
  .get('/game/:gameId', (req, res) => {
    const gameId = req.params.gameId
    if (!games[gameId]) {
      res.sendStatus(404)
      return
    }
    const { output, state } = games[gameId]
    const response: FetchStateResponse = {
      state,
      logs: output.logs
    }
    res.send(response)
  })
  .post('/game', (req, res) => {
    const config = req.body.config as Config
    if (!config) {
      res.status(400).send({ error: 'config is missing' })
    }
    const input = new WriteableInputSource()
    const output = new WriteableOutput()
    const state = initState(config, output)
    games[++gameIdCounter] = { state, input, output }
    engine.run(state, input, output)
    const response: CreateGameResponse = {
      gameId: gameIdCounter.toString(),
      state,
      logs: output.logs
    }
    res.send(response)
  })
  .patch('/game/:gameId', (req, res) => {
    const gameId = req.params.gameId
    const game = games[gameId]
    if (!game) {
      res.sendStatus(404)
      return
    }
    const input = req.body.input
    if (input == null) {
      res.sendStatus(400)
      return
    }
    game.input.setInput(input)
    setTimeout(() => {
      if (game.output.invalidInput) {
        res.status(400).send({ invalidInput: game.output.invalidInput })
        game.output.invalidInput = null
      } else {
        res.sendStatus(200)
      }
    })
  })
  .listen(3000)
