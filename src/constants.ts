import { Config } from './models'

export const defaultConfig: Config = {
  hotels: [
    ["Riviera", 0],
    ["Holiday", 0],
    ["LasVegas", 1],
    ["Park", 1],
    ["Olympia", 1],
    ["Europlaza", 2],
    ["Continental", 2],
  ],
  initCashPerPlayer: 5000,
  maxStocks: 24,
  numberOfPlayers: 2,
  possibleGameEndHotelSize: 42,
  unmergableHotelSize: 11,
  numberOfTilesPerPlayer: 6,
  priceTable: [200, 100, [2, 7, 10, 11, 12, 13, 14, 15, 16, 22, 23, 24]],
  boardHeight: 12,
  boardWidth: 10,
}
