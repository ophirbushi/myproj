export interface Config {
  numberOfPlayers: number
  initCashPerPlayer: number
  maxStocks: number
  unmergableHotelSize: number
  hotels: { hotelName: string, prestige: number }[]
  possibleGameEndHotelSize: number
  numberOfTilesPerPlayer: number
  priceTable: { init: number, step: number, levels: number[] }
  boardWidth: number
  boardHeight: number
  maxStocksPurchasePerTurn: number
}

export type Tile = [number, number]

export type Phase = 'build' | 'establish' | 'merge' | 'mergeDecide' | 'invest' | 'gameEnd'

export type TileEffect = 'merge' | 'establish' | 'noop'

export interface State {
  config: Config
  tilesPile: Tile[]
  boardTiles: Tile[]
  discardedTiles: Tile[]
  hotels: { hotelIndex: number, x: number, y: number }[]
  cash: number[]
  playerTiles: { playerIndex: number, tiles: Tile[] }[]
  stocks: { [hotelIndex: number]: number[] }
  phaseId: Phase
  currentPlayerIndex: number
  decidingPlayerIndex: number
  mergingHotelIndex: number
}

export interface StockDecision {
  hotelIndex: number
  amount: number
}

export interface MergeDecision {
  hotelIndex: number
  convert: number
  sell: number
}

export interface Input<T> {
  playerIndex: number;
  data: T;
}

export interface InputSource {
  getInput<T>(): Promise<Input<T>>
}

export enum OutputMessageCode {
  ENGINE_START = 0,
  SUCCESS = 1,
  WAITING_FOR_INPUT = 2,
  INVALID_INPUT = 3,
  GAME_END = 4
}

export interface OutputMessage {
  state: State
  code: number
  log?: string
}

export interface Output {
  broadcast(message: OutputMessage | string): void
}
