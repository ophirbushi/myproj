import { Component, TrackByFunction } from '@angular/core';
import { MergeDecision, State, StockDecision, Tile } from '../../../engine/models'
import { clone, getHotelSize, getHotelStockPrice, getLastPlayedTile, getWhichHotelTileBelongsTo, getWhichHotelsInvolvedInMerge, hotelExistsOnBoard, isEqualTiles, isPossibleGameEnd } from '../../../engine/helpers'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 
}
