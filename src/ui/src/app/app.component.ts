import { Component } from '@angular/core';
import { State, Tile } from '../../../engine/models'
import { clone, getWhichHotelTileBelongsTo, isEqualTiles } from '../../../engine/helpers'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ui';
  state!: State
  input: any = null

  ngOnInit() {
    this.fetchState()
    setInterval(() => {
      this.fetchState()
    }, 1000)
  }

  async fetchState() {
    this.state = await fetch('http://localhost:3000/').then(res => res.json())
    if (this.state.phaseId === 'invest') {
      await new Promise((res) => setTimeout(res, 1))
      this.postInput()
    }
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

  postInput() {
    fetch('http://localhost:3000/input', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: +this.input })
    })
  }

  getArrayFromNumber(num: number) {
    let array = new Array(num)
    for (let i = 0; i < num; i++) {
      array[i] = i
    }
    return array
  }

  exists(tile: Tile) {
    return this.state.boardTiles.some(t => isEqualTiles(t, tile))
  }

  availableToPlay(tile: Tile) {
    if (this.state.phaseId !== 'build') {
      return false
    }
    return this.getCurrentPlayerTiles().some(t => isEqualTiles(t, tile))
  }

  getCurrentPlayerTiles() {
    return this.state.playerTiles[this.state.currentPlayerIndex].tiles
  }

  onTileClick(tile: Tile) {
    if (!this.availableToPlay(tile)) {
      return
    }
    this.input = this.getCurrentPlayerTiles().findIndex(t => isEqualTiles(t, tile))
    this.postInput()
  }

  getHotelClass(tile: Tile) {
    const hotelIndex = getWhichHotelTileBelongsTo(this.state, tile)
    if (hotelIndex === -1) {
      return ''
    }
    return 'hotel-' + hotelIndex
  }

  getOtherClass(tile: Tile) {
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

  hotelExistsOnBoard(hotelIndex: number) {
    return this.state.hotels.some(h => h.hotelIndex === hotelIndex)
  }

  establish(hotelIndex: number) {
    this.input = hotelIndex
    this.postInput()
  }
}
