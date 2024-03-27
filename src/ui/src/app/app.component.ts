import { Component, TrackByFunction } from '@angular/core'
import { MergeDecision, State, StockDecision, Tile } from '../../../engine/models'
import { clone, getHotelSize, getHotelStockPrice, getLastPlayedTile, getWhichHotelTileBelongsTo, getWhichHotelsInvolvedInMerge, hotelExistsOnBoard, isEqualTiles, isPossibleGameEnd } from '../../../engine/helpers'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ui'
  state!: State
  input: any = null
  cache: {
    [key: string]: {
      hotelSizes: number[]
    }
  } = {}

  _players: number[] | null = null
  get players () {
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

  mergeDecisions: { [key: number]: { sell: number, convert: number } } = {
    0: { sell: 0, convert: 0 },
    1: { sell: 0, convert: 0 },
    2: { sell: 0, convert: 0 },
    3: { sell: 0, convert: 0 },
    4: { sell: 0, convert: 0 },
    5: { sell: 0, convert: 0 },
    6: { sell: 0, convert: 0 },
  }

  trackByIndex: TrackByFunction<number> = (index: number) => {
    return index
  }

  ngOnInit () {
    this.fetchState()
  }

  async fetchState () {
    this.state = await fetch('http://localhost:3000/').then(async res => await res.json())
  }

  getFilteredState (): Partial<State> {
    const stateClone: Partial<State> = clone(this.state)
    delete stateClone.config
    delete stateClone.tilesPile
    delete stateClone.playerTiles
    delete stateClone.boardTiles
    delete stateClone.discardedTiles
    delete stateClone.stocks
    return stateClone
  }

  async postInput (input?: any) {
    await fetch('http://localhost:3000/input', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: input ?? +this.input })
    }).then(() => {
      this.fetchState()
    })
  }

  getArrayFromNumber (num: number) {
    let array = new Array(num)
    for (let i = 0; i < num; i++) {
      array[i] = i
    }
    return array
  }

  exists (tile: Tile) {
    return this.state.boardTiles.some(t => isEqualTiles(t, tile))
  }

  availableToPlay (tile: Tile) {
    if (this.state.phaseId !== 'build') {
      return false
    }
    return this.getCurrentPlayerTiles().some(t => isEqualTiles(t, tile))
  }

  getCurrentPlayerTiles () {
    return this.state.playerTiles[this.state.currentPlayerIndex].tiles
  }

  onTileClick (tile: Tile) {
    if (this.state.phaseId === 'merge') {
      const hi = getWhichHotelTileBelongsTo(this.state, tile)
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

  getHotelClass (tile: Tile) {
    const hotelIndex = getWhichHotelTileBelongsTo(this.state, tile)
    if (hotelIndex === -1) {
      return ''
    }
    return 'hotel-' + hotelIndex
  }

  getHotelName (tile: Tile): string {
    const hotelIndex = getWhichHotelTileBelongsTo(this.state, tile)
    return this.state.config.hotels[hotelIndex]?.hotelName[0] || ''
  }

  getOtherClass (tile: Tile) {
    let classes: string[] = []
    if (this.exists(tile)) {
      classes.push('shield-slot')
    } else {
      classes.push('empty-slot')
    }
    if (this.availableToPlay(tile)) {
      classes.push('available-to-play rpgui-cursor-point')
    }
    return classes.join(' ')
  }

  hotelExistsOnBoard (hotelIndex: number) {
    return hotelExistsOnBoard(this.state, hotelIndex)
  }

  onHotelInfoClick (hotelIndex: number) {
    if (this.isHotelClickable(hotelIndex)) {
      this.establish(hotelIndex)
    }
  }

  isHotelClickable (hi: number) {
    return this.state.phaseId === 'establish' && !hotelExistsOnBoard(this.state, hi)
  }

  establish (hotelIndex: number) {
    this.input = hotelIndex
    this.postInput()
  }

  getHotelLegendClass (hotelIndex: number) {
    if (this.state.hotels.find(h => h.hotelIndex === hotelIndex)) {
      return 'hotel-' + hotelIndex
    }
    return ''
  }

  getHotelSize (hotelIndex: number) {
    return this.getHotelSizes()[hotelIndex]
  }

  mergeDecideNext () {
    this.postInput()
  }

  getSubtotal () {
    let subtotal = 0
    for (let i = 0; i < this.state.config.hotels.length; i++) {
      if (!this.hotelExistsOnBoard(i)) {
        continue
      }
      subtotal += getHotelStockPrice(this.state, i) * this.stockDecisions[i]
    }
    return subtotal
  }

  finish () {
    this.input = 'finish'
    this.postInput('finish')
  }

  getHotelDecisionsHotels () {
    return getWhichHotelsInvolvedInMerge(this.state, getLastPlayedTile(this.state))
      .filter(h => h > -1 && h !== this.state.mergingHotelIndex)
  }

  postInvest () {
    const stockDecisions: StockDecision[] = Object.entries(this.stockDecisions).map(([key, value]) => {
      return {
        hotelIndex: +key,
        amount: value
      }
    })
      .filter((decision: StockDecision) => decision.amount > 0)
      .filter(decision => this.hotelExistsOnBoard(decision.hotelIndex))

    this.input = stockDecisions

    this.postInput(stockDecisions).then(() => {
      Object.keys(this.stockDecisions).forEach(key => {
        this.stockDecisions[+key] = 0
      })
    })
  }

  isPossibleGameEnd () {
    return this.state.phaseId == 'build' && isPossibleGameEnd(this.state)
  }

  postMergeDecide () {
    const mergeDecisions: MergeDecision[] = Object.entries(this.mergeDecisions).map(([key, value]) => {
      return {
        hotelIndex: +key,
        sell: value.sell,
        convert: value.convert
      }
    })
      .filter((decision) => decision.sell > 0 || decision.convert > 0)
      .filter(decision => this.hotelExistsOnBoard(decision.hotelIndex))

    this.input = mergeDecisions

    this.postInput(mergeDecisions).then(() => {
      Object.keys(this.mergeDecisions).forEach(key => {
        this.mergeDecisions[+key] = { sell: 0, convert: 0 }
      })
    })
  }

  private getHotelSizes () {
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
