import { initState } from '../engine/init'
import * as cors from 'cors'
import * as express from 'express'
import { fileDBAdaptor } from './filedb'
import { DBAdaptor } from './db'
import { GameInstance, OutputMessage, State } from '../engine/models'
import { validateInput } from '../engine/validators'
import * as engine from '../engine/engine'
import { defaultConfig } from '../engine/constants'
import { EventEmitterInput, EventEmitterOutput } from './io'

let db: DBAdaptor = fileDBAdaptor

const persistGameState = async (gameId: string, state: State) => {
  await db.set(gameId, state)
}

const fetchGameState = async (gameId: string): Promise<State> => {
  return await db.get(gameId)
}

const getGameInstance = (gameId: string): GameInstance => {
  return games[gameId]
}

const runGame = (gameId: string, state: State): GameInstance => {
  const input = new EventEmitterInput()
  const output = new EventEmitterOutput()
  const gameInstance = engine.run(gameId, state, input, output)
  games[gameId] = gameInstance
  const onMessage = (msg: OutputMessage) => {
    persistGameState(gameId, msg.state)
  }
  gameInstance.output.onMessage(onMessage)
  return gameInstance
}

const games: { [gameId: string]: GameInstance } = {}

const newGame = async (req: express.Request, res: express.Response) => {
  try {
    const gameId = Date.now().toString()
    const config = req.body.config || defaultConfig
    const metadata = req.body.metadata || {}
    const gameInstance = runGame(gameId, initState(config, metadata))
    res.send({ gameId, state: gameInstance.state })
  } catch (err) {
    res.status(500).send({ error: err })
  }
}

const getGameState = async (req: express.Request, res: express.Response) => {
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
}

const postGameInput = async (req: express.Request, res: express.Response) => {
  const input = req.body.input
  const gameId = req.params.gameId
  if (input == null || !gameId) {
    res.status(400).send({ error: 'missing input or gameId' })
    return
  }
  try {
    const gameInstance = getGameInstance(gameId)
    if (!gameInstance) {
      res.status(404).send({ error: 'game not found' })
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
}

express()
  .use(express.json())
  .use(cors())
  .post('/game', newGame)
  .get('/game/:gameId/state', getGameState)
  .post('/game/:gameId/input', postGameInput)
  .listen(3000)
