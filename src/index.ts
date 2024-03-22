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


const output: Output = {
  broadcast: (message: OutputMessage) => {
    console.log(message.log, { message })
    latestState = message.state

    ws.write(JSON.stringify(message.state) + '\n')
  }
}

let state: State

state = initState(defaultConfig)

state = { "config": { "numberOfPlayers": 2, "hotels": [{ "hotelName": "Riviera", "prestige": 0 }, { "hotelName": "Holiday", "prestige": 0 }, { "hotelName": "LasVegas", "prestige": 1 }, { "hotelName": "Park", "prestige": 1 }, { "hotelName": "Olympia", "prestige": 1 }, { "hotelName": "Europlaza", "prestige": 2 }, { "hotelName": "Continental", "prestige": 2 }], "initCashPerPlayer": 5000, "maxStocks": 24, "maxStocksPurchasePerTurn": 3, "possibleGameEndHotelSize": 42, "unmergableHotelSize": 11, "numberOfTilesPerPlayer": 6, "priceTable": { "init": 200, "step": 100, "levels": [2, 3, 4, 5, 6, 11, 21, 31, 41] }, "boardHeight": 7, "boardWidth": 9 }, "cash": [5000, 5000], "hotels": [{ "hotelIndex": 1, "x": 4, "y": 4 }, { "hotelIndex": 2, "x": 8, "y": 3 }, { "hotelIndex": 5, "x": 4, "y": 1 }], "playerTiles": [{ "playerIndex": 0, "tiles": [[0, 5], [0, 6], [1, 4], [8, 0], [0, 0], [1, 3]] }, { "playerIndex": 1, "tiles": [[0, 4], [0, 2], [0, 1], [7, 5], [8, 1]] }], "boardTiles": [[5, 1], [7, 3], [4, 3], [4, 4], [5, 4], [8, 3], [4, 5], [7, 6], [3, 4], [6, 2], [2, 3], [2, 5], [2, 4], [4, 1], [2, 1], [2, 2], [1, 2], [2, 0], [5, 2], [6, 3]], "discardedTiles": [[5, 1], [7, 3], [4, 3], [4, 4], [5, 4], [8, 3], [4, 5], [7, 6], [3, 4], [6, 2], [2, 3], [2, 5], [2, 4], [4, 1], [2, 1], [2, 2], [1, 2], [2, 0], [5, 2], [6, 3]], "tilesPile": [[7, 1], [7, 0], [0, 3], [2, 6], [1, 6], [8, 5], [6, 4], [8, 4], [5, 0], [3, 2], [7, 2], [6, 6], [6, 0], [1, 1], [8, 6], [5, 5], [3, 3], [3, 1], [3, 0], [4, 6], [7, 4], [5, 3], [1, 5], [6, 1], [6, 5], [3, 5], [3, 6], [1, 0], [4, 0], [5, 6], [4, 2], [8, 2]], "stocks": { "0": [0, 0], "1": [0, 0], "2": [0, 0], "3": [0, 0], "4": [0, 0], "5": [0, 0], "6": [0, 0] }, "currentPlayerIndex": 1, "decidingPlayerIndex": 1, "phaseId": "mergeDecide", "mergingHotelIndex": 5 }


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
