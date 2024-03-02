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
}

export type Phase = 'build' | 'establish' | 'merge' | 'mergeDecide' | 'invest' | 'gameEnd'

export type TileEffect = 'replace' | 'merge' | 'establish' | 'noop'

export interface State {
  config: Config
  tiles: [number, number][]
  discardedTiles: [number, number][]
  hotels: { hotelIndex: number, x: number, y: number }[]
  cash: number[]
  playerTiles: { playerIndex: number, tiles: [number, number][] }[]
  stocks: { [hotelIndex: number]: number[] }
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