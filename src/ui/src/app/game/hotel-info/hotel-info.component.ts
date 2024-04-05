import { Component, Input, OnChanges, OnInit } from '@angular/core'
import { State } from '../../../../../engine/models'
import { getHotelSize, getHotelStockPrice, hotelExistsOnBoard } from '../../../../../engine/helpers'

@Component({
  selector: 'app-hotel-info',
  templateUrl: './hotel-info.component.html',
  styleUrls: ['./hotel-info.component.scss']
})
export class HotelInfoComponent implements OnInit, OnChanges {
  @Input() hotelIndex!: number
  @Input() state!: State
  @Input() isClickable = false
  isOnBoard = false
  hotelName = ''
  hotelPrestige = ''
  hotelSize = 0
  hotelPrice = 0

  ngOnInit(): void {
    this.hotelName = this.state.config.hotels[this.hotelIndex].hotelName
    this.hotelPrestige = this.getHotelPrestige()
  }

  ngOnChanges(): void {
    const isOnBoard = this.isOnBoard = hotelExistsOnBoard(this.state, this.hotelIndex)
    this.hotelSize = !isOnBoard ? 0 : getHotelSize(this.state, this.hotelIndex)
    this.hotelPrice = !isOnBoard ? 0 : getHotelStockPrice(this.state, this.hotelIndex)
  }

  private getHotelPrestige(): string {
    switch (this.state.config.hotels[this.hotelIndex].prestige) {
      case 0: return '⭐⭐⭐'
      case 1: return '⭐⭐⭐⭐'
      case 2: return '⭐⭐⭐⭐⭐'
    }
    return ''
  }
}
