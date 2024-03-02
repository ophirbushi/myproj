import { Config } from './models'

export const defaultConfig: Config = {
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
  numberOfPlayers: 2,
  possibleGameEndHotelSize: 42,
  unmergableHotelSize: 11,
  numberOfTilesPerPlayer: 6,
  priceTable: {
    init: 200,
    step: 100,
    levels: [2, 7, 10, 11, 12, 13, 14, 15, 16, 22, 23, 24],
  },
  boardHeight: 12,
  boardWidth: 10,
}
