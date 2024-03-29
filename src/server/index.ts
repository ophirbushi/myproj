import { initState } from '../engine/init'
import * as cors from 'cors'
import * as express from 'express'
import { fileDBAdaptor } from './filedb'
import { DBAdaptor } from './db'
import { Input, OutputMessage, State } from '../engine/models'
import { validateInput } from '../engine/validators'
import * as engine from '../engine/engine'
import { EventEmitter } from 'events'
import { defaultConfig } from '../engine/constants'

let db: DBAdaptor = fileDBAdaptor

setInterval(() => {
  ''
}, 1000)

export interface EventEmitterInput extends Input {
  eventEmitter: EventEmitter
  getInput: <T>() => Promise<T>
  postInput: (input: any) => void
}

export interface EventEmitterGameInstance extends engine.GameInstance {
  input: EventEmitterInput
  output: engine.EventEmitterOutput
}

const newEventEmitterInput = (): EventEmitterInput => {
  const inputInstance: EventEmitterInput = {} as any
  inputInstance.eventEmitter = new EventEmitter()
  inputInstance.getInput = async () => {
    return await new Promise((resolve, reject) => {
      inputInstance.eventEmitter.on('input', resolve)
    })
  }
  inputInstance.postInput = (input) => {
    inputInstance.eventEmitter.emit('input', input)
  }
  return inputInstance
}

const persistGameState = async (gameId: string, state: State) => {
  await db.set(gameId, state)
}

const fetchGameState = async (gameId: string): Promise<State> => {
  return await db.get(gameId)
}

const getGameInstance = (gameId: string): engine.GameInstance => {
  return games[gameId]
}

const runGame = (gameId: string, state: State): EventEmitterGameInstance => {
  const input = newEventEmitterInput()
  const output = new engine.EventEmitterOutput()
  const gameInstance = engine.run(gameId, state, input, output) as EventEmitterGameInstance
  games[gameId] = gameInstance
  const onMessage = (msg: OutputMessage) => {
    persistGameState(gameId, msg.state)
  }
  gameInstance.output.onMessage(onMessage)
  return gameInstance
}

const games: { [gameId: string]: engine.GameInstance } = {}

express()
  .use(express.json())
  .use(cors())
  .post('/game', async (req, res) => {
    try {
      const gameId = Date.now().toString()
      const config = req.body.config || defaultConfig
      const metadata = req.body.metadata || {}
      const gameInstance = runGame(gameId, initState(config, metadata))
      res.send({ gameId, state: gameInstance.state })
    } catch (err) {
      res.status(500).send({ error: err })
    }
  })
  .get('/game/:gameId/state', async (req, res) => {
    try {
      const gameId = req.params.gameId
      let gameInstance = getGameInstance(gameId)
      if (!gameInstance) {
        const state = await fetchGameState(gameId)
        if (!state) {
          res.status(404).send({ error: 'game not found' })
          return
        }
        gameInstance = runGame(gameId, state)
      }
      res.send(gameInstance.state)
    } catch (err) {
      res.status(500).send({ error: err })
    }
  })
  .post('/game/:gameId/input', async (req, res) => {
    const input = req.body.input
    const gameId = req.params.gameId
    if (!input || !gameId) {
      res.status(400).send({ error: 'missing input or gameId' })
      return
    }
    try {
      const gameInstance = getGameInstance(gameId)
      if (!gameInstance) {
        res.status(404).send({ error: 'game not found' })
        return
      }
      if (!gameInstance.isRunning) {
        res.status(400).send({ error: 'game not running', gameError: gameInstance.error })
        return
      }
      const state = gameInstance.state
      const inputValid = validateInput(state, input)
      if (!inputValid) {
        res.status(400).send({ error: 'input invalid' })
        return
      }
      gameInstance.input.postInput(input)
      // TODO: remove:
      await new Promise((resolve) => setTimeout(resolve, 5))
      if (!gameInstance.isRunning) {
        res.status(400).send({ error: 'input crashed game', gameError: gameInstance.error })
        return
      }
      res.send({ state: gameInstance.state })
    } catch (err) {
      res.status(500).send({ error: err })
    }
  })
  .listen(3000)
