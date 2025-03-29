import { Config } from './models'

export const defaultConfig: Config = {
  numberOfPlayers: 4,
  hotels: [
    { hotelName: "Riviera", prestige: 0 },
    { hotelName: "Holiday", prestige: 0 },
    { hotelName: "LasVegas", prestige: 1 },
    { hotelName: "Park", prestige: 1 },
    { hotelName: "Olympia", prestige: 1 },
    { hotelName: "Europlaza", prestige: 2 },
    { hotelName: "Continental", prestige: 2 },
  ],
  initCashPerPlayer: 5000,
  maxStocks: 24,
  maxStocksPurchasePerTurn: 3,
  possibleGameEndHotelSize: 42,
  unmergableHotelSize: 11,
  numberOfTilesPerPlayer: 6,
  priceTable: {
    init: 200,
    step: 100,
    levels: [2, 3, 4, 5, 6, 11, 21, 31, 41],
  },
  boardHeight: 9,
  boardWidth: 12,
}
