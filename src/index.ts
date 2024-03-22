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

state = initState(defaultConfig)

state  = {"config":{"numberOfPlayers":2,"hotels":[{"hotelName":"Riviera","prestige":0},{"hotelName":"Holiday","prestige":0},{"hotelName":"LasVegas","prestige":1},{"hotelName":"Park","prestige":1},{"hotelName":"Olympia","prestige":1},{"hotelName":"Europlaza","prestige":2},{"hotelName":"Continental","prestige":2}],"initCashPerPlayer":5000,"maxStocks":24,"possibleGameEndHotelSize":42,"unmergableHotelSize":11,"numberOfTilesPerPlayer":6,"priceTable":{"init":200,"step":100,"levels":[2,7,10,11,12,13,14,15,16,22,23,24]},"boardHeight":9,"boardWidth":12},"cash":[5000,5000],"hotels":[{"hotelIndex":3,"x":5,"y":4},{"hotelIndex":5,"x":4,"y":6},{"hotelIndex":6,"x":2,"y":7},{"hotelIndex":0,"x":0,"y":3},{"hotelIndex":1,"x":11,"y":2}],"playerTiles":[{"playerIndex":0,"tiles":[[2,0],[4,0],[0,1],[1,0],[5,5],[4,1]]},{"playerIndex":1,"tiles":[[8,0],[10,1],[11,6],[10,0],[8,1]]}],"boardTiles":[[7,2],[6,2],[9,5],[9,4],[5,3],[4,2],[6,5],[7,6],[5,6],[1,2],[3,4],[2,6],[4,7],[8,8],[5,8],[10,5],[5,4],[8,5],[6,3],[8,7],[11,7],[4,6],[2,8],[11,5],[0,6],[2,7],[3,2],[8,3],[8,2],[9,2],[7,0],[10,3],[4,4],[1,7],[0,4],[4,8],[2,1],[3,3],[2,3],[11,4],[5,2],[0,3],[8,4],[6,1],[11,1],[11,2],[8,6],[6,7]],"discardedTiles":[[7,2],[6,2],[9,5],[9,4],[5,3],[4,2],[6,5],[7,6],[5,6],[1,2],[3,4],[2,6],[4,7],[8,8],[5,8],[10,5],[5,4],[8,5],[6,3],[8,7],[11,7],[4,6],[2,8],[11,5],[0,6],[2,7],[3,2],[8,3],[8,2],[9,2],[7,0],[10,3],[4,4],[1,7],[0,4],[4,8],[2,1],[3,3],[2,3],[11,4],[5,2],[0,3],[8,4],[6,1],[11,1],[11,2],[8,6],[6,7]],"tilesPile":[[1,3],[3,7],[11,8],[1,5],[6,4],[3,0],[4,3],[10,8],[0,7],[11,3],[2,4],[5,0],[1,6],[11,0],[9,6],[0,8],[3,1],[2,5],[7,3],[5,7],[0,5],[1,4],[10,6],[7,4],[3,5],[6,8],[1,8],[9,7],[9,3],[7,5],[10,2],[6,6],[9,8],[3,8],[4,5],[10,4],[6,0],[5,1],[7,1],[0,2],[2,2],[0,0],[3,6],[10,7],[7,7],[9,1],[1,1],[9,0],[7,8]],"stocks":{"0":[0,0],"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0],"5":[0,0],"6":[0,0]},"currentPlayerIndex":1,"decidingPlayerIndex":0,"phaseId":"invest","mergingHotelIndex":3}


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
