import { EventEmitter } from 'events'

export interface Config {
  numberOfPlayers: number
  initCashPerPlayer: number
  maxStocks: number
  unmergableHotelSize: number
  hotels: Array<{ hotelName: string, prestige: number }>
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

export interface State<T = any> {
  metadata?: T
  config: Config
  tilesPile: Tile[]
  boardTiles: Tile[]
  discardedTiles: Tile[]
  hotels: Array<{ hotelIndex: number, x: number, y: number }>
  cash: number[]
  playerTiles: Array<{ playerIndex: number, tiles: Tile[] }>
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

export interface Input {
  getInput: <T>() => Promise<T>
}

export interface Output {
  broadcast: (message: OutputMessage) => void
}

export class EventEmitterInput implements Input {
  eventEmitter = new EventEmitter()
  getInput = async<T>() => {
    return await new Promise<T>((resolve, reject) => {
      this.eventEmitter.on('input', resolve)
    })
  }
  postInput = <T>(input: T) => {
    this.eventEmitter.emit('input', input)
  }
}

export class EventEmitterOutput implements Output {
  eventEmitter = new EventEmitter()
  onMessage = (callback: (message: OutputMessage) => void) => {
    this.eventEmitter.on('message', callback)
  }
  broadcast = (message: OutputMessage) => {
    this.eventEmitter.emit('message', message)
  }
}

export interface GameInstance {
  gameId: string
  isRunning: boolean
  isError: boolean
  state: State
  input: Input
  output: Output
  gameLoop: Promise<void>
  error?: any
}

export interface EventEmitterGameInstance extends GameInstance {
  input: EventEmitterInput
  output: EventEmitterOutput
}
