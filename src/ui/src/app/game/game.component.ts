import { Component, TrackByFunction } from '@angular/core';
import { MergeDecision, State, StockDecision, Tile } from '../../../../engine/models'
import { clone, getHotelSize, getHotelStockPrice, getLastPlayedTile, getWhichHotelTileBelongsTo, getWhichHotelsInvolvedInMerge, hotelExistsOnBoard, isEqualTiles, isPossibleGameEnd } from '../../../../engine/helpers'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  title = 'ui';
  state!: State
  input: any = null
  cache: {
    [key: string]: {
      hotelSizes: number[]
    }
  } = {}
  logs: string[] = []

  _players: number[] | null = null
  get players() {
    if (!this.state) {
      return []
    }
    if (this._players) {
      return this._players
    }
    let players = []
    for (let i = 0; i < this.state.config.numberOfPlayers; i++) {
      players.push(i)
    }
    this._players = players
    return players
  }

  stockDecisions: { [key: number]: number } = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
  }

  trackByIndex: TrackByFunction<number> = (index: number) => {
    return index
  }

  ngOnInit() {
    this.fetchState()
  }

  async fetchState() {
    const { state, logs } = (await fetch('http://localhost:3000/').then(res => res.json()))
    this.state = state
    this.logs = logs
  }

  getFilteredState(): Partial<State> {
    const stateClone: Partial<State> = clone(this.state)
    delete stateClone.config
    delete stateClone.tilesPile
    delete stateClone.playerTiles
    delete stateClone.boardTiles
    delete stateClone.discardedTiles
    delete stateClone.stocks
    return stateClone
  }

  postInput(input?: any) {
    return fetch('http://localhost:3000/input', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: input ?? +this.input })
    }).then(() => {
      this.fetchState()
    })
  }

  onTileClick(tile: Tile) {
    if (this.state.phaseId === 'merge') {
      const hi = getWhichHotelTileBelongsTo(this.state, tile);
      const hotelsInvolvedInMerge = getWhichHotelsInvolvedInMerge(this.state, getLastPlayedTile(this.state))
      if (hotelsInvolvedInMerge.includes(hi)) {
        this.input = hi
        this.postInput()
        return
      }
    }
    if (!this.availableToPlay(tile)) {
      return
    }
    this.input = this.getCurrentPlayerTiles().findIndex(t => isEqualTiles(t, tile))
    this.postInput()
  }


  private availableToPlay(tile: Tile) {
    if (this.state.phaseId !== 'build') {
      return false
    }
    return this.getCurrentPlayerTiles().some(t => isEqualTiles(t, tile))
  }

  private getCurrentPlayerTiles() {
    return this.state.playerTiles[this.state.currentPlayerIndex].tiles
  }


  onMergeDecide(mergeDecisions: MergeDecision[]) {
    this.postInput(mergeDecisions)
  }


  onHotelInfoClick(hotelIndex: number) {
    if (this.isHotelClickable(hotelIndex)) {
      this.establish(hotelIndex)
    }
  }

  isHotelClickable(hi: number) {
    return this.state.phaseId === 'establish' && !hotelExistsOnBoard(this.state, hi)
  }

  establish(hotelIndex: number) {
    this.input = hotelIndex
    this.postInput()
  }

  getHotelLegendClass(hotelIndex: number) {
    if (this.state.hotels.find(h => h.hotelIndex === hotelIndex)) {
      return 'hotel-' + hotelIndex
    }
    return ''
  }

  getHotelSize(hotelIndex: number) {
    return this.getHotelSizes()[hotelIndex]
  }

  getSubtotal() {
    let subtotal = 0
    for (let i = 0; i < this.state.config.hotels.length; i++) {
      if (!hotelExistsOnBoard(this.state, (i))) {
        continue
      }
      subtotal += getHotelStockPrice(this.state, i) * this.stockDecisions[i]
    }
    return subtotal
  }

  finish() {
    this.input = 'finish'
    this.postInput('finish')
  }

  postInvest() {
    const stockDecisions: StockDecision[] = Object.entries(this.stockDecisions).map(([key, value]) => {
      return {
        hotelIndex: +key,
        amount: value
      }
    })
      .filter((decision: StockDecision) => decision.amount > 0)
      .filter(decision => hotelExistsOnBoard(this.state, decision.hotelIndex))

    this.input = stockDecisions

    this.postInput(stockDecisions).then(() => {
      Object.keys(this.stockDecisions).forEach(key => {
        this.stockDecisions[+key] = 0
      })
    })
  }

  isPossibleGameEnd() {
    return this.state.phaseId == 'build' && isPossibleGameEnd(this.state)
  }

  private getHotelSizes() {
    const cacheEntry = this.cache[JSON.stringify(this.state)]
    if (cacheEntry) {
      return cacheEntry.hotelSizes
    }
    const hotelSizes = []
    for (let i = 0; i < this.state.config.hotels.length; i++) {
      if (this.state.hotels.find(h => h.hotelIndex === i)) {
        hotelSizes.push(getHotelSize(this.state, i))
      } else {
        hotelSizes.push(0)
      }
    }
    this.cache[JSON.stringify(this.state)] = { hotelSizes }
    return hotelSizes
  }
}
