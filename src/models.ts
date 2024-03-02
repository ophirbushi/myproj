export interface Config {
  numberOfPlayers: number
  initCashPerPlayer: number
  maxStocks: number
  unmergableHotelSize: number
  hotels: [string, number][]
  possibleGameEndHotelSize: number
  numberOfTilesPerPlayer: number
  priceTable: [number, number, number[]] // init, step, levels
  boardWidth: number
  boardHeight: number
}

export type Phase = 'pregame' | 'selectTile' | 'selectHotel' | 'decideStocks' | 'buyStocks' | 'gameEnd'

export interface State {
  config: Config
  tiles: [number, number][]
  discardedTiles: [number, number][]
  hotels: [number, number, number][] // hotelIndex, x, y
  cash: number[]
  playerTiles: [number, number][][]
  stocks: number[][] // player, hotelIndex, numberOfStocks
  phaseId: Phase
  playerIndex: number
  decidingPlayerIndex: number
}

export interface Input {
  getInput<T>(): Promise<T>
}

export enum OutputMessageCode {
  ENGINE_START = 0,
  SUCCESS = 1,
  WAITING_FOR_INPUT = 2,
  INVALID_INPUT = 3,
}

export interface OutputMessage {
  state: State
  code: number
  log?: string
}

export interface Output {
  broadcast(message: OutputMessage): void
}
