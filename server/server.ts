import * as express from 'express'
import { createServer } from 'http'
import { WebSocket, WebSocketServer } from 'ws'
import { State } from '../engine/models'

const PORT = 3000
const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

class Game {
  players: string[] = []
  gameState: State | null = null
  started = false
  constructor(public host: string) {
    this.players.push(host)
  }
}

export interface GameStateMessage {
  type: string
  gameId: number
  players: string[]
  state: State | null
  started: boolean
  message: string
}

const games: { [gameId: number]: Game } = {}
const wsClients: WebSocket[] = []

let gameIdCounter = 0

const broadcastToGame = (message: GameStateMessage) => {
  wsClients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message))
    }
  })
}

wss.on('connection', (ws: WebSocket) => {
  wsClients.push(ws)
  console.log('Client connected', wsClients)
  ws.once('close', () => {
    wsClients.splice(wsClients.indexOf(ws), 1)
    console.log('Client disconnected', wsClients)
  })
})

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS')
  next()
})

app.options('/game')

app.get('/game', async (req, res) => {
  const { gameId } = req.query
  if (!gameId) {
    return res.status(400).send({ error: '"gameId" query parameter is missing' })
  }
  const game = games[+gameId]
  if (!game) {
    return res.status(404).send({ error: `could not find a game with gameId: ${gameId}` })
  }
  res.send({ game })
})

app.post('/game', async (req, res) => {
  const { playerName } = req.body
  if (!playerName) {
    return res.status(400).send({ error: '"playerName" parameter is missing in request body' })
  }
  const gameId = ++gameIdCounter
  games[gameId] = new Game(playerName)
  res.send({ gameId })
})

app.put('/game', async (req, res) => {
  const { gameId, playerName } = req.body
  if (!gameId) {
    return res.status(400).send({ error: '"gameId" parameter is missing in request body' })
  }
  if (!playerName) {
    return res.status(400).send({ error: '"playerName" parameter is missing in request body' })
  }
  const game = games[gameId]
  if (!game) {
    return res.status(404).send({ error: `could not find a game with gameId: ${gameId}` })
  }
  if (game.started) {
    return res.status(400).send({ message: `Game ${gameId} has already started` })
  }
  let message = ''
  if (!game.players.includes(playerName)) {
    game.players.push(playerName)
    message = `Player ${playerName} joined game ${gameId}`
  }
  const gameStateMessage: GameStateMessage = {
    gameId,
    type: 'player-joined',
    players: game.players,
    started: game.started,
    state: game.gameState,
    message
  }
  broadcastToGame(gameStateMessage)
  res.send(gameStateMessage)
})

server.listen(PORT, () => {
  console.log(`Game server is running on port ${PORT}`)
})
