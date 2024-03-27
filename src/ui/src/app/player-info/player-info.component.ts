import { Component, Input, OnChanges, OnInit } from '@angular/core'
import { State } from '../../../../engine/models'
import { hotelExistsOnBoard } from '../../../../engine/helpers'

@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.scss']
})
export class PlayerInfoComponent implements OnInit, OnChanges {
  @Input() playerIndex!: number
  @Input() state!: State
  hotelNames: string[] = []
  playerName: string = ''
  playerCash: number = 0
  playerStocks: number[] = []
  playerCards: number = 0
  isPlayerToMove = false
  hotelsExistingOnBoard: boolean[] = []

  ngOnInit(): void {
    this.playerName = 'Player ' + (this.playerIndex + 1)
    this.hotelNames = this.state.config.hotels.map(h => h.hotelName[0])
  }

  ngOnChanges(): void {
    this.playerCash = this.state.cash[this.playerIndex]
    this.playerStocks = Object.values(this.state.stocks).map(hotelStocks => hotelStocks[this.playerIndex])
    this.playerCards = this.state.playerTiles[this.playerIndex].tiles.length
    this.isPlayerToMove = this.calcIsPlayerToMove()
    this.hotelsExistingOnBoard = this.state.config.hotels.map((_, hi) => hotelExistsOnBoard(this.state, hi))
  }

  isGrayedOut(hi: number) {
    return !this.hotelsExistingOnBoard[hi]
  }

  private calcIsPlayerToMove(): boolean {
    if (this.state.phaseId === 'mergeDecide') {
      return this.playerIndex === this.state.decidingPlayerIndex
    }
    return this.playerIndex === this.state.currentPlayerIndex
  }
}
