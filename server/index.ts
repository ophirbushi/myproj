import { initState } from '../engine/init'
import * as engine from '../engine/engine'
import { Config, Input, InputSource, Output, OutputMessage, OutputMessageCode, State } from '../engine/models'
import * as cors from 'cors'
import * as express from 'express'
import { EventEmitter } from 'events'
import { CreateGameResponse, type FetchStateResponse } from '../shared/contract'
import { defaultConfig } from '../engine/constants';

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
  latestState!: State

  broadcast(message: OutputMessage | string): void {
    if (typeof message === 'string') {
      this.logs.push(message)
      if (this.logs.length > 40) {
        this.logs.shift()
      }
    } else {
      if (message.code === OutputMessageCode.INVALID_INPUT) {
        this.logs.push(message.log || 'Invalid input')
        this.invalidInput = message.log || null
      }
      this.latestState = message.state
    }
  }
}

const games: { [gameId: string]: { state: State, input: WriteableInputSource, output: WriteableOutput } } = {}
let gameIdCounter = 0

const app = express()
app.use(express.json())
app.use(cors())


const clientLogIndices: { [clientId: string]: { [gameId: string]: number } } = {};

app.get('/game/:gameId', (req, res) => {
  const gameId = req.params.gameId
  const clientId = req.query.clientId as string;

  if (!games[gameId]) {
    res.sendStatus(404)
    return
  }

  if (!clientId) {
    res.status(400).send({ error: 'clientId is required' });
    return;
  }

  const { output, state } = games[gameId];

  // Initialize clientLogIndices for this client and game if not already set
  if (!clientLogIndices[clientId]) {
    clientLogIndices[clientId] = {};
  }
  if (clientLogIndices[clientId][gameId] == null) {
    clientLogIndices[clientId][gameId] = 0;
  }

  // const lastLogIndex = clientLogIndices[clientId][gameId];
  // const newLogs = output.logs.slice(lastLogIndex);

  const response: FetchStateResponse = {
    state: output.latestState || state,
    logs: output.logs
  }

  // clientLogIndices[clientId][gameId] += newLogs.length;
  res.send(response)
})

app.post('/game', (req, res) => {
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

app.patch('/game/:gameId', (req, res) => {
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

app.listen(3000)
