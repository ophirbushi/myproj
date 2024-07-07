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

const games: { [gameId: number]: Game } = {}
const wsClients: WebSocket[] = []

let gameIdCounter = 0

const broadcastToGame = (message: any) => {
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
  next()
})

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

app.options('/new-game')
app.post('/new-game', async (req, res) => {
  const { playerName } = req.body
  if (!playerName) {
    return res.status(400).send({ error: '"playerName" parameter is missing in request body' })
  }
  const gameId = ++gameIdCounter
  games[gameId] = new Game(playerName)
  res.send({ gameId })
})

app.options('/join-game')
app.post('/join-game', async (req, res) => {
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
  if (game.players.includes(playerName)) {
    return res.send({ message: `Player ${playerName} is already in game ${gameId}` })
  }
  game.players.push(playerName)
  broadcastToGame({
    gameId,
    type: 'player-joined',
    players: game.players
  })
  res.send({ message: `Player ${playerName} joined game ${gameId}` })
})

server.listen(PORT, () => {
  console.log(`Game server is running on port ${PORT}`)
})
