import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MergeDecision, State } from '../../../../engine/models'
import { getLastPlayedTile, getWhichHotelsInvolvedInMerge, hotelExistsOnBoard } from '../../../../engine/helpers'

@Component({
  selector: 'app-merge-decisions',
  templateUrl: './merge-decisions.component.html',
  styleUrls: ['./merge-decisions.component.scss']
})
export class MergeDecisionsComponent {
  @Input() state!: State
  @Output() decide = new EventEmitter<MergeDecision[]>()

  mergeDecisions: { [key: number]: { sell: number, convert: number } } = {
    0: { sell: 0, convert: 0 },
    1: { sell: 0, convert: 0 },
    2: { sell: 0, convert: 0 },
    3: { sell: 0, convert: 0 },
    4: { sell: 0, convert: 0 },
    5: { sell: 0, convert: 0 },
    6: { sell: 0, convert: 0 },
  }

  getHotelDecisionsHotels() {
    return getWhichHotelsInvolvedInMerge(this.state, getLastPlayedTile(this.state))
      .filter(h => h > -1 && h !== this.state.mergingHotelIndex)
  }

  postMergeDecide() {
    const mergeDecisions: MergeDecision[] = Object.entries(this.mergeDecisions).map(([key, value]) => {
      return {
        hotelIndex: +key,
        sell: value.sell,
        convert: value.convert
      }
    })
      .filter((decision) => decision.sell > 0 || decision.convert > 0)
      .filter((decision) => hotelExistsOnBoard(this.state, decision.hotelIndex))
    this.decide.emit(mergeDecisions)
  }
}
