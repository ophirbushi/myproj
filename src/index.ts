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
// state = { "config": { "numberOfPlayers": 2, "hotels": [{ "hotelName": "Riviera", "prestige": 0 }, { "hotelName": "Holiday", "prestige": 0 }, { "hotelName": "LasVegas", "prestige": 1 }, { "hotelName": "Park", "prestige": 1 }, { "hotelName": "Olympia", "prestige": 1 }, { "hotelName": "Europlaza", "prestige": 2 }, { "hotelName": "Continental", "prestige": 2 }], "initCashPerPlayer": 5000, "maxStocks": 24, "possibleGameEndHotelSize": 42, "unmergableHotelSize": 11, "numberOfTilesPerPlayer": 12, "priceTable": { "init": 200, "step": 100, "levels": [2, 7, 10, 11, 12, 13, 14, 15, 16, 22, 23, 24] }, "boardHeight": 9, "boardWidth": 7 }, "cash": [5000, 5000], "hotels": [{ "hotelIndex": 2, "x": 3, "y": 8 }, { "hotelIndex": 1, "x": 2, "y": 6 }], "playerTiles": [{ "playerIndex": 0, "tiles": [[3, 3], [6, 7], [4, 6], [2, 2], [1, 6], [2, 1], [0, 2], [0, 4], [1, 3], [2, 8], [3, 4], [5, 7]] }, { "playerIndex": 1, "tiles": [[6, 6], [1, 2], [4, 1], [0, 7], [2, 4], [1, 1], [4, 5], [4, 4], [0, 6], [2, 3], [6, 5]] }], "boardTiles": [[4, 8], [4, 2], [3, 8], [4, 7], [2, 7], [2, 6], [3, 6], [5, 5]], "discardedTiles": [[4, 8], [4, 2], [3, 8], [4, 7], [2, 7], [2, 6], [3, 6], [5, 5]], "tilesPile": [[1, 7], [4, 0], [5, 4], [3, 5], [1, 8], [3, 1], [5, 2], [0, 8], [6, 1], [1, 5], [3, 0], [1, 4], [5, 8], [6, 3], [6, 4], [4, 3], [0, 5], [0, 0], [0, 3], [6, 0], [6, 8], [3, 7], [2, 0], [2, 5], [0, 1], [5, 6], [3, 2], [6, 2], [5, 3], [1, 0], [5, 0], [5, 1]], "stocks": { "0": [0, 0], "1": [0, 0], "2": [0, 0], "3": [0, 0], "4": [0, 0], "5": [0, 0], "6": [0, 0] }, "currentPlayerIndex": 1, "decidingPlayerIndex": 0, "phaseId": "invest", "mergingHotelIndex": -1 }
state = { "config": { "numberOfPlayers": 2, "hotels": [{ "hotelName": "Riviera", "prestige": 0 }, { "hotelName": "Holiday", "prestige": 0 }, { "hotelName": "LasVegas", "prestige": 1 }, { "hotelName": "Park", "prestige": 1 }, { "hotelName": "Olympia", "prestige": 1 }, { "hotelName": "Europlaza", "prestige": 2 }, { "hotelName": "Continental", "prestige": 2 }], "initCashPerPlayer": 5000, "maxStocks": 24, "possibleGameEndHotelSize": 42, "unmergableHotelSize": 11, "numberOfTilesPerPlayer": 12, "priceTable": { "init": 200, "step": 100, "levels": [2, 7, 10, 11, 12, 13, 14, 15, 16, 22, 23, 24] }, "boardHeight": 9, "boardWidth": 7 }, "cash": [5000, 5000], "hotels": [{ "hotelIndex": 1, "x": 2, "y": 4 }, { "hotelIndex": 0, "x": 0, "y": 2 }], "playerTiles": [{ "playerIndex": 0, "tiles": [[6, 4], [0, 7], [2, 7], [5, 1], [5, 7], [1, 0], [6, 8], [3, 1], [4, 5], [6, 7], [4, 0], [3, 2]] }, { "playerIndex": 1, "tiles": [[6, 6], [0, 4], [0, 3], [6, 3], [4, 6], [5, 4], [6, 2], [0, 8], [6, 0], [4, 1], [3, 8]] }], "boardTiles": [[3, 4], [5, 3], [2, 5], [2, 4], [1, 2], [3, 3], [0, 2], [1, 3], [2, 6], [1, 4]], "discardedTiles": [[3, 4], [5, 3], [2, 5], [2, 4], [1, 2], [3, 3], [0, 2], [1, 3], [2, 6], [1, 4]], "tilesPile": [[6, 1], [1, 1], [4, 4], [3, 0], [1, 8], [2, 1], [2, 0], [4, 2], [4, 8], [1, 7], [6, 5], [0, 0], [5, 5], [1, 5], [3, 6], [4, 7], [1, 6], [3, 5], [5, 8], [0, 5], [0, 1], [5, 0], [5, 6], [5, 2], [2, 3], [3, 7], [2, 2], [2, 8], [4, 3], [0, 6]], "stocks": { "0": [0, 0], "1": [0, 0], "2": [0, 0], "3": [0, 0], "4": [0, 0], "5": [0, 0], "6": [0, 0] }, "currentPlayerIndex": 1, "decidingPlayerIndex": 0, "phaseId": "invest", "mergingHotelIndex": 1 }

