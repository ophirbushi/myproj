import { Component, EventEmitter, Input, Output } from '@angular/core';
import { State, Tile } from '../../../../../engine/models';
import { getWhichHotelTileBelongsTo, isEqualTiles } from '../../../../../engine/helpers';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  @Input() state!: State
  @Output() tileClick = new EventEmitter<Tile>()


  getArrayFromNumber(num: number) {
    let array = new Array(num)
    for (let i = 0; i < num; i++) {
      array[i] = i
    }
    return array
  }

  getHotelClass(tile: Tile) {
    const hotelIndex = getWhichHotelTileBelongsTo(this.state, tile)
    if (hotelIndex === -1) {
      return ''
    }
    return 'hotel-' + hotelIndex
  }

  getHotelName(tile: Tile): string {
    const hotelIndex = getWhichHotelTileBelongsTo(this.state, tile)
    return this.state.config.hotels[hotelIndex]?.hotelName[0] || ''
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

  onTileClick(tile: Tile) {
    this.tileClick.emit(tile)
  }

  private getCurrentPlayerTiles(): Tile[] {
    return this.state.playerTiles[this.state.currentPlayerIndex].tiles
  }

  private availableToPlay(tile: Tile): boolean {
    if (this.state.phaseId !== 'build') {
      return false
    }
    return this.getCurrentPlayerTiles().some(t => isEqualTiles(t, tile))
  }

  private exists(tile: Tile) {
    return this.state.boardTiles.some(t => isEqualTiles(t, tile))
  }

}