state = { "config": { "numberOfPlayers": 2, "hotels": [{ "hotelName": "Riviera", "prestige": 0 }, { "hotelName": "Holiday", "prestige": 0 }, { "hotelName": "LasVegas", "prestige": 1 }, { "hotelName": "Park", "prestige": 1 }, { "hotelName": "Olympia", "prestige": 1 }, { "hotelName": "Europlaza", "prestige": 2 }, { "hotelName": "Continental", "prestige": 2 }], "initCashPerPlayer": 5000, "maxStocks": 24, "possibleGameEndHotelSize": 42, "unmergableHotelSize": 11, "numberOfTilesPerPlayer": 12, "priceTable": { "init": 200, "step": 100, "levels": [2, 7, 10, 11, 12, 13, 14, 15, 16, 22, 23, 24] }, "boardHeight": 9, "boardWidth": 7 }, "cash": [5000, 5000], "hotels": [{ "hotelIndex": 0, "x": 2, "y": 4 }, { "hotelIndex": 1, "x": 0, "y": 3 }], "playerTiles": [{ "playerIndex": 0, "tiles": [[0, 8], [1, 8], [4, 7], [4, 4], [6, 2], [4, 0], [5, 2], [6, 5], [6, 3], [5, 8], [4, 6]] }, { "playerIndex": 1, "tiles": [[5, 4], [5, 3], [5, 7], [0, 0], [6, 8], [2, 8], [5, 6], [1, 0], [5, 1], [5, 0], [6, 6], [1, 4]] }], "boardTiles": [[2, 5], [4, 5], [2, 4], [1, 3], [3, 3], [0, 3], [1, 2], [0, 4], [2, 6], [0, 1], [2, 2], [4, 2], [3, 2]], "discardedTiles": [[2, 5], [4, 5], [2, 4], [1, 3], [3, 3], [0, 3], [1, 2], [0, 4], [2, 6], [0, 1], [2, 2], [4, 2], [3, 2]], "tilesPile": [[1, 5], [4, 1], [2, 1], [3, 5], [6, 1], [3, 0], [4, 3], [3, 1], [3, 4], [0, 2], [2, 7], [1, 7], [0, 6], [6, 7], [3, 8], [2, 3], [3, 7], [0, 5], [4, 8], [2, 0], [1, 6], [1, 1], [3, 6], [6, 4], [0, 7], [5, 5], [6, 0]], "stocks": { "0": [0, 0], "1": [0, 0], "2": [0, 0], "3": [0, 0], "4": [0, 0], "5": [0, 0], "6": [0, 0] }, "currentPlayerIndex": 0, "decidingPlayerIndex": 0, "phaseId": "invest", "mergingHotelIndex": -1 }

// state = initState(defaultConfig)
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
